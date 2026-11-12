import copy from "@app/constants/toast.json";
import { invalidateFor, shareRequest } from "@app/utils/apiCache";

export class ApiRequestError extends Error {
  constructor(message, statusCode, errors) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors ?? [];
  }

  fieldErrors() {
    return Object.fromEntries(this.errors.map((item) => [item.field, item.message]));
  }
}

const toError = (error) => {
  const body = error?.data ?? {};
  return new ApiRequestError(
    body.message ?? (error?.statusCode ? error?.message : copy.network),
    body.statusCode ?? error?.statusCode ?? 0,
    body.errors,
  );
};

export const useApi = () => {
  const headers = import.meta.server ? useRequestHeaders(["cookie"]) : undefined;

  const request = async (path, options = {}) => {
    try {
      const send = () => $fetch(`/api/v1${path}`, { ...options, headers: { ...headers, ...options.headers } });
      const read = !options.method || options.method === "GET";
      const response = read ? await shareRequest(`${path}?${JSON.stringify(options.query ?? "")}`, send) : await send();
      if (!read) invalidateFor(path);
      return response.data;
    } catch (error) {
      throw toError(error);
    }
  };

  return {
    request,
    get: (path, query) => request(path, { query }),
    post: (path, body) => request(path, { method: "POST", body }),
    patch: (path, body) => request(path, { method: "PATCH", body }),
    put: (path, body) => request(path, { method: "PUT", body }),
    del: (path) => request(path, { method: "DELETE" }),
  };
};
