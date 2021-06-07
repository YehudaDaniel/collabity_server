import request from 'supertest'
import { app } from '../index'
import { setupDataBase, userOne } from './fixtures/db'

beforeEach(setupDataBase)

test('Should create project for user', async () => {
    const response = await request(app)
        .post('/project/create')
        .set('Authorization', `Bearer ${(userOne?.tokens[0] as any).token}`)
        .send({
            title: "First project",
            content: "yea it is"
        })
        .expect(201)
})