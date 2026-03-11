import { status } from 'elysia'
import { db } from "../../db";

import { Session } from './model'

export abstract class UserService{
    
    // Get the User information from the users table and create a new session for the user
    static async createSession(){

    }

    // Remove a user session from the sessions table
    static async deleteSession(){

    }

    // Retrieve the users location for the current location table
    static async getLocation(){
        
    }
}