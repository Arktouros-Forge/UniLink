import {
  defineEventHandler,
  getQuery,
  getRouterParams,
  readBody,
  setResponseHeader,
  setResponseStatus,
} from "h3";
import { ZodError } from "zod";

import { ApiError, fail, fromDatabaseError } from "./errors.js";
import { errorResponse, successResponse } from "./api-response.js";
import { resolveSession } from "./auth.js";

const RESULT = Symbol("api-result");

export const ok = (data, message, status) => ({
  [RESULT]: true,
  data,
  message,
  status,
});

const issues = (error) =>
  error.issues.map((issue) => ({
    field: issue.path.join(".") || "(root)",
    message: issue.message,
  }));

function parse(schema, value, label) {
  if (!schema) return undefined;
  const result = schema.safeParse(value);
  if (!result.success)
    fail("VALIDATION", issues(result.error), `Invalid ${label}`);
  return result.data;
}

const ROLES = {
  student: ["student"],
  admin: ["admin"],
  any: ["student", "admin"],
};

export function defineApi(options, handler) {
  const {
    auth = "student",
    params,
    query,
    body,
    message = "Success",
    status = 200,
    cache,
    raw = false,
  } = options;

  return defineEventHandler(async (event) => {
    try {
      let user = null;

      if (auth) {
        user = await resolveSession(event);
        if (!user) fail("UNAUTHENTICATED");
        if (user.status === "blocked")
          fail(
            "BLOCKED",
            user.blockedReason
              ? [{ field: "reason", message: user.blockedReason }]
              : null,
          );
        if (!ROLES[auth].includes(user.role)) fail("FORBIDDEN");
        if (auth !== "any" && !user.emailVerifiedAt) fail("EMAIL_NOT_VERIFIED");
      }

      const ctx = {
        event,
        user,
        params: parse(params, getRouterParams(event), "path parameters") ?? {},
        query: parse(query, getQuery(event), "query parameters") ?? {},
        body: body
          ? parse(
              body,
              await readBody(event).catch(() => undefined),
              "request body",
            )
          : undefined,
      };

      const result = await handler(ctx);

      if (raw) {
        setResponseHeader(event, "Content-Type", result.contentType);
        setResponseHeader(
          event,
          "Content-Disposition",
          `attachment; filename="${result.filename}"`,
        );
        return result.body;
      }

      if (cache)
        setResponseHeader(event, "Cache-Control", `private, max-age=${cache}`);

      const wrapped = result && result[RESULT] ? result : ok(result);
      const code = wrapped.status ?? status;
      setResponseStatus(event, code);
      return successResponse(
        wrapped.data ?? null,
        wrapped.message ?? message,
        code,
      );
    } catch (error) {
      const known =
        error instanceof ApiError
          ? error
          : error instanceof ZodError
            ? new ApiError("VALIDATION", issues(error))
            : fromDatabaseError(error);

      if (!known) {
        console.error("[api] unhandled error:", error);
        setResponseStatus(event, 500);
        return errorResponse("Internal server error", null, 500);
      }

      setResponseStatus(event, known.status);
      return errorResponse(known.message, known.errors, known.status);
    }
  });
}
