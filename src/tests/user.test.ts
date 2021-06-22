import { app, server } from '../index'
import request from 'supertest'
import { User } from '../models/users.models'


//Seding a test request to /user/register which signs a new user and returns its data
test('Should sign up a new user', async () => {
    await User.deleteMany()

    const response = await request(app)
        .post('/user/register')
        .send({
            username: "yehuda",
            email: "yehuda@yehuda.com",
            password: "yehuda12"
        })
        .expect(201)

        //Assert that the databse was changed correctly
        const user = await User.findById(response.body.user._id)
        expect(user).not.toBeNull()

        //Assert the body contains the user
        expect(response.body).toMatchObject({
            user: {
                _id: user?.id,
                email: "yehuda@yehuda.com",
                username: "yehuda",
                token: (user?.tokens[0] as any).token, //TODO: make an interface for the tokens array
            }
        })

        //Assert the password is encrypted
        expect(user?.password).not.toBe('yehuda12')
})

//Sending a test request to /user/register with an existing user name expecting it to fail
test('Should not sign up user, username already taken', async () => {
    await request(app)
        .post('/user/register')
        .send({
            username: "yehuda",
            email: "blabla@blabla.com",
            password: "yehuda12"
        })
        .expect(400)
})

//Sending a test request to /user/register to make sure user with invalid data is not being signed up
test('Should not signup a new user with invalid data', async () => {
    await request(app)
        .post('/user/register')
        .send({
            username: '$%',
            email: 'afsaf.com',
            password: '12$'
        })
        .expect(400)
})

//Sending a test request to /user/login which logs in a registered user
test('Should login a registered user', async () => {
    const response = await request(app)
        .post('/user/login')
        .send({
            email: "yehuda@yehuda.com",
            password: "yehuda12"
        })
        .expect(200)

        //Assert the token in response matches the user's second token(since we've already signed a token for the userOne)
        const user = await User.findOne({ username:"yehuda" })
        expect(response.body.user.token).toBe((user?.tokens[1] as any).token)
})

//Sending a test request to /user/login which should not login a non-existing user
test('Should not login nonexisting user', async () => {
    await request(app)
        .post('/user/login')
        .send({
            email: 'DoesntExist@atall.com',
            password: 'irrelevant'
        })
        .expect(404)
})

//Sending a test request to /user/me which returns a users data based on the token
test('Should get profile of user', async () => {
    const user = await User.findOne({ email: 'yehuda@yehuda.com' })
    expect(user).not.toBeNull()
    const response = await request(app)
        .get('/user/me')
        .set('Authorization', `Bearer ${(user?.tokens[0] as any).token}`)
        .send()
        .expect(200)

    //Assert the right user was fetched from the database
    expect(response.body.user._id).toBe(user?.id)
})

//Sending an unauthorized request to /user/me expecting it to fail
test('Should not get profile of unauthorized user', async () => {
    await request(app)
        .get('/user/me')
        .send()
        .expect(401)
})

//Sending a test request to /user/uploadimg which updates the current user image in the database
test('Should upload an image', async () => {
    //Getting the user from registration test from the database
    const user = await User.findOne({ email: 'yehuda@yehuda.com' })
    
    await request(app)
        .post('/user/uploadimg')
        .set('Authorization', `Bearer ${(user?.tokens[0] as any).token}`)
        .attach('image', 'src/tests/fixtures/profilePicture.png')
        .expect(200)
    //Assert user image has been saved in the database
    const userCheck = await User.findOne({ email: 'yehuda@yehuda.com' })
    expect(userCheck?.profilePic).not.toEqual('default.png')
})

//Sending a test request to /user/uploadimg to not upload an image with incorrect key name
test('Should not upload an image with wrong key name', async () => {
    //Getting the user from registration test from the database
    const user = await User.findOne({ email: 'yehuda@yehuda.com' })

    await request(app)
        .post('/user/uploadimg')
        .set('Authorization', `Bearer ${(user?.tokens[0] as any).token}`)
        .attach('fail', 'src/tests/fixtures/profilePicture.png')
        .expect(500)
})

//Sending a test request to /user/deleteimg to delete a profile image and replace it with the default value
test('Should delete profilePic and replace it with the default picture', async () => {
    //Getting the user from registration test from the database
    const user = await User.findOne({ email: 'yehuda@yehuda.com' })

    await request(app)
        .delete('/user/deleteimg')
        .set('Authorization', `Bearer ${(user?.tokens[0] as any).token}`)
        .send()
        .expect(200)
})

//Sending a test request to /user/update to update user's data
test('Should update user data', async () => {
    //Getting the user from the registration test from the database
    const user = await User.findOne({ email: 'yehuda@yehuda.com' })
    
    await request(app)
        .patch('/user/update')
        .set('Authorization', `Bearer ${(user?.tokens[0] as any).token}`)
        .send({
            update: {
                username: 'updatedName'
            }
        })
        .expect(200)

        //Assert the username has changed in the database
        const userCheck = await User.findOne({ email: 'yehuda@yehuda.com' })
        expect(userCheck?.username).toBe('updatedName')
})

//Sending a test request to /user/update to make sure invalid fields are note being updated
test('Should not update invalid fields', async () => {
    //Getting the user from the registration test from the database
    const user = await User.findOne({ email: 'yehuda@yehuda.com' })
    
    await request(app)
        .patch('/user/update')
        .set('Authorization', `Bearer ${(user?.tokens[0] as any).token}`)
        .send({
            update: {
                notvalidone: 'blabla'
            }
        })
        .expect(400)
})

//Sending a test request to /user/update to make sure no updates happend without authorization
test('Should not update unauthorized user', async () => {
    //Getting the user from the registration test from the database
    const user = await User.findOne({ email: 'yehuda@yehuda.com' })

    await request(app)
        .patch('/user/update')
        .send({
            update: {
                username: 'newusername'
            }
        })
        .expect(401)

        //Assert the user data in the database hasnt changed
        const userCheck = await User.findOne({ email: 'yehuda@yehuda.com' })
        expect(user?.username).toBe('updatedName')

})

//Sending a test request to /user/delete to delete a user
test('Should delete user', async () => {
    //Getting the user from registration test from the database
    const user = await User.findOne({ email: 'yehuda@yehuda.com' })
    
    await request(app)
        .delete('/user/delete')
        .set('Authorization', `Bearer ${(user?.tokens[0] as any).token}`)
        .send({
            password: 'yehuda12'
        })
        .expect(200)

        //Assert user to be null therefore has been removed
        const userCheck = await User.findOne({ email: 'yehuda@yehuda.com' })
        expect(userCheck).toBeNull
})

//Sending a test request to /user/delete to fail deleting an unauthorized user
test('Should not delete unauthorized user', async () => {
    //Getting the user from registration test from the database
    const user = await User.findOne({ email: 'yehuda@yehuda.com' })
    
    await request(app)
        .delete('/user/delete')
        .send({
            password: 'yehuda12'
        })
        .expect(401)
})

afterAll(done => {
    server.close(done);
});