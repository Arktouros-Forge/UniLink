import { jwtVerify, SignJWT } from "jose";
import { deleteCookie, getCookie, setCookie } from "h3";

import { authSecret, isSecureCookie } from "./config.js";

export const SESSION_COOKIE = "unilink_session";

const SHORT = 60 * 60 * 24;
const LONG = 60 * 60 * 24 * 30;

export async function issueSession(event, user, { remember = false } = {}) {
  const maxAge = remember ? LONG : SHORT * 7;

  const token = await new SignJWT({ role: user.role, v: user.sessionVersion })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime(`${maxAge}s`)
    .sign(authSecret());

  setCookie(event, SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: isSecureCookie(),
    path: "/",
    maxAge,
  });
}

export const clearSession = (event) => deleteCookie(event, SESSION_COOKIE, { path: "/" });

export async function readSession(event) {
  const token = getCookie(event, SESSION_COOKIE);
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, authSecret(), { algorithms: ["HS256"] });
    return { id: payload.sub, version: payload.v };
  } catch {
    return null;
  }
}
