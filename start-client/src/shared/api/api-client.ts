export interface ApiSuccessResponse<TData> {
  status: "success";
  results?: number;
  data: TData;
}

export interface ApiFailureResponse {
  status: "fail" | "error";
  message?: string;
  [key: string]: unknown;
}

export type ApiResponse<TData> = ApiSuccessResponse<TData>;

type HttpMethod = "GET" | "POST" | "PATCH" | "DELETE";

interface RequestConfig {
  data?: unknown;
  headers?: Record<string, string>;
  useToken?: boolean;
}

interface ApiClientConfig {
  baseUrl: string;
  fetchImpl?: typeof fetch;
  getToken?: () => string | null;
}

export class ApiError extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly payload: ApiFailureResponse,
  ) {
    super(payload.message ?? "API request failed");
    this.name = "ApiError";
  }
}

export function createApiClient({
  baseUrl,
  fetchImpl = fetch,
  getToken = () =>
    typeof window === "undefined"
      ? null
      : window.localStorage.getItem("freelancer-token"),
}: ApiClientConfig) {
  async function request<TData>(
    endpoint: string,
    method: HttpMethod,
    { data, headers = {}, useToken = true }: RequestConfig = {},
  ): Promise<ApiResponse<TData>> {
    const token = getToken();
    const response = await fetchImpl(`${baseUrl}/${endpoint}`, {
      body: data === undefined ? undefined : JSON.stringify(data),
      headers: {
        Authorization: useToken && token ? `Bearer ${token}` : "",
        "Content-Type": "application/json",
        ...headers,
      },
      method,
    });

    const payload = await response.json();

    if (!response.ok) {
      throw new ApiError(response.status, payload);
    }

    return payload;
  }

  return {
    get: <TData>(endpoint: string, config?: RequestConfig) =>
      request<TData>(endpoint, "GET", config),
    post: <TData>(endpoint: string, config?: RequestConfig) =>
      request<TData>(endpoint, "POST", config),
    patch: <TData>(endpoint: string, config?: RequestConfig) =>
      request<TData>(endpoint, "PATCH", config),
    delete: <TData>(endpoint: string, config?: RequestConfig) =>
      request<TData>(endpoint, "DELETE", config),
  };
}

export const apiClient = createApiClient({
  baseUrl: "/api/v1",
});
