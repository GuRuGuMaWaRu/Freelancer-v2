import { clientDataItems } from "../const/clients.const";
import type { IClientWithProjectData } from "shared/types";

type TClientDataItem = keyof typeof clientDataItems;

export type { IClientWithProjectData, TClientDataItem };
