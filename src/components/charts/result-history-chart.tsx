"use client";

import type { ComponentProps } from "react";
import { BarController, BarElement, CategoryScale, Chart as ChartJS, Legend, LineController, LineElement, LinearScale, PointElement, Tooltip } from "chart.js";
import { Chart } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Tooltip, Legend, BarController, LineController);

export function ResultHistoryChart({ data, options }: { data: ComponentProps<typeof Chart>["data"]; options: ComponentProps<typeof Chart>["options"] }) {
    return <Chart type="bar" data={data} options={options} />;
}
