import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  LabelList,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { getMaxLabelLength } from "features/charts/lib";
import { colors } from "shared/const";
import { formatUSD } from "shared/lib";
import type { IEarningsByClient } from "shared/types";

import styles from "../charts.module.css";

interface IProps {
  data: IEarningsByClient[];
}

const ROW_HEIGHT = 40;

function ClientsChart({ data }: IProps) {
  const longestClientName = React.useMemo(
    () => getMaxLabelLength(data),
    [data]
  );

  if (data.length === 0) {
    return (
      <div className={styles.emptyChart}>
        <p>No client earnings in this range</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={data.length * ROW_HEIGHT}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{
          top: 10,
          right: 30,
          left: 30,
          bottom: 30,
        }}
      >
        <XAxis
          dataKey="payment"
          stroke={colors.textImportant}
          type="number"
          tickFormatter={(value) => formatUSD(value)}
        />
        <YAxis
          dataKey="client"
          type="category"
          stroke={colors.textImportant}
          width={longestClientName}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip
          content={({ active, payload }) => {
            return active && payload && payload.length ? (
              <div className={styles.tooltipContainer}>
                <div className={styles.tooltipContents}>
                  <p>
                    <b>Client:</b> {payload[0].payload.client}
                  </p>
                  <p>
                    <b>Earnings:</b> ${payload[0].payload.payment}
                  </p>
                  <p>
                    <b># of projects:</b> {payload[0].payload.projects}
                  </p>
                </div>
              </div>
            ) : null;
          }}
        />
        <Bar
          type="monotone"
          dataKey="payment"
          minPointSize={30}
          stroke="#8884d8"
          fill="#8884d8"
        >
          <LabelList
            dataKey="payment"
            position="inside"
            fill={colors.white}
            formatter={(value: number) => formatUSD(value)}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export const MemoClientsChart = React.memo(ClientsChart);
