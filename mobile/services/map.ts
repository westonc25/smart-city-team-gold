import * as Location from 'expo-location';
import { AuthService } from './auth';

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000';

// Declare interval for getting user location every 10 minutes
let intervalId: ReturnType<typeof setInterval> | null = null;

export const MapService = { 

    // Using expo-location functions in order to get user location from their device using GPS


    // Get permission from the users to get location
    async requestPermission(): Promise<boolean> {
        const { status } = await Location.requestForegroundPermissionsAsync();
        return status === 'granted';
    },

    // Get the current coordinates from the user. 
    async getCurrentLocation(): Promise<{ latitude: number; longitude: number}> {
        const { coords } = await Location.getCurrentPositionAsync();
        return { latitude: coords.latitude, longitude: coords.longitude };
    },

    // Send the user location to the backend API
    async sendLocationToAPI(latitude: number, longitude: number): Promise<void> {
        const token = await AuthService.getToken();
        // Verify token
        if (!token) return;

        const res = await fetch(`${API_URL}/map/location`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ latitude, longitude, timestamp: new Date().toISOString() }),
        });
    },

    // Start the 10 minute interval for checking the user location
    startTracking(): void {
        MapService.requestPermission().then(granted => {
            if (!granted) return;

            intervalId = setInterval(async () => {
                const { latitude, longitude } = await MapService.getCurrentLocation();
                await MapService.sendLocationToAPI(latitude, longitude);
            }, 600000); // 10 minutes
        });
    },

    // Stop tracking and clear the interval
    stopTracking(): void {
        if (intervalId) {
            clearInterval(intervalId);
            intervalId = null;
        }
    },
    
}