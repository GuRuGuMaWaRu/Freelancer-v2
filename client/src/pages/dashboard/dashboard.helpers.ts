import type {
  IProjectChartItem,
  IEarningsByClient,
  IEarnings,
} from "shared/types";

/** Build exactly N month buckets ending with the current month. Start = current - (months - 1) so the last bucket is current month. Server uses the same range. months must be > 0. */
const setDateRangeFromMonths = (months: number): Record<string, IEarnings> => {
  const dates: Record<string, IEarnings> = {};

  const date = new Date();
  date.setMonth(date.getMonth() - (months - 1));
  date.setDate(1);
  date.setHours(0, 0, 0, 0);

  for (let i = 0; i < months; i++) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const key = `${year}-${month}`;
    dates[key] = {
      id: key,
      date: new Date(year, date.getMonth(), 1),
      payment: 0,
      projects: 0,
    };
    date.setMonth(date.getMonth() + 1);
  }

  return dates;
};

/** Build month buckets from earliest to latest project date (or current month if no projects). monthsBack 0 = all time. */
const setDateRangeFromProjects = (
  projects: IProjectChartItem[],
): Record<string, IEarnings> => {
  const dates: Record<string, IEarnings> = {};

  if (projects.length === 0) {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const key = `${year}-${month}`;
    dates[key] = {
      id: key,
      date: new Date(year, now.getMonth(), 1),
      payment: 0,
      projects: 0,
    };
    return dates;
  }

  const minDate = new Date(
    Math.min(...projects.map((p) => new Date(p.date).getTime()))
  );
  const maxDate = new Date(
    Math.max(...projects.map((p) => new Date(p.date).getTime()))
  );

  minDate.setDate(1);
  minDate.setHours(0, 0, 0, 0);
  maxDate.setDate(1);
  maxDate.setHours(0, 0, 0, 0);

  const cursor = new Date(minDate);
  while (cursor <= maxDate) {
    const year = cursor.getFullYear();
    const month = cursor.getMonth() + 1;
    const key = `${year}-${month}`;
    dates[key] = {
      id: key,
      date: new Date(year, cursor.getMonth(), 1),
      payment: 0,
      projects: 0,
    };
    cursor.setMonth(cursor.getMonth() + 1);
  }

  return dates;
};

/**
 * @param monthsBack - Number of months from now (3, 6, 12, 24). Use 0 for all time.
 */
const getEarningsByMonths = (
  projects: IProjectChartItem[],
  monthsBack: number
): IEarnings[] => {
  const dates =
    monthsBack > 0
      ? setDateRangeFromMonths(monthsBack)
      : setDateRangeFromProjects(projects);

  for (const project of projects) {
    const year = new Date(project.date).getFullYear();
    const month = new Date(project.date).getMonth() + 1;
    const key = `${year}-${month}`;
    if (dates[key]) {
      dates[key].payment += project.payment * 1000;
      dates[key].projects += 1;
    }
  }

  return Object.values(dates);
};

const getEarningsByClients = (
  projects: IProjectChartItem[],
): IEarningsByClient[] => {
  const earnings: Record<string, IEarningsByClient> = {};

  for (const project of projects) {
    const clientName = project.client.name;

    if (!clientName) {
      continue;
    }

    if (!earnings[clientName]) {
      earnings[clientName] = {
        client: clientName,
        payment: project.payment * 1000,
        projects: 1,
      };
    } else {
      earnings[clientName].payment += project.payment * 1000;
      earnings[clientName].projects += 1;
    }
  }

  return Object.values(earnings)
    .map((item) => ({
      ...item,
      payment: item.payment / 1000,
    }))
    .sort((a, b) => a.payment - b.payment);
};

export { getEarningsByMonths, getEarningsByClients };
