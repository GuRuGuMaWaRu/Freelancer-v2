import {
  apiErrorResponseSchema,
  clientSchema,
  clientWithProjectDataSchema,
  projectChartItemSchema,
  projectListItemSchema,
  successResponseSchema,
} from "@pet-freelancer/shared";

const date = "2026-07-13T10:30:00.000Z";
const project = {
  _id: "project-1",
  projectNr: "PF-001",
  payment: 100,
  currency: "USD",
  date,
  paid: true,
};

describe("shared API contracts", () => {
  test("parses a successful API response envelope", () => {
    const schema = successResponseSchema(clientSchema);

    expect(
      schema.parse({
        status: "success",
        data: { _id: "client-1", name: "Acme" },
        results: 1,
      }),
    ).toEqual({
      status: "success",
      data: { _id: "client-1", name: "Acme" },
      results: 1,
    });
  });

  test("preserves structured validation details in an API error", () => {
    const parsed = apiErrorResponseSchema.parse({
      code: 422,
      status: "fail",
      message: "Validation error",
      errors: {
        formErrors: [],
        fieldErrors: { currency: ["Invalid enum value"] },
      },
    });

    expect(parsed.errors).toEqual({
      formErrors: [],
      fieldErrors: { currency: ["Invalid enum value"] },
    });
  });

  test("keeps project list dates as ISO strings", () => {
    const parsed = projectListItemSchema.parse({
      ...project,
      client: { _id: "client-1", name: "Acme" },
    });

    expect(parsed.date).toBe(date);
    expect(parsed.client).toMatchObject({ _id: "client-1", name: "Acme" });
  });

  test("accepts the chart endpoint's name-only client", () => {
    const parsed = projectChartItemSchema.parse({
      ...project,
      client: { name: "Acme" },
    });

    expect(parsed.date).toBe(date);
    expect(parsed.client).toEqual({ name: "Acme" });
  });

  test("accepts a null chart client when the client was soft-deleted", () => {
    const parsed = projectChartItemSchema.parse({
      ...project,
      client: null,
    });

    expect(parsed.client).toBeNull();
  });

  test("keeps client statistics dates as ISO strings", () => {
    const parsed = clientWithProjectDataSchema.parse({
      _id: "client-1",
      name: "Acme",
      totalProjects: 2,
      firstProjectDate: date,
      lastProjectDate: date,
      totalEarnings: 250,
      projectsLast30Days: 1,
      projectsLast90Days: 2,
      projectsLast365Days: 2,
      daysSinceLastProject: 0,
    });

    expect(parsed.firstProjectDate).toBe(date);
    expect(parsed.lastProjectDate).toBe(date);
  });
});
