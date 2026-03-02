import { Elysia, t } from "elysia";
import { getPosts, getPost, createPost, deletePost, getComments, createComment } from "../controllers/forum";

export const forumRoutes = new Elysia({ prefix: "/api/forum" })
  // Gets all the posts in the forum at the time

  .get("/posts", getPosts)

  // Gets a specific post

  .get("/posts/:id", getPost)

  // Create a post to the forum

  .post("/posts", createPost, {
    body: t.Object({
      user_id: t.Number(),
      title: t.String(),
      content: t.String(),
      latitude: t.Optional(t.Number()),
      longitude: t.Optional(t.Number()),
      location_name: t.Optional(t.String()),
      category: t.Optional(t.String()),
    })
  })

  // Delete a post from the forum

  .delete("/posts/:id", deletePost)

  // Get a specific comment from a post

  .get("/posts/:id/comments", getComments)

  // Get all the comments from a post at the time
  
  .post("/posts/:id/comments", createComment, {
    body: t.Object({
      user_id: t.Number(),
      content: t.String(),
    })
  })