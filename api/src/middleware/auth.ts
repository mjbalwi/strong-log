import type { Request, Response, NextFunction } from "express";

export interface AuthedRequest extends Request {
  userId?: string;
}

// Verifies the Supabase-issued JWT sent as "Authorization: Bearer <token>"
// by asking Supabase's auth API who it belongs to, then attaches userId.
export async function requireAuth(req: AuthedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : undefined;
  if (!token) {
    return res.status(401).json({ error: "Missing bearer token" });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  if (!supabaseUrl) {
    return res.status(500).json({ error: "Server misconfigured: SUPABASE_URL not set" });
  }

  const resp = await fetch(`${supabaseUrl}/auth/v1/user`, {
    headers: {
      Authorization: `Bearer ${token}`,
      apikey: process.env.SUPABASE_ANON_KEY ?? "",
    },
  });

  if (!resp.ok) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }

  const user = (await resp.json()) as { id: string; email?: string };
  req.userId = user.id;
  next();
}
