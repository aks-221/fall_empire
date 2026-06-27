import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Session, User } from "@supabase/supabase-js";

type AuthState = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAdmin: boolean;
  isEditor: boolean;
  refreshRoles: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  claimFirstAdmin: () => Promise<boolean>;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [roles, setRoles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadRoles(uid: string | undefined) {
    if (!uid) { setRoles([]); return; }
    const { data } = await supabase.from("user_roles").select("role").eq("user_id", uid);
    setRoles((data ?? []).map((r) => r.role as string));
  }

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_evt, s) => {
      setSession(s);
      setUser(s?.user ?? null);
      setTimeout(() => { loadRoles(s?.user?.id); }, 0);
    });
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setUser(data.session?.user ?? null);
      loadRoles(data.session?.user?.id).finally(() => setLoading(false));
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const value: AuthState = {
    user, session, loading,
    isAdmin: roles.includes("admin"),
    isEditor: roles.includes("admin") || roles.includes("editor"),
    refreshRoles: () => loadRoles(user?.id),
    signIn: async (email, password) => {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      return { error: error?.message ?? null };
    },
    signUp: async (email, password) => {
      const redirectTo = typeof window !== "undefined" ? `${window.location.origin}/admin` : undefined;
      const { error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: redirectTo } });
      return { error: error?.message ?? null };
    },
    signOut: async () => { await supabase.auth.signOut(); setRoles([]); },
    claimFirstAdmin: async () => {
      const { data, error } = await supabase.rpc("claim_first_admin");
      if (error) return false;
      await loadRoles(user?.id);
      return data === true;
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
