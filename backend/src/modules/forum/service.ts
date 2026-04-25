import { status } from "elysia";
import { db } from "../../db";

import { ForumModel } from "./model";
import { AuthService} from "../auth/service";

export abstract class ForumService {
  // Store a new created forum post
  static async createPost(jti: string, {title, content, location_name, category}: ForumModel.createPost) {

    // Get user current location
    // Talk to sessions table first
    // Get the latitude and longitude from the point variable in the current location table
    const session = await AuthService.getSessionWithLocation(jti);
    if (!session) throw new Error("Invalid or expired session");

    // Fetch author name from users via the session before inserting
    const [user] = await db`
      SELECT u.first_name, u.last_name
      FROM users u
      WHERE u.userID = ${session.user_id}
      LIMIT 1
    `;
    if (!user) throw new Error("User not found");

    // Pass the lat and lon to the forum post table
    // Store the lat and lon in the form of a point
    // Add the post to the database with the new point variable
    // Set is_deleted = 0 to mark the post as active on creation
    await db`
        INSERT INTO forum_post (user_session_id, title, content, location_name, category, geo_point, first_name, last_name, is_deleted)
      VALUES (
        ${session.sessions_id},
        ${title},
        ${content},
        ${location_name},
        ${category},
        ${session.geo_point},
        ${user.first_name},
        ${user.last_name},
        0
      )
    `;


   // Check that the post was created successfully
    const [row] = await db`
        SELECT *, CONCAT(first_name, ' ', last_name) AS author, NULL AS user_vote
        FROM forum_post
        WHERE user_session_id = ${session.sessions_id}
        ORDER BY created_at DESC
        LIMIT 1
    `;

    if (!row) throw new Error("Post creation failed");

    // Return success message
    return { success: true, message: "Post created successfully", post: row };

  }

  // Store a new created comment on a forum post
  static async createComment(post_id: number, jti: string, { content }: ForumModel.createComment) {

    // Get session to verify the user
    const session = await AuthService.getSessionWithLocation(jti);
    if (!session) throw new Error("Invalid or expired session");

    // Retrieve the post to ensure it exists and is not deleted
    const [post] = await db`
        SELECT post_id FROM forum_post
        WHERE post_id = ${post_id} AND is_deleted = 0
        LIMIT 1
        `;

    // If the post doesn't exist, throw an error
    if (!post) throw status(404, "Post not found");

    // Fetch author name from users via the session before inserting
    const [user] = await db`
      SELECT u.first_name, u.last_name
      FROM users u
      WHERE u.userID = ${session.user_id}
      LIMIT 1
    `;
    if (!user) throw new Error("User not found");

    // Insert the comment into the database
    await db`
      INSERT INTO forum_comments (post_id, user_session_id, content, created_at, updated_at, first_name, last_name)
      VALUES (
        ${post_id},
        ${session.sessions_id},
        ${content},
        NOW(),
        NOW(),
        ${user.first_name},
        ${user.last_name})
    `;

    const [comment] = await db`
      SELECT *, CONCAT(first_name, ' ', last_name) AS author, NULL AS user_vote
      FROM forum_comments
      WHERE user_session_id = ${session.sessions_id}
        AND post_id         = ${post_id}
      ORDER BY created_at DESC
      LIMIT 1
    `;

    if (!comment) throw new Error("Comment creation failed");

    return comment;
  }

  // Get a single forum post by post_ID
  static async getForumPost(id: number) {

    // Verify the user session token to see if they are logged in and can access the post

    // Add a WHERE clause based on the radius from the geo_spat table for a user
    // get users location and their radius and make a WHERE in range {center} <= {post} <= {outward radius} returns * posts from forum_post

    const [post] = await db`
        SELECT *, CONCAT(first_name, ' ', last_name) AS author, NULL AS user_vote
        FROM forum_post
        WHERE post_id = ${id} AND is_deleted = 0
        LIMIT 1`;

        if (!post) throw status (404, "Post not found");

        return post;
  }

  // Gets the forum post within a 15 mile radius of the user
  static async getForumPost15mi(jti: string) {

    // Get user current location
    const session = await AuthService.getSessionWithLocation(jti);
    if (!session) throw new Error("Invalid or expired session");

    // get forum posts within 15 miles of the user
    const posts = await db`
        SELECT
          fp.*,
          CONCAT(fp.first_name, ' ', fp.last_name) AS author,
          (SELECT direction FROM forum_post_votes WHERE post_id = fp.post_id AND user_id = ${session.user_id} LIMIT 1) AS user_vote,
          ST_Distance_Sphere(fp.geo_point, ${session.geo_point}) * 0.000621371 AS distance_miles
        FROM forum_post fp
        WHERE fp.is_deleted = 0
        AND ST_Distance(fp.geo_point, ${session.geo_point}) <= 24140.2
        ORDER BY fp.created_at DESC
        `;

    return posts;

  }

  // Get all comments for a given post
  static async getCommentsByPost(postId: number, userId?: number) {
    const comments = await db`
      SELECT *,
        CONCAT(first_name, ' ', last_name) AS author,
        ${userId
          ? db`(SELECT direction FROM forum_comment_votes WHERE comment_id = fc.comment_id AND user_id = ${userId} LIMIT 1)`
          : db`NULL`
        } AS user_vote
      FROM forum_comments fc
      WHERE fc.post_id = ${postId}
      ORDER BY fc.created_at ASC
    `;
    return comments;
  }

