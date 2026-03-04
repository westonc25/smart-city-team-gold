import { Elysia } from 'elysia'

import { userModel } from './model'
// Import services once implemented

export const users = new Elysia({ prefix: '/users' })
    .use(userModel)

    // Given an ID, get a users information from the database
    .get('/:id', () => "Route Accessed")

    // Given an ID, update a users information in the database
    .put('/:id', () => 'Route Accessed', { body: 'users.updateUser'})

    // Given an ID, delete a user from the database
    .delete('/:id', () => 'Route Accessed')