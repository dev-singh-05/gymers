import { supabase } from './supabase';
import { createProfile } from './db';

// ============ SIGN UP ============
// Creates a new user in Supabase Auth and creates their profile
export async function signUp(email: string, password: string, name?: string) {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
    });

    if (error) throw error;

    // Create profile for the new user
    if (data.user) {
        try {
            await createProfile(data.user.id, email, name);
        } catch (profileError) {
            console.error('Error creating profile:', profileError);
        }
    }

    return data;
}

// ============ SIGN IN ============
// Logs in an existing user
export async function signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) throw error;
    return data;
}

// ============ SIGN OUT ============
// Logs out the current user
export async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
}

// ============ GET CURRENT USER ============
// Returns the currently logged-in user (or null)
export async function getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
}

// ============ AUTH STATE LISTENER ============
// Subscribe to auth changes (login/logout events)
export function onAuthStateChange(callback: (user: any) => void) {
    return supabase.auth.onAuthStateChange((event, session) => {
        callback(session?.user || null);
    });
}
