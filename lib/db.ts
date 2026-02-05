import { supabase } from './supabase';

// =============================================
// PROFILE FUNCTIONS
// =============================================

export interface Profile {
    id: string;
    user_id: string;
    name: string | null;
    email: string | null;
    avatar_url: string | null;
    created_at: string;
}

export async function getProfile(userId: string): Promise<Profile | null> {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

    // Gracefully handle missing table or no data (PGRST116 = no rows found)
    if (error && error.code !== 'PGRST116') {
        // Only log actual errors, not "no rows found"
        if (error.code !== '42P01') { // 42P01 = table doesn't exist
            console.error('Error fetching profile:', error);
        }
        return null;
    }
    return data;
}

export async function createProfile(userId: string, email: string, name?: string) {
    const { data, error } = await supabase
        .from('profiles')
        .insert({
            user_id: userId,
            email,
            name: name || email.split('@')[0],
        })
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function updateProfile(userId: string, updates: Partial<Pick<Profile, 'name' | 'avatar_url'>>, email?: string) {
    // Try to update first
    const { data: existing } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', userId)
        .single();

    if (existing) {
        // Update existing profile
        const { data, error } = await supabase
            .from('profiles')
            .update(updates)
            .eq('user_id', userId)
            .select()
            .single();

        if (error) throw error;
        return data;
    } else {
        // Create new profile with updates
        const { data, error } = await supabase
            .from('profiles')
            .insert({
                user_id: userId,
                email: email || '',
                name: updates.name || '',
                avatar_url: updates.avatar_url || null,
            })
            .select()
            .single();

        if (error) throw error;
        return data;
    }
}

// =============================================
// USER PROGRAMS FUNCTIONS
// =============================================

export interface UserProgram {
    id: string;
    user_id: string;
    program_id: string;
    program_name: string;
    price: number;
    joined_at: string;
    is_active: boolean;
}

export async function getUserPrograms(userId: string): Promise<UserProgram[]> {
    const { data, error } = await supabase
        .from('user_programs')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true)
        .order('joined_at', { ascending: false });

    if (error) {
        console.error('Error fetching programs:', error);
        return [];
    }
    return data || [];
}

export async function joinProgram(userId: string, programId: string, programName: string, price: number) {
    // Check if already joined
    const { data: existing } = await supabase
        .from('user_programs')
        .select('id, is_active')
        .eq('user_id', userId)
        .eq('program_id', programId)
        .single();

    if (existing) {
        // Reactivate if was deactivated
        if (!existing.is_active) {
            const { error } = await supabase
                .from('user_programs')
                .update({ is_active: true })
                .eq('id', existing.id);
            if (error) throw error;
        }
        return existing;
    }

    // Create new join
    const { data, error } = await supabase
        .from('user_programs')
        .insert({
            user_id: userId,
            program_id: programId,
            program_name: programName,
            price,
        })
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function deactivateProgram(userId: string, programId: string) {
    const { error } = await supabase
        .from('user_programs')
        .update({ is_active: false })
        .eq('user_id', userId)
        .eq('program_id', programId);

    if (error) throw error;
}

export async function isUserJoined(userId: string, programId: string): Promise<boolean> {
    const { data } = await supabase
        .from('user_programs')
        .select('id')
        .eq('user_id', userId)
        .eq('program_id', programId)
        .eq('is_active', true)
        .single();

    return !!data;
}

// =============================================
// TODOS FUNCTIONS
// =============================================

export interface Todo {
    id: string;
    user_id: string;
    text: string;
    completed: boolean;
    created_at: string;
}

export async function getTodos(userId: string): Promise<Todo[]> {
    const { data, error } = await supabase
        .from('todos')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: true });

    if (error) {
        console.error('Error fetching todos:', error);
        return [];
    }
    return data || [];
}

export async function addTodo(userId: string, text: string) {
    const { data, error } = await supabase
        .from('todos')
        .insert({ user_id: userId, text })
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function toggleTodo(todoId: string, completed: boolean) {
    const { error } = await supabase
        .from('todos')
        .update({ completed })
        .eq('id', todoId);

    if (error) throw error;
}

export async function deleteTodo(todoId: string) {
    const { error } = await supabase
        .from('todos')
        .delete()
        .eq('id', todoId);

    if (error) throw error;
}

// =============================================
// GROUP MEMBERS FUNCTIONS
// =============================================

export interface GrpMember {
    id: string;
    user_id: string;
    name: string;
    avatar_url: string | null;
    joined_at: string;
}

export async function getGrpMembers(): Promise<GrpMember[]> {
    const { data, error } = await supabase
        .from('grp_members')
        .select('*')
        .order('joined_at', { ascending: true });

    if (error) {
        console.error('Error fetching members:', error);
        return [];
    }
    return data || [];
}

export async function joinGrp(userId: string, name: string, avatarUrl?: string) {
    // Check if already a member
    const { data: existing } = await supabase
        .from('grp_members')
        .select('id')
        .eq('user_id', userId)
        .single();

    if (existing) return existing;

    const { data, error } = await supabase
        .from('grp_members')
        .insert({
            user_id: userId,
            name,
            avatar_url: avatarUrl,
        })
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function isGrpMember(userId: string): Promise<boolean> {
    const { data } = await supabase
        .from('grp_members')
        .select('id')
        .eq('user_id', userId)
        .single();

    return !!data;
}
