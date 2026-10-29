export function successResponse(data = null, message = "Success") {
  return {
    success: true,
    message,
    data,
    timestamp: new Date().toISOString(),
  };
}

export function errorResponse(message = "Something went wrong", errors = null) {
  return {
    success: false,
    message,
    data: null,
    errors,
    timestamp: new Date().toISOString(),
  };
}
