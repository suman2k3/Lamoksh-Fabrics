import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import { dbStore } from "@/lib/db/store";

export interface AdminSession {
  id: string;
  email: string;
  fullName: string;
  role: "super_admin" | "admin" | "editor";
  token: string;
  expiresAt: number;
}

const ADMIN_SESSION_KEY = "manmayi_admin_session";

// Default provisioned super administrator credentials for initial setup
export const INITIAL_ADMIN = {
  email: "admin@manmayi.in",
  password: "Admin@Manmayi2026!",
  fullName: "Senior Atelier Admin",
  role: "super_admin" as const,
};

export async function loginAdmin(
  emailInput: string,
  passwordInput: string,
  rememberMe = false
): Promise<{ success: boolean; session?: AdminSession; error?: string }> {
  const email = emailInput.trim().toLowerCase();
  const password = passwordInput.trim();

  if (!email || !password) {
    return { success: false, error: "Please provide both email address and password." };
  }

  // 1. Attempt Supabase Auth if connected
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (!error && data.user) {
        const session: AdminSession = {
          id: data.user.id,
          email: data.user.email || email,
          fullName: data.user.user_metadata?.full_name || "Administrator",
          role: "super_admin",
          token: data.session?.access_token || `token-${Date.now()}`,
          expiresAt: Date.now() + (rememberMe ? 30 * 24 * 60 * 60 * 1000 : 8 * 60 * 60 * 1000),
        };
        saveAdminSession(session, rememberMe);
        dbStore.addAuditLog("ADMIN_LOGIN", "auth", data.user.id, { email, method: "supabase" });
        return { success: true, session };
      }
    } catch (err) {
      console.warn("Supabase auth error fallback to local verification:", err);
    }
  }

  // 2. Verified Local Administration Credentials Fallback
  if (email === INITIAL_ADMIN.email && password === INITIAL_ADMIN.password) {
    const session: AdminSession = {
      id: "admin-super-1",
      email: INITIAL_ADMIN.email,
      fullName: INITIAL_ADMIN.fullName,
      role: INITIAL_ADMIN.role,
      token: `mn_admin_token_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      expiresAt: Date.now() + (rememberMe ? 30 * 24 * 60 * 60 * 1000 : 8 * 60 * 60 * 1000),
    };
    saveAdminSession(session, rememberMe);
    dbStore.addAuditLog("ADMIN_LOGIN", "auth", session.id, { email, method: "secure_local" });
    return { success: true, session };
  }

  dbStore.addAuditLog("FAILED_LOGIN_ATTEMPT", "auth", "none", { email });
  return { success: false, error: "Invalid administrator credentials or unauthorized account." };
}

export function saveAdminSession(session: AdminSession, remember = false): void {
  if (typeof window === "undefined") return;
  try {
    const data = JSON.stringify(session);
    if (remember) {
      localStorage.setItem(ADMIN_SESSION_KEY, data);
      sessionStorage.removeItem(ADMIN_SESSION_KEY);
    } else {
      sessionStorage.setItem(ADMIN_SESSION_KEY, data);
      localStorage.removeItem(ADMIN_SESSION_KEY);
    }
  } catch (e) {
    console.error("Error storing session:", e);
  }
}

export function getAdminSession(): AdminSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(ADMIN_SESSION_KEY) || localStorage.getItem(ADMIN_SESSION_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw) as AdminSession;
    if (Date.now() > session.expiresAt) {
      logoutAdmin();
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

export function logoutAdmin(): void {
  if (typeof window === "undefined") return;
  const current = getAdminSession();
  if (current) {
    dbStore.addAuditLog("ADMIN_LOGOUT", "auth", current.id, { email: current.email });
  }
  localStorage.removeItem(ADMIN_SESSION_KEY);
  sessionStorage.removeItem(ADMIN_SESSION_KEY);
  if (isSupabaseConfigured) {
    supabase.auth.signOut().catch(() => {});
  }
}

export function isAuthenticatedAdmin(): boolean {
  const session = getAdminSession();
  return Boolean(session && session.role && Date.now() < session.expiresAt);
}
