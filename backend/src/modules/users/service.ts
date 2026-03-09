import { status } from 'elysia'
import { db } from "../../db";

import { UserModel } from './model'

export abstract class UserService {

    // Get a single user
    // Selects all information about a user using * and stores it in a variable called row.
    // No user found throws a 404 error
    static async getUser({id}: UserModel.getUser){
        
        const [row] = await db`
        SELECT *
        FROM users
        WHERE userID = ${id}
        LIMIT 1`;

        if (!row) throw status (404, "User not found");

        return row;
    }

    // Update user in database
    // Returns the user back for frontend to use
    static async updateUser(id: number, { first_name, last_name, email, profile_picture, password }: UserModel.updateUser) {
        
        // Updates the user in the database
        // Uses shorthand if else statement for data
        const update = await db`
        UPDATE users
        SET
            first_name = ${first_name ? first_name : undefined},
            last_name = ${last_name ? last_name : undefined},
            email = ${email ? email : undefined},
            profile_picture = ${profile_picture ? profile_picture : undefined},
            password = ${password ? password : undefined},
        WHERE userID = ${id}
        `

        // Return the update user infromation
        const [updated] = await db`
        SELECT *
        FROM users
        WHERE userID = ${id}
        LIMIT 1`;

        return updated;

    }

    // Get all users

    // Delete a user
    static async deleteUser({id}: UserModel.deleteUser){
        
        const [row] = await db`
        DELETE FROM users
        WHERE userID = ${id}
        LIMIT 1`;

        if (!row) throw status (404, "User not found");

        return row;
    }

}