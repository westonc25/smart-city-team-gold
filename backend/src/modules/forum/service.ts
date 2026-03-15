import { status } from "elysia";
import { db } from "../../db";

import { ForumModel } from "./model";
import { AuthService} from "../auth/service";

export abstract class UserService {
  // Store a new created forum post
  static async createPost({jti, title, content ,location_name, category}: ForumModel.createPost) {
    
    // Get user current locaiton
    // Talk to sessions table first
    // Get the latitude and longitude from the point variable in the current location table
    const [session] = await AuthService.getSessionWithLocation(jti);
    if (!session) throw new Error("Invalid or expired session");

    // Pass the lat and lon to the forum post table
    // Store the lat and lon in the form of a point
    // Add the post to the database with the new point variable
    await db`
        INSERT INTO forum_post (user_session_id, title, content, location_name, category, geo_point)
        VALUES (
            ${session.sessions_id},
            ${title},
            ${content},
            ${location_name},
            ${category},
            ${session.geo_point}
        )
    `;


   // Check that the post was created successfully
    const [row] = await db`
        SELECT * FROM forum_post
        WHERE user_session_id = ${session.sessions_id}
        ORDER BY created_at DESC
        LIMIT 1
    `;

    if (!row) throw new Error("Post creation failed");

    // Return success message
    return { success: true, message: "Post created successfully", post: row };

  }

  // Store a new created comment on a forum post
  static async createComment({ post_id, user_id, content }: ForumModel.createComment) {
    
    // Retreive the post to ensure it exists
    const [post] = await db`
        SELECT post_id FROM forum_post
        WHERE post_id = ${post_id}
        LIMIT 1
        `;

    // If the post doesn't exist, throw an error
    if (!post) throw status(404, "Post not found");

    // Insert the comment into the database
    const [comment] = await db`
      INSERT INTO forum_comments (post_id, user_id, content, created_at, updated_at)
      VALUES (${post_id}, ${user_id}, ${content}, NOW(), NOW())
      RETURNING *
    `;

    return comment;
  }

  // Catch all for forum post search parameters
  // Need the postID or the userID or the time and location
  static async getForumPost(id: number) {
    
    // Verify the user session token to see if they are logged in and can access the post

    // Add a WHERE clause based on the radius from the geo_spat table for a user
    // get users location and their radius and make a WHERE in range {center} <= {post} <= {outward radius} returns * posts from forum_post
    
    const [post] = await db`
        SELECT *
        FROM forum_post
        WHERE post_id = ${id}
        LIMIT 1`;

        if (!post) throw status (404, "Post not found");

        return post;
  }

  // Gets the forum post within a 15 mile radius of the user
  static async getForumPost15mi(jti: string) {
    
    // Get user current locaiton
    const [session] = await AuthService.getSessionWithLocation(jti);
    if (!session) throw new Error("Invalid or expired session");

    // get forum posts within 15 miles of the user
    const posts = await db`
        SELECT 
          fp.*, 
          ST_Distance_Sphere(fp.geo_point, ${session.geo_point}) * 0.000621371 AS distance_miles
        FROM forum_post fp
        WHERE fp.is_deleted = 0 
        AND ST_Distance(fp.geo_point, ${session.geo_point}) <= 24140.2
        ORDER BY fp.created_at DESC
        `;
        
    return posts;

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
