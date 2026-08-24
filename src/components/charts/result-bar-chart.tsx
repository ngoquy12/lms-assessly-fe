"use client";

import { BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip } from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export interface ResultCriteriaData {
    labels: string[];
    correctCounts: number[];
    wrongCounts: number[];
}

export interface ResultBarChartProps {
    data: ResultCriteriaData;
    title?: string;
    className?: string;
}

export function ResultBarChart({ data, title = "Thống kê đúng / sai theo từng tiêu chí", className }: ResultBarChartProps) {
    const chartData = {
        labels: data.labels,
        datasets: [
            {
                label: "Số câu đúng",
                data: data.correctCounts,
                backgroundColor: "#16A34A",
                borderRadius: 6,
                barThickness: 24,
            },
            {
                label: "Số câu sai",
                data: data.wrongCounts,
                backgroundColor: "#DC2626",
                borderRadius: 6,
                barThickness: 24,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                grid: {
                    display: false,
                },
                ticks: {
                    color: "#475569",
                    font: { size: 11 },
                },
            },
            y: {
                beginAtZero: true,
                grid: {
                    color: "rgba(226, 232, 240, 0.8)",
                },
                ticks: {
                    stepSize: 1,
                    color: "#94a3b8",
                },
            },
        },
        plugins: {
            legend: {
                position: "bottom" as const,
                labels: {
                    usePointStyle: true,
                    boxWidth: 8,
                    color: "#475569",
                },
            },
        },
    };

    return (
        <div className={className}>
            {title && <h3 className="mb-4 text-center text-sm font-semibold text-gray-800">{title}</h3>}
            <div className="h-72 w-full">
                <Bar data={chartData} options={options} />
            </div>
        </div>
    );
}
