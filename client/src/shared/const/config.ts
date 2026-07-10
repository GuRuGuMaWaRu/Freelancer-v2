export const API_URL =
  import.meta.env.MODE === "test"
    ? "http://localhost/api/v1"
    : "http://localhost:3000/api/v1";

export const LOCAL_STORAGE_KEY = "__FreelancerApp_token__";
export const USERS_KEY = "__FreelancerApp_dev_users__";
export const PROJECTS_KEY = "__FreelancerApp_dev_projects__";

export const PAGE_LIMIT = 15;

export const NOTIFICATION_DURATION = 4000;

/** Default chart time range for dashboard (3m, 6m, 1y, 2y, all). */
export const DEFAULT_CHART_RANGE = "1y" as const;
