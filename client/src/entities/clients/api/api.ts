import { apiClient } from "shared/api";
import type { IClient } from "shared/types";
import type { IClientWithProjectData } from "../types/clients.types";

const getAllClients = async () => {
  return await apiClient.get<IClient[]>("clients");
};

const getAllClientsWithProjectData = async () => {
  return await apiClient.get<IClientWithProjectData[]>(
    "clients/withProjectData"
  );
};

export { getAllClients, getAllClientsWithProjectData };
