import {
  getAllClients,
  getAllClientsWithProjectData,
} from "entities/clients/api/api";

export const getAllClientsQuery = () => ({
  queryKey: ["clients"],
  queryFn: async () => {
    const res = await getAllClients();

    return res.data;
  },
});

export const getClientsWithProjectDataQuery = () => ({
  queryKey: ["clients", "with-project-data"],
  queryFn: async () => {
    const res = await getAllClientsWithProjectData();

    return res.data;
  },
});
