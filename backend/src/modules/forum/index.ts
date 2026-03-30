import { Elysia } from 'elysia'
import { ForumModel } from './model'
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