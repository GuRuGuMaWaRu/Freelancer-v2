import type { ApiSuccessResponse, ApiErrorResponse } from "@pet-freelancer/shared";

import { config } from "../const";

interface IConfig {
  data?: object;
  useToken?: boolean;
  headers?: Record<string, string>;
  method?: "PATCH" | "DELETE" | "POST" | "GET";
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
  const options = {
    body: data ? JSON.stringify(data) : undefined,
    headers: {
      Authorization: useToken
        ? `Bearer ${window.localStorage.getItem(config.LOCAL_STORAGE_KEY)}`
        : "",
      "Content-Type": data ? "application/json" : "",
      ...customHeaders
    },
    ...customConfig
  };

  return window.fetch(`/api/v1/${endpoint}`, options).then(async response => {
    const parsedBody: ApiSuccessResponse<ResponseType> | ApiErrorResponse =
      await response.json();

    if (response.ok) {
      return parsedBody as ApiSuccessResponse<ResponseType>;
    }

    return Promise.reject(parsedBody);
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
    client<ResponseType>(endpoint, { ...config, method: "DELETE" })
};

export default apiClient;
