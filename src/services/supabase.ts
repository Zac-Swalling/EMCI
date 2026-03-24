import { createClient } from '@supabase/supabase-js';
import type { User, Session } from '@supabase/supabase-js';

const supabaseUrl     = import.meta.env.VITE_SUPABASE_URL     as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ── Auth helpers ───────────────────────────────────────────────────────────

export async function signInWithMicrosoft(): Promise<void> {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'azure',
    options: {
      scopes: 'openid profile email',
      // Redirect back to app root after Microsoft auth completes
      redirectTo: window.location.origin,
    },
  });
  if (error) throw error;
}

export async function signOut(): Promise<void> {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getSession(): Promise<Session | null> {
  const { data } = await supabase.auth.getSession();
  return data.session;
}

// ── User display helpers ───────────────────────────────────────────────────

export interface AppUser {
  id: string;
  email: string;
  displayName: string;
  firstName: string;
  avatarUrl: string | null;
}

export function mapUser(user: User): AppUser {
  const meta = user.user_metadata ?? {};
  const full  = (meta.full_name ?? meta.name ?? user.email ?? 'User') as string;
  const first = full.split(' ')[0] ?? full;
  return {
    id:          user.id,
    email:       user.email ?? '',
    displayName: full,
    firstName:   first,
    avatarUrl:   (meta.avatar_url ?? meta.picture ?? null) as string | null,
  };
}