  // Catch all for comment search parameters
  // Need the postID or the userID
  static async getComment(id: number) {
    const [comment] = await db`
        SELECT *, CONCAT(first_name, ' ', last_name) AS author, NULL AS user_vote
        FROM forum_comments
        WHERE comment_id = ${id}
        LIMIT 1`;

        if (!comment) throw status (404, "Comment not found");

        return comment;
  }

  // Delete a forum post given the postID
  // Soft deletes the post by setting is_deleted = 1
  // Returns a success message if the post is deleted successfully
  // Throws a 404 error if the post is not found
  static async deletePost(id: number) {

    // Check that the post exists and is not already deleted
    const [post] = await db`
    SELECT post_id FROM forum_post
    WHERE post_id = ${id} AND is_deleted = 0
    LIMIT 1`;

    if (!post) throw status(404, "Post not found");

    // Soft delete the post by setting is_deleted = 1
    await db`
    UPDATE forum_post
    SET is_deleted = 1, updated_at = NOW()
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

  static async votePost({ post_id, user_id, direction }: { post_id: number, user_id: number, direction: 'up' | 'down' | null }) {
    const [existing] = await db`
      SELECT direction FROM forum_post_votes
      WHERE post_id = ${post_id} AND user_id = ${user_id}
      LIMIT 1
    `;

    if (direction === null) {
      if (existing) {
        await db`DELETE FROM forum_post_votes WHERE post_id = ${post_id} AND user_id = ${user_id}`;
        if (existing.direction === 'up') {
          await db`UPDATE forum_post SET upvotes = GREATEST(upvotes - 1, 0) WHERE post_id = ${post_id}`;
        } else {
          await db`UPDATE forum_post SET downvotes = GREATEST(downvotes - 1, 0) WHERE post_id = ${post_id}`;
        }
      }
    } else if (!existing) {
      await db`INSERT INTO forum_post_votes (post_id, user_id, direction) VALUES (${post_id}, ${user_id}, ${direction})`;
      if (direction === 'up') {
        await db`UPDATE forum_post SET upvotes = upvotes + 1 WHERE post_id = ${post_id}`;
      } else {
        await db`UPDATE forum_post SET downvotes = downvotes + 1 WHERE post_id = ${post_id}`;
      }
    } else if (existing.direction !== direction) {
      await db`UPDATE forum_post_votes SET direction = ${direction} WHERE post_id = ${post_id} AND user_id = ${user_id}`;
      if (direction === 'up') {
        await db`UPDATE forum_post SET upvotes = upvotes + 1, downvotes = GREATEST(downvotes - 1, 0) WHERE post_id = ${post_id}`;
      } else {
        await db`UPDATE forum_post SET downvotes = downvotes + 1, upvotes = GREATEST(upvotes - 1, 0) WHERE post_id = ${post_id}`;
      }
    }

    const [post] = await db`SELECT upvotes, downvotes FROM forum_post WHERE post_id = ${post_id} LIMIT 1`;
    const [userVoteRow] = await db`
      SELECT direction FROM forum_post_votes WHERE post_id = ${post_id} AND user_id = ${user_id} LIMIT 1
    `;

    return {
      upvotes: Number(post?.upvotes ?? 0),
      downvotes: Number(post?.downvotes ?? 0),
      userVote: (userVoteRow?.direction ?? null) as 'up' | 'down' | null,
    };
  }

  static async voteComment({ comment_id, user_id, direction }: { comment_id: number, user_id: number, direction: 'up' | 'down' | null }) {
    const [existing] = await db`
      SELECT direction FROM forum_comment_votes
      WHERE comment_id = ${comment_id} AND user_id = ${user_id}
      LIMIT 1
    `;

    if (direction === null) {
      if (existing) {
        await db`DELETE FROM forum_comment_votes WHERE comment_id = ${comment_id} AND user_id = ${user_id}`;
        if (existing.direction === 'up') {
          await db`UPDATE forum_comments SET upvotes = GREATEST(upvotes - 1, 0) WHERE comment_id = ${comment_id}`;
        } else {
          await db`UPDATE forum_comments SET downvotes = GREATEST(downvotes - 1, 0) WHERE comment_id = ${comment_id}`;
        }
      }
    } else if (!existing) {
      await db`INSERT INTO forum_comment_votes (comment_id, user_id, direction) VALUES (${comment_id}, ${user_id}, ${direction})`;
      if (direction === 'up') {
        await db`UPDATE forum_comments SET upvotes = upvotes + 1 WHERE comment_id = ${comment_id}`;
      } else {
        await db`UPDATE forum_comments SET downvotes = downvotes + 1 WHERE comment_id = ${comment_id}`;
      }
    } else if (existing.direction !== direction) {
      await db`UPDATE forum_comment_votes SET direction = ${direction} WHERE comment_id = ${comment_id} AND user_id = ${user_id}`;
      if (direction === 'up') {
        await db`UPDATE forum_comments SET upvotes = upvotes + 1, downvotes = GREATEST(downvotes - 1, 0) WHERE comment_id = ${comment_id}`;
      } else {
        await db`UPDATE forum_comments SET downvotes = downvotes + 1, upvotes = GREATEST(upvotes - 1, 0) WHERE comment_id = ${comment_id}`;
      }
    }

    const [comment] = await db`SELECT upvotes, downvotes FROM forum_comments WHERE comment_id = ${comment_id} LIMIT 1`;
    const [userVoteRow] = await db`
      SELECT direction FROM forum_comment_votes WHERE comment_id = ${comment_id} AND user_id = ${user_id} LIMIT 1
    `;

    return {
      upvotes: Number(comment?.upvotes ?? 0),
      downvotes: Number(comment?.downvotes ?? 0),
      userVote: (userVoteRow?.direction ?? null) as 'up' | 'down' | null,
    };
  }
}
