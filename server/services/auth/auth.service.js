import { and, eq, gt, isNull, sql } from "drizzle-orm";

import { db } from "@database/index";
import { authTokens, users } from "@database/schema/index";

import { composeMail } from "../../emails/templates.js";
import { allowedEmailDomains } from "../../utils/config.js";
import { fail } from "../../utils/errors.js";
import { forgetSession } from "../../utils/auth.js";
import { sendMailSafely } from "../../utils/mailer.js";
import { verifyFirebaseToken } from "../../utils/firebase.js";
import { hashPassword, verifyPassword } from "../../utils/password.js";
import { rateLimit, resetRateLimit } from "../../utils/rate-limit.js";
import { hashToken, newToken } from "../../utils/tokens.js";
import { randomBytes } from "node:crypto";

const TOKEN_TTL = {
  verify_email: 24 * 60 * 60_000,
  reset_password: 30 * 60_000,
};

const DUMMY_HASH = "scrypt$AAAAAAAAAAAAAAAAAAAAAA==$" + "A".repeat(86) + "==";

const sessionUser = {
  id: users.id,
  role: users.role,
  sessionVersion: users.sessionVersion,
};

const normalizeEmail = (email) => email.trim().toLowerCase();

function assertAllowedDomain(email) {
  const domains = allowedEmailDomains();
  if (
    domains.length &&
    !domains.some(
      (domain) => email.endsWith(`@${domain}`) || email.endsWith(`.${domain}`),
    )
  )
    fail("EMAIL_DOMAIN_NOT_ALLOWED");
}

async function usernameFor(email, fullName) {
  const base =
    (email.split("@")[0] || fullName)
      .toLowerCase()
      .replace(/[^a-z0-9._]/g, "")
      .slice(0, 24) || "mahasiswa";
  const [{ taken }] = await db.execute(
    sql`select count(*)::int as taken from users where username = ${base} or username like ${`${base}%`}`,
  );
  return taken ? `${base}${taken + 1}` : base;
}

async function createToken(userId, type) {
  await db
    .delete(authTokens)
    .where(
      and(
        eq(authTokens.userId, userId),
        eq(authTokens.type, type),
        isNull(authTokens.usedAt),
      ),
    );

  const token = newToken();
  await db.insert(authTokens).values({
    userId,
    type,
    tokenHash: hashToken(token),
    expiresAt: new Date(Date.now() + TOKEN_TTL[type]),
  });
  return token;
}

async function consumeToken(token, type) {
  const [row] = await db
    .update(authTokens)
    .set({ usedAt: new Date() })
    .where(
      and(
        eq(authTokens.tokenHash, hashToken(token)),
        eq(authTokens.type, type),
        isNull(authTokens.usedAt),
        gt(authTokens.expiresAt, new Date()),
      ),
    )
    .returning({ userId: authTokens.userId });

  if (!row) fail("TOKEN_INVALID");
  return row.userId;
}

export async function sendVerification(userId) {
  const [user] = await db
    .select({
      email: users.email,
      fullName: users.fullName,
      verified: users.emailVerifiedAt,
    })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);
  if (!user) fail("USER_NOT_FOUND");
  if (user.verified) fail("ALREADY_VERIFIED");

  rateLimit("verification", userId, { max: 5, windowMs: 60 * 60_000 });
  const token = await createToken(userId, "verify_email");
  sendMailSafely(
    composeMail("verifyEmail", user.email, { name: user.fullName, token }),
  );
  return { sent: true };
}

export async function register({ name, email, password }) {
  const address = normalizeEmail(email);
  assertAllowedDomain(address);

  const [existing] = await db
    .select({ id: users.id })
    .from(users)
    .where(sql`lower(${users.email}) = ${address}`)
    .limit(1);
  if (existing) fail("EMAIL_ALREADY_IN_USE");

  const [user] = await db
    .insert(users)
    .values({
      email: address,
      fullName: name.trim(),
      password: await hashPassword(password),
      username: await usernameFor(address, name),
    })
    .returning(sessionUser);

  await sendVerification(user.id);
  return user;
}

