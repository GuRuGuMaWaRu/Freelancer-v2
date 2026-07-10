import { config } from "../const";

//** TODO: actually I don't like this inconsistency with methods - some are defined specifically in customConfig, while the others are auto-guessed based on data, this is bad! */
interface IConfig {
  data?: object;
  useToken?: boolean;
  headers?: Record<string, string>;
  method?: "PATCH" | "DELETE" | "POST" | "GET";
}

interface IResponse<ResponseType> {
  status: string;
  data: ResponseType;
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
    const data: IResponse<ResponseType> = await response.json();

    if (response.ok) {
      return data;
    } else {
      return Promise.reject(data);
    }
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
