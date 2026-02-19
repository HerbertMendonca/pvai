import { supabase } from "@/_core/supabase";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation } from "wouter";

type UseAuthOptions = {
  redirectOnUnauthenticated?: boolean;
  redirectPath?: string;
};

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  role?: string;
  id_empresa?: number;
}

export function useAuth(options?: UseAuthOptions) {
  const { redirectOnUnauthenticated = false, redirectPath = "/login" } = options ?? {};
  const [, setLocation] = useLocation();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          // Get user profile from database
          const { data: userProfile } = await supabase
            .from('users')
            .select('*')
            .eq('email', session.user.email)
            .single();

          setUser({
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata?.name || session.user.email?.split('@')[0],
            role: userProfile?.role || 'operador',
            id_empresa: userProfile?.id_empresa,
          });
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error('Error checking auth:', err);
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const { data: userProfile } = await supabase
            .from('users')
            .select('*')
            .eq('email', session.user.email)
            .single();

          setUser({
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata?.name || session.user.email?.split('@')[0],
            role: userProfile?.role || 'operador',
            id_empresa: userProfile?.id_empresa,
          });
        } else {
          setUser(null);
        }
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // Handle redirect on unauthenticated
  useEffect(() => {
    if (!redirectOnUnauthenticated) return;
    if (loading) return;
    if (user) return;
    if (typeof window === "undefined") return;
    if (window.location.pathname === redirectPath) return;

    setLocation(redirectPath);
  }, [redirectOnUnauthenticated, redirectPath, loading, user, setLocation]);

  const logout = useCallback(async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setLocation('/login');
    } catch (err) {
      console.error('Error logging out:', err);
      setError(err instanceof Error ? err : new Error('Failed to logout'));
    }
  }, [setLocation]);

  return {
    user,
    loading,
    error,
    isAuthenticated: Boolean(user),
    logout,
    refresh: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: userProfile } = await supabase
          .from('users')
          .select('*')
          .eq('email', session.user.email)
          .single();

        setUser({
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata?.name || session.user.email?.split('@')[0],
          role: userProfile?.role || 'operador',
          id_empresa: userProfile?.id_empresa,
        });
      }
    },
  };
}
