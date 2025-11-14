// src/components/charts/BorrowTrendChart.jsx
import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function BorrowTrendChart({ chartData, chartOptions }) {
  // fallback sample data if none provided
  const defaultData = {
    labels: ["May", "Jun", "Jul", "Aug", "Sep", "Oct"],
    datasets: [
      {
        label: "Books Borrowed",
        data: [120, 190, 150, 220, 260, 198],
        backgroundColor: "rgba(124,58,237,0.75)",
        borderColor: "rgba(124,58,237,1)",
        borderWidth: 1,
        borderRadius: 6,
        maxBarThickness: 40,
        barPercentage: 0.7,
        categoryPercentage: 0.7,
      },
    ],
  };

  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, position: "top", labels: { color: "#C7C7D1" } },
      title: { display: false },
      tooltip: { mode: "index", intersect: false },
    },
    scales: {
      x: {
        ticks: { color: "#111113ff" },
        grid: { display: false },
      },
      y: {
        beginAtZero: true,
        ticks: { color: "#1e1e20ff" },
        grid: { color: "rgba(17, 17, 17, 0.07)" },
      },
    },
  };

  return (
    <div style={{ width: "100%", height: "360px" }}>
      <Bar data={chartData ?? defaultData} options={chartOptions ?? defaultOptions} />
    </div>
  );
}
