import { describe, expect, it, vi } from "vitest";

import { ApiError, createApiClient } from "./api-client";

describe("createApiClient", () => {
  it("sends authenticated JSON requests to the existing Express API", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        status: "success",
        data: { docs: [] },
      }),
    });

    const client = createApiClient({
      baseUrl: "/api/v1",
      getToken: () => "test-token",
      fetchImpl: fetchMock,
    });

    const result = await client.get<{ docs: unknown[] }>("projects?page=1");

    expect(result).toEqual({ status: "success", data: { docs: [] } });
    expect(fetchMock).toHaveBeenCalledWith("/api/v1/projects?page=1", {
      body: undefined,
      headers: {
        Authorization: "Bearer test-token",
        "Content-Type": "application/json",
      },
      method: "GET",
    });
  });

  it("rejects failed API responses with status and payload details", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 401,
      json: async () => ({
        status: "fail",
        message: "Not authorized",
      }),
    });

    const client = createApiClient({
      baseUrl: "/api/v1",
      getToken: () => null,
      fetchImpl: fetchMock,
    });

    await expect(client.post("users/login", { data: {} })).rejects.toEqual(
      new ApiError(401, {
        status: "fail",
        message: "Not authorized",
      }),
    );
  });
});
