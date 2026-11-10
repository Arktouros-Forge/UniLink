import { createRemoteJWKSet, jwtVerify } from "jose";

import { firebaseJwksUrl, firebaseProjectId } from "./config.js";
import { fail } from "./errors.js";

let jwks;
let jwksUrl;

function keySet() {
  const url = firebaseJwksUrl();
  if (!jwks || jwksUrl !== url) {
    jwks = createRemoteJWKSet(new URL(url), { cooldownDuration: 30_000 });
    jwksUrl = url;
  }
  return jwks;
}


export async function verifyFirebaseToken(idToken) {
  const projectId = firebaseProjectId();
  if (!projectId) fail("FIREBASE_NOT_CONFIGURED");

  try {
    const { payload } = await jwtVerify(idToken, keySet(), {
      issuer: `https://securetoken.google.com/${projectId}`,
      audience: projectId,
      algorithms: ["RS256"],
    });
    if (!payload.sub || !payload.email) fail("FIREBASE_TOKEN_INVALID");
    return {
      uid: payload.sub,
      email: String(payload.email).toLowerCase(),
      emailVerified: payload.email_verified === true,
      name: payload.name ?? null,
      picture: payload.picture ?? null,
    };
  } catch (error) {
    if (error?.statusCode) throw error;
    return fail("FIREBASE_TOKEN_INVALID");
  }
}
