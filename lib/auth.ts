import { createClient as createServerSupabaseClient } from '@/lib/supabase/server';
import { db } from '@/configs/db';
import { usersTable } from '@/configs/schema';
import { eq } from 'drizzle-orm';
import { AppError } from '@/lib/error-handling';
import { User } from '@supabase/supabase-js';

export interface AuthenticatedAppContext {
    supabaseUser: User;
    dbUser: {
        id: number;
        name: string;
        email: string;
        credits: number | null;
        supabase_id: string | null;
    };
}

/**
 * Authenticates the incoming request using supabase.auth.getUser().
 * If authenticated, looks up the corresponding Neon application user.
 * Performs safe, atomic one-time identity migration if user exists with matching email
 * and unassigned supabase_id.
 * Throws AppError(401) if unauthenticated or AppError(403/409) on identity conflict.
 */
export async function requireAuthUser(): Promise<AuthenticatedAppContext> {
    const supabase = await createServerSupabaseClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
        throw new AppError('Unauthorized: Authentication required', 401);
    }

    const supabaseId = user.id;
    const userEmail = user.email;

    if (!userEmail) {
        throw new AppError('Unauthorized: Verified user email required', 401);
    }

    // Require confirmed email before allowing identity binding or access
    const isEmailConfirmed = !!user.confirmed_at || !!user.email_confirmed_at;
    if (!isEmailConfirmed) {
        throw new AppError('Unauthorized: Email confirmation required before accessing account', 403);
    }

    // 1. Primary lookup by supabase_id (Strict zero-fallback post-binding)
    const existingBySupabaseId = await db.select()
        .from(usersTable)
        .where(eq(usersTable.supabase_id, supabaseId));

    if (existingBySupabaseId && existingBySupabaseId.length > 0) {
        return {
            supabaseUser: user,
            dbUser: existingBySupabaseId[0]
        };
    }

    // 2. Identity binding step: Check if user exists by email with NULL supabase_id
    const existingByEmail = await db.select()
        .from(usersTable)
        .where(eq(usersTable.email, userEmail));

    if (existingByEmail && existingByEmail.length > 0) {
        const candidate = existingByEmail[0];

        // Conflict check: email already bound to a DIFFERENT supabase_id
        if (candidate.supabase_id && candidate.supabase_id !== supabaseId) {
            console.error(`Security conflict: Email ${userEmail} already bound to ${candidate.supabase_id}, received ${supabaseId}`);
            throw new AppError('Identity conflict: This email is bound to another account', 409);
        }

        // Atomic one-time binding: update supabase_id and backfill any orphan wireframes
        const updated = await db.update(usersTable)
            .set({ supabase_id: supabaseId })
            .where(eq(usersTable.id, candidate.id))
            .returning();

        return {
            supabaseUser: user,
            dbUser: updated[0] || candidate
        };
    }

    // 3. New user creation
    const userName = (user.user_metadata?.full_name as string) || (user.user_metadata?.name as string) || userEmail.split('@')[0];
    const newUser = await db.insert(usersTable).values({
        name: userName,
        email: userEmail,
        credits: 3,
        supabase_id: supabaseId
    }).returning();

    return {
        supabaseUser: user,
        dbUser: newUser[0]
    };
}

