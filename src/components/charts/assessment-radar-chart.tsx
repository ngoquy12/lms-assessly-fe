"use client";

import { Chart as ChartJS, Filler, Legend, LineElement, PointElement, RadialLinearScale, Tooltip } from "chart.js";
import { Radar } from "react-chartjs-2";

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

export interface CompetencyData {
    labels: string[];
    scores: number[]; // 0 - 100
    benchmarkScores?: number[];
}

export interface AssessmentRadarChartProps {
    data: CompetencyData;
    title?: string;
    className?: string;
}

export function AssessmentRadarChart({ data, title = "Biểu đồ năng lực thí sinh", className }: AssessmentRadarChartProps) {
    const chartData = {
        labels: data.labels,
        datasets: [
            {
                label: "Điểm năng lực",
                data: data.scores,
                backgroundColor: "rgba(75, 81, 196, 0.2)",
                borderColor: "#4B51C4",
                borderWidth: 2,
                pointBackgroundColor: "#4B51C4",
                pointBorderColor: "#ffffff",
                pointHoverBackgroundColor: "#ffffff",
                pointHoverBorderColor: "#4B51C4",
            },
            ...(data.benchmarkScores
                ? [
                      {
                          label: "Điểm chuẩn trung bình",
                          data: data.benchmarkScores,
                          backgroundColor: "rgba(148, 163, 184, 0.2)",
                          borderColor: "#94a3b8",
                          borderWidth: 1.5,
                          borderDash: [4, 4],
                          pointBackgroundColor: "#94a3b8",
                      },
                  ]
                : []),
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            r: {
                angleLines: {
                    color: "rgba(226, 232, 240, 0.8)",
                },
                grid: {
                    color: "rgba(226, 232, 240, 0.8)",
                },
                suggestedMin: 0,
                suggestedMax: 100,
                ticks: {
                    stepSize: 20,
                    backdropColor: "transparent",
                    color: "#94a3b8",
                    font: {
                        size: 10,
                    },
                },
                pointLabels: {
                    color: "#334155",
                    font: {
                        size: 12,
                        weight: 600 as const,
                    },
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
            tooltip: {
                callbacks: {
                    label: (context: { dataset: { label?: string }; raw: unknown }) => ` ${context.dataset.label}: ${context.raw}%`,
                },
            },
        },
    };

    return (
        <div className={className}>
            {title && <h3 className="mb-4 text-center text-sm font-semibold text-gray-800">{title}</h3>}
            <div className="h-72 w-full">
                <Radar data={chartData} options={options} />
            </div>
        </div>
    );
}
