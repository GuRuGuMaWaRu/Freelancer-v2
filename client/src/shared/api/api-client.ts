import type {
  ApiSuccessResponse,
  ApiErrorResponse,
} from "@pet-freelancer/shared";

import { config } from "../const";

interface IConfig {
  data?: unknown;
  useToken?: boolean;
  headers?: Record<string, string>;
  method?: "PATCH" | "DELETE" | "POST" | "GET";
}

function prepareBody(body: unknown) {
  if (body === undefined) return undefined;

  if (
    body instanceof FormData ||
    body instanceof Blob ||
    typeof body === "string"
  ) {
    return body;
  }

  return JSON.stringify(body);
}

async function client<ResponseType>(
  endpoint: string,
  {
    data,
    useToken = true,
    headers: customHeaders,
    ...customConfig
  }: IConfig = {}
) {
  const address = "/api/v1/" + endpoint;

  const headers = new Headers(customHeaders);
  const body = prepareBody(data);

  if (useToken && !headers.has("Authorization")) {
    headers.set(
      "Authorization",
      `Bearer ${localStorage.getItem(config.LOCAL_STORAGE_KEY)}`
    );
  }

  if (body !== undefined && !headers.has("Content-Type")) {
    if (data instanceof FormData) {
      // do nothing — fetch will set multipart/form-data
    } else if (data instanceof Blob) {
      if (data.type) {
        headers.set("Content-Type", data.type);
      }
    } else if (typeof data === "string") {
      headers.set("Content-Type", "text/plain;charset=UTF-8");
    } else {
      headers.set("Content-Type", "application/json");
    }
  }

  const options = {
    body,
    headers,
    ...customConfig,
  };

  return window.fetch(address, options).then(async (response) => {
    const parsedBody: ApiSuccessResponse<ResponseType> | ApiErrorResponse =
      await response.json();

    if (response.ok) {
      return parsedBody as ApiSuccessResponse<ResponseType>;
    }

    return Promise.reject(parsedBody as ApiErrorResponse);
  });
}

const apiClient = {
  get: <ResponseType>(endpoint: string, config?: IConfig) =>
    client<ResponseType>(endpoint, { ...config, method: "GET" }),
  post: <ResponseType>(endpoint: string, config?: IConfig) =>
    client<ResponseType>(endpoint, { ...config, method: "POST" }),
  patch: <ResponseType>(endpoint: string, config?: IConfig) =>
    client<ResponseType>(endpoint, { ...config, method: "PATCH" }),
  delete: <ResponseType>(endpoint: string, config?: IConfig) =>
    client<ResponseType>(endpoint, { ...config, method: "DELETE" }),
};

export default apiClient;
