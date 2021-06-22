import request from 'supertest'
import { app, server } from '../index'
import { Project } from '../models/projects.models'
import { setupDataBase, userOne, userOneId, userTwo, userTwoId } from './fixtures/db'

//This function runs before each test case in this test suite
beforeEach(setupDataBase)

//Sending a test request to /project/create to create a new project
test('Should create a new project', async () => {
    const response = await request(app)
        .post('/project/create')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            title: "First test project",
            content: "This is the first test project"
        })
        .expect(201)
    //Assert the project was created
    //Assert the project owner is the user who created it
    const project = await Project.findById(response.body._id)
    expect(project).not.toBeNull()
    expect(project?.owner).toEqual(userOneId)
})

//Sending a test request to /project/create to create a new project with the same name but to another user
test('Should create a new project with the same name but for another user', async () => {
    const response = await request(app)
        .post('/project/create')
        .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
        .send({
            title: 'First test project',
            content: 'This is the first test project'
        })
        .expect(201)

    //Assert the project was created
    //Assert the project owner is the user who created it
    const project = await Project.findById(response.body._id)
    expect(project).not.toBeNull()
    expect(project?.owner).toEqual(userTwoId)
})

//Sending a test request to /project/create with an existing project title expecting it to fail
test('Should not create project, title already taken', async () => {
    const response = await request(app)
        .post('/project/create')
        .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
        .send({
            title: 'First project',
            content: 'Blalblabla'
        })
        .expect(400)
})

//Sending a test request to /project/create with bad data, expecting it to fail
test('Should not create a new project', async () => {
    await request(app)
        .post('/project/create')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            title: "Should fail"
        })
        .expect(400)
})

//Sending a test request to /project/readmany to read 3 projects sorted by a descending order
test('Should read the last created project', async () => {
    const response = await request(app)
        .get('/project/readmany?limit=1&sortBy=createdAt_desc')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)

    //Assert the project that have returned is the last one created, meaning the third one
    const project = response.body[0]
    expect(project.title).toEqual('Third project')
})

//Sending a test request to /project/readmany to read 3 projects sorted by a ascending order
test('Should read projects by a limited specified number', async () => {
    const response = await request(app)
        .get('/project/readmany?limit=3')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)

    //Assert all three projects were fetched on the response
    const projects = response.body
    expect(projects.length).toBe(3)
})

//Sending a test request to /project/read with data(username and title of the project blongs to him) and getting back that individual project
test('Should read an individual project', async () => {
    const response = await request(app)
        .get('/project/read/test/Second_project')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
    //Assert the title of the fetched project is correct
    const project = response.body
    expect(project.title).toBe('Second project')
})

//Sending a test request to /project/read without authentication expecting it to fail
test('Should not read an individual project, unauthorized', async () => {
    await request(app)
        .get('/project/read/test/Second_project')
        .send()
        .expect(401)
})

//Sending a test request to /project/update/:projectname to update either title or content
test('Should update project data', async () => {
    const response = await request(app)
        .patch('/project/update/First_project')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            update: {
                title: 'changed',
                content: 'also changed'
            }
        })
        .expect(200)
    //Assert the title of the project has changed
    const project = response.body
    expect(project.title).toBe("changed")
})

//Sending a test request to /project/update/:projectname to update only content
test('Should update only one project data', async () => {
    const response = await request(app)
        .patch('/project/update/First_project')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            update: {
                content: 'Easy money'
            }
        })
        .expect(200)
    //Assert the content of the project has changed
    const project = response.body
    expect(project.content).toBe("Easy money")
})

//Sending a test request to /project/update/:projectname with false projectname expecting it to fail
test('Should not find a nonexisting project', async () => {
    await request(app)
        .patch('/project/update/notexistbla')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            update: {
                title: 'Trying to change',
                content: 'Most likely failed to change'
            }
        })
        .expect(404)
})

//Sending a test request to /project/update/:projectname with unallowed key values expecting it to fail
test('Should not update unallowed keys', async () => {
    await request(app)
        .patch('/project/update/First_project')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            update: {
                participants: ['Moshe', 'Shmuel'],
                features: ['Mike', 'McCollumn']
            }
        })
        .expect(400)
})


//Sending a test request to /project/update/features/:projectname to upload new features or update them
test.todo('Should update the features array list of a project')

//Sending a test request to __________ to update a project of another user using permissions

//Sending a test request to /project/update/participants/:projectname to update participants add/delete
test('Should update participants array list', async () => {
    const response = await request(app)
        .patch('/project/update/participants/First_project')
        .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
        .send({
            update: {
                participants: [{
                    username: "Yehuda"
                }]
            }
        })
        .expect(200)

    //Assert participants permissions is a participant by default
    const participantPermissions = response.body.participants[0].permissions
    expect(participantPermissions).toBe("Participant")

})

//Sending a test request to /project/update/participants/:projectname with false data expecting it to fail
test('Should not update participants array list', async () => {
    await request(app)
        .patch('/project/update/participants/First_project')
        .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
        .send({
            update: {
                features: ['Mike', 'Sam', 'Marshell']
            }
        })
        .expect(400)
})

//Sending a test request to __________ to delete a single project

//Sending a test request to __________ to delete features from a project

//Sending a test request to __________ to pull permissions rank

//Terminates the server after all the tests ran
afterAll(done => {
    server.close(done);
});
