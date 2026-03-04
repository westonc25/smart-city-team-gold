import { Elysia } from 'elysia'

import { forumModel } from './model'
// Import services once implemented

export const forum = new Elysia({ prefix: '/forum' })
    .use(forumModel)

    // Gets all the posts from the forum

    .get("/posts", () => 'Route Accessed, All Posts Pulled')
    
    // Given an ID, gets a specific post
    
    .get("/posts/:id", () => 'Route Accessed, Post Pulled')

    // Create a post 

    .post("/posts", () => 'Route Accessed, Post Created', { body: 'forum.createPost' })

     // Given an ID, delete a post from the forum
    
    .delete("/posts/:id", () => 'Route Accessed, Post Deleted')

    // Given an ID, get a comment

    .get("/posts/:id/comments", () => 'Route Accessed, Comment Pulled')

    // Given a post ID, create a comment

    .post("/posts/:id/comments",
         () => 'Route Accessed, Comment Created',
          { body: 'forum.createComment' })