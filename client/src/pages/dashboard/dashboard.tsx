import React from "react";
import { MemoDashboardTotals, ChartSection } from "widgets";
import { ModalAddProject } from "entities/projects";
import type { ChartRange } from "shared/types";
import { config } from "shared/const";

import { useDashboardData } from "./dashboard.hooks";
import styles from "./dashboard.module.css";

function Dashboard() {
  const [chartRange, setChartRange] = React.useState<ChartRange>(
    config.DEFAULT_CHART_RANGE
  );
  const { earningsByMonth, dataByClient, dataByMonth, clients } =
    useDashboardData(chartRange);

  return (
    <>
      <div className={styles.controlsSection}>
        <ModalAddProject clients={clients} />
      </div>

      <MemoDashboardTotals data={earningsByMonth} chartRange={chartRange} />

      <ChartSection
        clientChartData={dataByClient}
        monthsChartData={dataByMonth}
        chartRange={chartRange}
        onChartRangeChange={setChartRange}
      />
    </>
  );
}

export { Dashboard };
