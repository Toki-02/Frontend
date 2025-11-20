// src/components/charts/CategoryPie.jsx
import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function CategoryPie() {
  const data = {
    labels: ["Fiction", "Non-fiction", "Science", "Math", "History"], // Book categories
    datasets: [
      {
        label: "# of Books",
        data: [12, 19, 5, 7, 3], // Placeholder numbers
        backgroundColor: [
          "rgba(14,165,233,0.85)",
          "rgba(6,182,212,0.85)",
          "rgba(34,197,94,0.85)",
          "rgba(250,204,21,0.85)",
          "rgba(239,68,68,0.85)",
        ],
        borderWidth: 1,
      },
    ],
  };

  return <Pie data={data} options={{ responsive: true, plugins: { legend: { position: "bottom" } } }} />;
}
