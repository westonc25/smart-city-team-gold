import { status } from 'elysia'
import { db } from "../../db";

import { Session } from './model'

export abstract class UserService{
    
    // Get the User information from the users table and create a new session for the user
    static async createSession(){

    }

    // Remove a user session from the sessions table
    static async deleteSession( {sessionID}: Session.deleteSession){
        
        // Check if the session exists in the database
        const [session] = await db`
        SELECT sessionID FROM sessions
        WHERE sessionID = ${sessionID}
        LIMIT 1`;
    
        if (!session) throw status (404, "Session not found");

        // Delete the session from the database
        await db`
        DELETE FROM sessions
        WHERE sessionID = ${sessionID}
        `
    }
    
}