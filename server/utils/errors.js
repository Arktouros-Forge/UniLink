export const ERRORS = {
  UNAUTHENTICATED: [401, "You are not logged in"],
  FORBIDDEN: [403, "Access denied"],
  BLOCKED: [403, "Your account has been blocked"],
  NOT_FOUND: [404, "Resource not found"],
  VALIDATION: [422, "Validation failed"],
  CONFLICT: [409, "Resource already exists"],
  USER_NOT_FOUND: [404, "User not found"],
  SKILL_NOT_FOUND: [400, "One or more skills were not found"],
  CATEGORY_NOT_FOUND: [400, "One or more categories were not found"],
  COMPETITION_NOT_FOUND: [404, "Competition not found"],
  DUPLICATE_COMPETITION: [
    409,
    "A competition with this title and host already exists",
  ],
  COMPETITION_CLOSED: [409, "This competition is closed"],
  COMPETITION_DEADLINE_PASSED: [409, "The competition deadline has passed"],
  COMPETITION_NOT_FINISHED: [409, "The competition has not finished yet"],
  TEAM_NOT_FOUND: [404, "Team not found"],
  TEAM_FULL: [409, "This team is full"],
  TEAM_ALREADY_CREATED: [
    409,
    "You already created a team for this competition",
  ],
  ALREADY_IN_TEAM: [409, "You are already in a team for this competition"],
  ALREADY_TEAM_MEMBER: [409, "You are already a member of this team"],
  JOIN_REQUEST_ALREADY_EXISTS: [
    409,
    "You already have a pending join request for this team",
  ],
  NOT_TEAM_MEMBER: [404, "You are not a member of this team"],
  NOT_ACCEPTED_MEMBER: [403, "Only accepted team members can do this"],
  MEMBER_NOT_FOUND: [404, "Team member not found"],
  CREATOR_CANNOT_LEAVE: [
    409,
    "The team creator cannot leave; delete the team instead",
  ],
  CANNOT_CHANGE_CREATOR: [409, "The team creator cannot be changed"],
  TEAM_SIZE_EXCEEDS_COMPETITION_LIMIT: [
    422,
    "Team size exceeds the competition limit",
  ],
  TEAM_SIZE_BELOW_CURRENT_MEMBERS: [
    409,
    "Team size is below the current member count",
  ],
  TASK_NOT_FOUND: [404, "Task not found"],
  SIGN_NOT_FOUND: [404, "Help sign not found"],
  SIGN_NOT_OPEN: [409, "This help sign is no longer open"],
  REQUEST_NOT_FOUND: [404, "Study request not found"],
  REQUEST_NOT_PENDING: [409, "This request has already been answered"],
  REQUEST_EXPIRED: [409, "This request has expired"],
  SELF_REQUEST: [422, "You cannot send a request to yourself"],
  HELPER_BLOCKED: [409, "This student is not available"],
  DUPLICATE_REQUEST: [
    409,
    "You already have a pending request for this subject with this student",
  ],
  INVALID_CURRENT_PASSWORD: [400, "Current password is incorrect"],
  EMAIL_ALREADY_IN_USE: [409, "Email is already in use"],
  NIM_ALREADY_IN_USE: [409, "NIM is already registered to another account"],
  NIM_LOCKED: [409, "NIM can only be set once. Contact an admin to change it"],
  CANNOT_MODIFY_SELF: [409, "You cannot do this to your own account"],
  CANNOT_MODIFY_ADMIN: [409, "Admin accounts cannot be modified here"],
  IN_USE: [409, "This item is still in use and cannot be deleted"],
  FIREBASE_NOT_CONFIGURED: [503, "Firebase sign-in is not configured"],
  FIREBASE_TOKEN_INVALID: [401, "Firebase sign-in could not be verified"],
  INVALID_CREDENTIALS: [401, "Email or password is incorrect"],
  EMAIL_NOT_VERIFIED: [403, "Please verify your email first"],
  ALREADY_VERIFIED: [409, "Your email is already verified"],
  TOKEN_INVALID: [400, "This link is invalid or has expired"],
  RATE_LIMITED: [429, "Too many attempts. Please try again later"],
  EMAIL_DOMAIN_NOT_ALLOWED: [422, "Please use your valid email address"],
};

export class ApiError extends Error {
  constructor(code, errors = null, message) {
    const [status, defaultMessage] = ERRORS[code] ?? [
      500,
      "Internal server error",
    ];
    super(message ?? defaultMessage);
    this.code = code;
    this.status = status;
    this.errors = errors;
  }
}

export const fail = (code, errors = null, message) => {
  throw new ApiError(code, errors, message);
};

export const assert = (condition, code, errors) => {
  if (!condition) fail(code, errors);
};

const PG_CONSTRAINTS = {
  users_email_lower_unique: ["EMAIL_ALREADY_IN_USE"],
  users_nim_unique: ["NIM_ALREADY_IN_USE"],
  competitions_title_host_unique: ["DUPLICATE_COMPETITION"],
  teams_competition_creator_unique: ["TEAM_ALREADY_CREATED"],
  team_members_team_user_unique: ["ALREADY_TEAM_MEMBER"],
  team_members_one_accepted_per_competition: ["ALREADY_IN_TEAM"],
  study_requests_one_pending_per_pair: ["DUPLICATE_REQUEST"],
};

export function fromDatabaseError(error) {
  const code = error?.code ?? error?.cause?.code;
  const constraint = error?.constraint_name ?? error?.cause?.constraint_name;
  if (!code) return null;

  const mapped = PG_CONSTRAINTS[constraint];
  if (mapped) return new ApiError(...mapped);
  if (code === "23505")
    return new ApiError(
      "CONFLICT",
      constraint ? [{ field: constraint, message: "Duplicate value" }] : null,
    );
  if (code === "23503") return new ApiError("IN_USE");
  if (code === "23514")
    return new ApiError("VALIDATION", null, "A value violates a database rule");
  if (code === "22P02")
    return new ApiError("VALIDATION", null, "Malformed identifier or value");
  return null;
}
