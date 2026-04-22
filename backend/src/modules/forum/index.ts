import { Elysia } from 'elysia'
import { ForumModel } from './model'
import { ForumService } from './service'
import { authMiddleware } from '../auth/middleware'

export const forum = new Elysia({ prefix: '/forum' })

    .use(authMiddleware)

    // Gets all posts within 15 miles of the user
    .get("/posts", ({ user }) => ForumService.getForumPost15mi(user.jti))

    // Given an ID, gets a specific post
    .get("/posts/:id", ({ params }) => ForumService.getForumPost(Number(params.id)))

    // Create a post (location pulled from user's active session)
    .post("/posts", ({ user, body }) => ForumService.createPost(user.jti, body), { body: ForumModel.createPost })

    // Given an ID, delete a post from the forum
    .delete("/posts/:id", ({ params }) => ForumService.deletePost(Number(params.id)))

    // Given a post ID, get its comments
    .get("/posts/:id/comments", ({ params }) => ForumService.getComment(Number(params.id)))

    // Given a post ID, create a comment
    .post("/posts/:id/comments", ({ params, user, body }) =>
        ForumService.createComment(Number(params.id), user.jti, body),
        { body: ForumModel.createComment })