export async function login({ email, password }, ip) {
  const address = normalizeEmail(email);
  const key = `${address}|${ip}`;
  rateLimit("login", key, { max: 8, windowMs: 15 * 60_000 });

  const [user] = await db
    .select({
      ...sessionUser,
      password: users.password,
      status: users.status,
      blockedReason: users.blockedReason,
    })
    .from(users)
    .where(sql`lower(${users.email}) = ${address}`)
    .limit(1);

  const valid = await verifyPassword(password, user?.password ?? DUMMY_HASH);
  if (!user || !valid) fail("INVALID_CREDENTIALS");
  if (user.status === "blocked")
    fail(
      "BLOCKED",
      user.blockedReason
        ? [{ field: "reason", message: user.blockedReason }]
        : null,
    );

  resetRateLimit("login", key);
  await db
    .update(users)
    .set({ lastLoginAt: new Date() })
    .where(eq(users.id, user.id));
  return { id: user.id, role: user.role, sessionVersion: user.sessionVersion };
}

export async function verifyEmail(token) {
  const userId = await consumeToken(token, "verify_email");
  await db
    .update(users)
    .set({ emailVerifiedAt: new Date() })
    .where(eq(users.id, userId));
  forgetSession(userId);
  return { verified: true };
}

export async function forgotPassword(email, ip) {
  const address = normalizeEmail(email);
  rateLimit("forgot", `${address}|${ip}`, { max: 3, windowMs: 60 * 60_000 });

  const [user] = await db
    .select({ id: users.id, fullName: users.fullName, status: users.status })
    .from(users)
    .where(sql`lower(${users.email}) = ${address}`)
    .limit(1);

  if (user && user.status === "active") {
    const token = await createToken(user.id, "reset_password");
    sendMailSafely(
      composeMail("resetPassword", address, { name: user.fullName, token }),
    );
  }

  return { sent: true };
}

export async function resetPassword(token, password) {
  const userId = await consumeToken(token, "reset_password");

  const [user] = await db
    .update(users)
    .set({
      password: await hashPassword(password),
      sessionVersion: sql`${users.sessionVersion} + 1`,
      emailVerifiedAt: sql`coalesce(${users.emailVerifiedAt}, now())`,
    })
    .where(eq(users.id, userId))
    .returning({ email: users.email, fullName: users.fullName });

  forgetSession(userId);
  sendMailSafely(
    composeMail("passwordChanged", user.email, { name: user.fullName }),
  );
  return { reset: true };
}

export async function firebaseLogin({ idToken, name }, ip) {
  rateLimit("firebase", ip, { max: 30, windowMs: 15 * 60_000 });
  const identity = await verifyFirebaseToken(idToken);
  assertAllowedDomain(identity.email);

  const columns = {
    ...sessionUser,
    status: users.status,
    blockedReason: users.blockedReason,
    firebaseUid: users.firebaseUid,
    verified: users.emailVerifiedAt,
  };
  const [byUid] = await db
    .select(columns)
    .from(users)
    .where(eq(users.firebaseUid, identity.uid))
    .limit(1);
  const [byEmail] = byUid
    ? [byUid]
    : await db
        .select(columns)
        .from(users)
        .where(sql`lower(${users.email}) = ${identity.email}`)
        .limit(1);
  let user = byUid ?? byEmail;

  if (user?.status === "blocked")
    fail(
      "BLOCKED",
      user.blockedReason
        ? [{ field: "reason", message: user.blockedReason }]
        : null,
    );

  if (!user) {
    const fullName = (name ?? identity.name ?? identity.email.split("@")[0])
      .slice(0, 100)
      .padEnd(2, " ");
    [user] = await db
      .insert(users)
      .values({
        email: identity.email,
        fullName: fullName.trim() || identity.email,
        password: await hashPassword(randomBytes(24).toString("base64url")),
        username: await usernameFor(identity.email, fullName),
        firebaseUid: identity.uid,
        emailVerifiedAt: identity.emailVerified ? new Date() : null,
        lastLoginAt: new Date(),
      })
      .returning({
        ...sessionUser,
        status: users.status,
        blockedReason: users.blockedReason,
        firebaseUid: users.firebaseUid,
        verified: users.emailVerifiedAt,
      });
  } else {
    const patch = { lastLoginAt: new Date() };
    if (!user.firebaseUid) patch.firebaseUid = identity.uid;
    if (!user.verified && identity.emailVerified)
      patch.emailVerifiedAt = new Date();
    await db.update(users).set(patch).where(eq(users.id, user.id));
    if (patch.emailVerifiedAt) forgetSession(user.id);
  }

  return { id: user.id, role: user.role, sessionVersion: user.sessionVersion };
}
