import { getCookie, setCookie } from "@tanstack/react-start/server";
import { generateToken, verifyToken } from "./jwt";
import type { Users } from "@/generated/prisma/client";

const SESSION_COOKIE_NAME = "tallymatic_session";

export async function setSessionTokenCookie(
  token: string,
  cookieName: string = SESSION_COOKIE_NAME,
  //   expiresAt: Date
): Promise<void> {
  setCookie(cookieName, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    // expires: expiresAt,
    path: "/",
  });
}

export async function deleteSessionTokenCookie({
  cookieName = SESSION_COOKIE_NAME,
}: {
  cookieName: string;
}): Promise<void> {
  setCookie(cookieName, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
    path: "/",
  });
}

// export const createSession = (user: User) => {
//   const token = generateToken({
//     id: user.id,

//   });

//   return {
//     token,
//     user: {
//       id: user.id,
//       email: user.email,
//       role: user.role,
//       fullName: user.fullName
//     }
//   };
// };

export const validateSession = (token: string) => {
  const decoded = verifyToken(token);
  if (!decoded) return null;
  return decoded;
};

export async function getSessionToken(
  cookieName: string,
): Promise<string | undefined> {
  const sessionCookie = getCookie(cookieName);
  return sessionCookie;
}

export async function setSession(user: Users) {
  //   const token = generateSessionToken();
  //   const session =  createSession(user);

  const token = generateToken({
    id: user.id,
  });
  await setSessionTokenCookie(token);
}
