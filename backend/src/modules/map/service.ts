

export abstract class MapService {
    // Update user location
    static async updateLocation(userId: string, latitude: number, longitude: number, timestamp: string){
        // TODO: Calls to DB
        console.log(`Location update for user ${userId}:`, { latitude, longitude, timestamp });
    }
}

// Get all users by location