import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import type { PermissionKey } from "@/lib/constants";

const COOKIE_NAME = "asm_session";

export type SessionUser = {
  id: string;
  username: string;
  fullName: string;
  roleId: string;
  roleName: string;
  permissions: PermissionKey[];
};

function getSecret() {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error("AUTH_SECRET is not set");
  }
  return new TextEncoder().encode(secret);
}

export async function createSessionToken(user: SessionUser): Promise<string> {
  return new SignJWT({ user })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecret());
}

export async function verifySessionToken(
  token: string,
): Promise<SessionUser | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload.user as SessionUser;
  } catch {
    return null;
  }
}

export async function setSessionCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

export async function requireSession(): Promise<SessionUser> {
  const session = await getSession();
  if (!session) {
    throw new Error("UNAUTHORIZED");
  }
  return session;
}

export function hasPermission(
  user: SessionUser,
  permission: PermissionKey,
): boolean {
  return user.permissions.includes(permission);
}

export async function requirePermission(permission: PermissionKey) {
  const session = await requireSession();
  if (!hasPermission(session, permission)) {
    throw new Error("FORBIDDEN");
  }
  return session;
}

export async function loadUserSession(
  userId: string,
): Promise<SessionUser | null> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      role: {
        include: {
          permissions: { include: { permission: true } },
        },
      },
    },
  });

  if (!user || !user.isActive) return null;

  return {
    id: user.id,
    username: user.username,
    fullName: user.fullName,
    roleId: user.roleId,
    roleName: user.role.name,
    permissions: user.role.permissions.map(
      (rp) => rp.permission.key as PermissionKey,
    ),
  };
}
