import * as SecureStore from 'expo-secure-store';
import { router } from 'expo-router';
import { getApiBaseUrl } from '@/lib/api-config';

const TOKEN_KEY = 'auth_token';

export const AuthService = {

    // This will call POST /auth/login from the backend and save the token on success
    async login(email: string, password: string): Promise<void> {
        const res = await fetch(`${getApiBaseUrl()}/auth/login`, {
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
        const res = await fetch(`${getApiBaseUrl()}/auth/signup`, {
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
            await fetch(`${getApiBaseUrl()}/auth/logout`, {
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

    // Calls GET /auth/validate to check if the stored token is still valid server-side.
    async validateToken(): Promise<boolean> {
        const token = await SecureStore.getItemAsync(TOKEN_KEY);
        if (!token) return false;

        try {
            const res = await AuthService.authenticatedFetch(`${getApiBaseUrl()}/auth/validate`);
            return res.ok;
        } catch {
            return false;
        }
    },

    // Wrapper around fetch that attaches the auth token and handles 401 by
    // clearing the stored token and redirecting to login.
    async authenticatedFetch(url: string, options: RequestInit = {}): Promise<Response> {
        const token = await SecureStore.getItemAsync(TOKEN_KEY);

        const res = await fetch(url, {
            ...options,
            headers: {
                ...options.headers,
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
        });

        if (res.status === 401) {
            await SecureStore.deleteItemAsync(TOKEN_KEY);
            router.replace('/login');
            throw new Error('Session expired. Please log in again.');
        }

        return res;
    },
};
