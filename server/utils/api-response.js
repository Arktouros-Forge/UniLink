export function successResponse(
  data = null,
  message = "Success",
  statusCode = 200,
) {
  return {
    success: true,
    statusCode,
    message,
    data,
    timestamp: new Date().toISOString(),
  };
}

export function errorResponse(
  message = "Something went wrong",
  errors = null,
  statusCode = 400,
) {
  return {
    success: false,
    statusCode,
    message,
    data: null,
    errors,
    timestamp: new Date().toISOString(),
  };
}
