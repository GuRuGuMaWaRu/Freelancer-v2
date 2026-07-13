import { apiClient } from "shared/api";
import type { IClient, IClientWithProjectData } from "shared/types";

const getAllClients = async () => {
  return await apiClient.get<IClient[]>("clients");
};

const getAllClientsWithProjectData = async () => {
  return await apiClient.get<IClientWithProjectData[]>(
    "clients/withProjectData"
  );
};

export { getAllClients, getAllClientsWithProjectData };
