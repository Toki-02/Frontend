// src/components/charts/CategoryPie.jsx
import React from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function CategoryPie({ data }) {
  const defaultData = {
    labels: ["Computer Science", "Fiction", "Business", "Education", "Science"],
    datasets: [
      {
        label: "Categories",
        data: [45, 25, 12, 10, 8],
        backgroundColor: [
          "rgba(124,58,237,0.9)",
          "rgba(99,102,241,0.8)",
          "rgba(14,165,233,0.8)",
          "rgba(16,185,129,0.8)",
          "rgba(244,114,182,0.8)",
        ],
        borderColor: "rgba(0,0,0,0.2)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "bottom", labels: { color: "#C7C7D1" } },
      tooltip: { callbacks: {} },
    },
  };

  return (
    <div style={{ width: "100%", height: "300px" }}>
      <Pie data={data ?? defaultData} options={options} />
    </div>
  );
}
