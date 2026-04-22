<<<<<<< HEAD
import { status } from "elysia";
import { db } from "../../db";
 
import { MapModel } from "./model";

export abstract class MapService {

    // Insert or update the current location for the active session.
    // - If the user has an active session, update the location.
    // - If the user does not have an active session, create a new session with the location.
    static async updateLocation(userId: string, latitude: number, longitude: number, timestamp: string){
        
        // Convert the timestamp string to a Date object for the DB
        const locationTimestamp = new Date(timestamp);
        if (isNaN(locationTimestamp.getTime())) throw new Error("Invalid timestamp");

        // Get the current session for the user from the sessions table
        const [session] = await db`
            SELECT sessions_id, location_id
            FROM sessions
            WHERE user_id = ${Number(userId)}
            ORDER BY created_at DESC
            LIMIT 1
        `;
        if (!session) throw new Error("No active session found for user");

        // Turn the latitude and longitude into a point variable
        const pointWKT = `POINT(${longitude} ${latitude})`;

        // Check for current location already existing
        const [existing] = await db`
            SELECT current_location_id
            FROM current_location
            WHERE session_id = ${session.sessions_id}
            LIMIT 1
            `;
 
        if (existing) {
            // UPDATE the existing row with the new geo_point and timestamp from client
            // String wont work in the db
            await db`
                UPDATE current_location
                SET
                    geo_point  = ST_GeomFromText(${pointWKT}, 4326),
                    created_at = ${locationTimestamp} 
                WHERE current_location_id = ${existing.current_location_id}
            `;
 
            return {
                success: true,
                message: "Location updated",
            };
 
        } else {
            // INSERT a new current_location row for this session
            await db`
                INSERT INTO current_location (session_id, user_id, geo_point, created_at)
                VALUES (
                    ${session.sessions_id},
                    ${Number(userId)},
                    ST_GeomFromText(${pointWKT}, 4326),
                    ${locationTimestamp}
                )
            `;

            // Fetch the new row's ID so we can wire up sessions.location_id
            const [newLocation] = await db`
                SELECT current_location_id
                FROM current_location
                WHERE session_id = ${session.sessions_id}
                ORDER BY created_at DESC
                LIMIT 1
            `;
            if (!newLocation) throw new Error("Location insert failed");
            
            // Point sessions.location_id at the new row so getSessionWithLocation
            // can join correctly in the forum and other services

            await db`
                UPDATE sessions
                SET location_id = ${newLocation.current_location_id}
                WHERE sessions_id = ${session.sessions_id}
            `;

            
            return { success: true, message: "Location created" };
        }
    }
}    

// Get all users by location
=======
import { db } from "../../db";

export abstract class MapService {

    // Saves the user's current location and links it to their active session.
    // This is needed for the getForumPosts15mi.
    static async updateLocation(jti: string, latitude: number, longitude: number) {

        // Find the active session to check if a location row already exists
        const [session] = await db`
            SELECT sessions_id, location_id
            FROM sessions
            WHERE jti = ${jti} AND expires_at > NOW()
            LIMIT 1
        `;

        if (!session) return { success: false, message: 'Session not found or expired' };

        if (session.location_id) {
            // Update the existing location row in place
            await db`
                UPDATE current_location
                SET geo_point = POINT(${longitude}, ${latitude})
                WHERE current_location_id = ${session.location_id}
            `;
        } else {
            // Insert a new location row and link it to the session
            await db`
                INSERT INTO current_location (geo_point)
                VALUES (POINT(${longitude}, ${latitude}))
            `;

            const [{ lastId }] = await db`SELECT LAST_INSERT_ID() AS lastId`;

            await db`
                UPDATE sessions
                SET location_id = ${lastId}
                WHERE sessions_id = ${session.sessions_id}
            `;
        }

        return { success: true };
    }
}
>>>>>>> b97b3ac (finished implementing forum and map in the backend, connected forum to the frontend and fixed some minor bugs.)
