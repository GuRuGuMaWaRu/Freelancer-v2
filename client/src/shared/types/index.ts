import type {
  ApiSuccessResponse,
  Client,
  ClientWithProjectData,
  CurrencyType,
  ProjectListItem,
  ProjectPaginatedData,
  UserAuthData,
} from "@pet-freelancer/shared";

import { Currency } from "@pet-freelancer/shared";

interface Error {
  message: string | undefined;
}

type ErrorVariant = "stacked" | "inline";

type IProject = ProjectListItem;
type IProjectPaginatedData = ProjectPaginatedData;
type IClient = Client;
type IClientWithProjectData = ClientWithProjectData;
type IResponseUserData = UserAuthData;

interface IEarningsByClient {
  client: string;
  payment: number;
  projects: number;
}

interface IEarningsByMonth {
  date: number;
  payment: number;
  projects: number;
}

interface IEarnings {
  id: string;
  date: Date;
  payment: number;
  projects: number;
}

/** Dashboard chart time range: 3m, 6m, 1y, 2y, or all time */
type ChartRange = "3m" | "6m" | "1y" | "2y" | "all";

interface ILoginFormInputs {
  email: string;
  password: string;
}

interface IRegisterFormInputs {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

enum NotificationType {
  "success",
  "warning",
}

interface INotification {
  type: NotificationType;
  message: string;
}

interface INotificationProps {
  notification: INotification | null;
  hideNotification: () => void;
  isShown: boolean;
}

export type {
  ApiSuccessResponse,
  ChartRange,
  CurrencyType,
  Error,
  ErrorVariant,
  IProject,
  IProjectPaginatedData,
  IClient,
  IClientWithProjectData,
  IEarningsByClient,
  IEarningsByMonth,
  IEarnings,
  IResponseUserData,
  ILoginFormInputs,
  IRegisterFormInputs,
  INotification,
  INotificationProps,
};

export { NotificationType, Currency };
