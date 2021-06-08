import request from 'supertest'
import { app, server } from '../index'
import { Project } from '../models/projects.models'
import { setupDataBase, userOne, userOneId } from './fixtures/db'

beforeEach(setupDataBase)

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

afterAll(done => {
    server.close(done);
});
