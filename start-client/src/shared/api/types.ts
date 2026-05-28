export interface ClientDto {
  _id?: string;
  name: string;
}

export interface ClientStatsDto extends ClientDto {
  _id: string;
  totalProjects: number;
  firstProjectDate: string;
  lastProjectDate: string;
  totalEarnings: number;
  projectsLast30Days: number;
  projectsLast90Days: number;
  projectsLast365Days: number;
  daysSinceLastProject: number;
}

export interface ProjectDto {
  _id: string;
  projectNr: string;
  payment: number;
  currency: "USD" | "EUR";
  date: string;
  paid: boolean;
  comments?: string;
  client: ClientDto;
}

export interface ProjectsPageDto {
  docs: ProjectDto[];
  allDocs: number;
}

export interface UserDto {
  _id: string;
  name: string;
  email: string;
  token?: string;
}
