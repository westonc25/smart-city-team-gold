import * as SecureStore from 'expo-secure-store';

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000';
const TOKEN_KEY = 'auth_token';

export const AuthService = {

    // This will call POST /auth/login from the backend and save the token on success
    async login(email: string, password: string): Promise<void> {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        if (!res.ok) throw new Error((await res.text()) || 'Login failed');

        const { token } = await res.json();
        await SecureStore.setItemAsync(TOKEN_KEY, token);
    },

    // This will call POST /auth/signup from the backend 
    async signup(email: string, password: string, first_name: string, last_name: string): Promise<void> {
        const res = await fetch(`${API_URL}/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, first_name, last_name }),
        });

        if (!res.ok) throw new Error((await res.text()) || 'Signup failed');
    },

    // This will call POST /auth/logout from the backend and remove the token from device
    async logout(): Promise<void> {
        const token = await SecureStore.getItemAsync(TOKEN_KEY);
        if (token) {
            await fetch(`${API_URL}/auth/logout`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
            });
            await SecureStore.deleteItemAsync(TOKEN_KEY);
        }
    },

    // Read the stored token (null if not logged in)
    async getToken(): Promise<string | null> {
        return SecureStore.getItemAsync(TOKEN_KEY);
    },
};
