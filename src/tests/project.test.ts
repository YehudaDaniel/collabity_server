import request from 'supertest'
import { app, server } from '../index'
import { Project } from '../models/projects.models'
import { setupDataBase, userOne, userOneId } from './fixtures/db'

//This function runs before each test case in this test suite
beforeEach(setupDataBase)

// //Sending a test request to /project/create to create a new project
test('Should create a new project', async () => {
    const response = await request(app)
        .post('/project/create')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            title: "First test project",
            content: "This is the first test project"
        })
        .expect(201)
    //Assert the task was created
    //Assert the task owner is the user who created it
    const project = await Project.findById(response.body._id)
    expect(project).not.toBeNull()
    expect(project?.owner).toEqual(userOneId)
})

test('Should read the third and last created project', async () => {
    const response = await request(app)
        .get('/project/read?limit=1&sortBy=createdAt_desc')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)

        //Assert the project that have returned is the last one created, meaning the third one
        const project = response.body[0]
        expect(project.title).toEqual('Third project')
})

test.todo('Should read projects by a limited specified number')

afterAll(done => {
    server.close(done);
});
