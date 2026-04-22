import { Elysia } from 'elysia'

import { UserModel } from './model'
import { UserService } from './service'
import { authMiddleware } from '../auth/middleware'

export const users = new Elysia({ prefix: '/users' })

    .use(authMiddleware)

    // Given an ID, get a users information from the database
    .get('/:id', ({ params }) => UserService.getUser(Number(params.id)))

    // Given an ID, update a users information in the database
    .put('/:id', ({ params, body }) => UserService.updateUser(Number(params.id), body), { body: UserModel.updateUser })

    // Given an ID, delete a user from the database
    .delete('/:id', ({ params }) => UserService.deleteUser(Number(params.id)))