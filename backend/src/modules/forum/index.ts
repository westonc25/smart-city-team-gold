import { Elysia } from 'elysia'
import { ForumModel } from './model'
<<<<<<< HEAD
import { ForumService } from './service'

export const forum = new Elysia({ prefix: '/forum' })

    // Gets all the posts from the forum (Requires JTI for location)
    // You can hook this up to a specific route later once auth is fully integrated
    .get("/posts", () => 'Route Accessed, All Posts Pulled')

    // Given an ID, gets a specific post
    .get("/posts/:id", ({ params: { id } }) => ForumService.getForumPost(Number(id)))

    // Create a post
    .post("/posts", ({ body }) => ForumService.createPost(body), { 
        body: ForumModel.createPost 
    })

     // Given an ID, delete a post from the forum
    .delete("/posts/:id", ({ params: { id } }) => ForumService.deletePost(Number(id)))

    // Given a comment ID, get a comment
    .get("/comments/:id", ({ params: { id } }) => ForumService.getComment(Number(id)))

    // Given a post ID, create a comment
    .post("/posts/:id/comments", ({ body }) => ForumService.createComment(body), { 
        body: ForumModel.createComment 
    })
=======
import { UserService } from './service'
import { authMiddleware } from '../auth/middleware'

export const forum = new Elysia({ prefix: '/forum' })

    .use(authMiddleware)

    // Gets all posts within 15 miles of the user
    .get("/posts", ({ user }) => UserService.getForumPost15mi(user.jti))

    // Given an ID, gets a specific post
    .get("/posts/:id", ({ params }) => UserService.getForumPost(Number(params.id)))

    // Create a post (location pulled from user's active session)
    .post("/posts", ({ user, body }) => UserService.createPost(user.jti, body), { body: ForumModel.createPost })

    // Given an ID, delete a post from the forum
    .delete("/posts/:id", ({ params }) => UserService.deletePost(Number(params.id)))

    // Given a post ID, get its comments
    .get("/posts/:id/comments", ({ params }) => UserService.getComment(Number(params.id)))

    // Given a post ID, create a comment
    .post("/posts/:id/comments", ({ params, user, body }) =>
        UserService.createComment(Number(params.id), user.id, body),
        { body: ForumModel.createComment })
>>>>>>> b97b3ac (finished implementing forum and map in the backend, connected forum to the frontend and fixed some minor bugs.)
