import { status } from "elysia";
import { db } from "../../db";

import { ForumModel } from "./model";

export abstract class UserService {
  // Store a new created forum post
  static async createPost() {
    const [row] = await db`
        
        `;
  }

  // Store a new created comment on a forum post
  static async createComment() {
    const [row] = await db`
        
        `;
  }

  // Catch all for forum post search parameters
  // Need the postID or the userID or the time and location
  static async getForumPost(id: number) {
    const [post] = await db`
        SELECT *
        FROM forum_post
        WHERE post_id = ${id}
        LIMIT 1`;

        if (!post) throw status (404, "Post not found");

        return post;
  }

  // Catch all for comment search parameters
  // Need the postID or the userID
  static async getComment(id: number) {
    const [comment] = await db`
        SELECT *
        FROM forum_comments
        WHERE comment_id = ${id}
        LIMIT 1`;

        if (!comment) throw status (404, "Comment not found");

        return comment;
  }

  // Delete a forum post given the postID
  // Returns a success message if the post is deleted successfully
  // Throws a 404 error if the post is not found
  static async deletePost(id: number) {

    const [post] = await db`
    SELECT post_id FROM forum_post
    WHERE post_id = ${id}
    LIMIT 1`;
    
    if (!post) throw status(404, "Post not found");

    await db`
    DELETE FROM forum_post
    WHERE post_id = ${id}`;

    return { message: "Post deleted successfully" };
  }

  // Delete a comment given the commentID
  // Returns a success message if the comment is deleted successfully
  // Throws a 404 error if the comment is not found
  static async deleteComment(id: number) {
    
    const [comment] = await db`
    SELECT comment_id FROM forum_comments
    WHERE comment_id = ${id}
    LIMIT 1`;
    
    if (!comment) throw status(404, "Comment not found");

    await db`
    DELETE FROM forum_comments
    WHERE comment_id = ${id}`;

    return { message: "Comment deleted successfully" };
  }
}
