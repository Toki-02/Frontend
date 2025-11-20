import React from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function BorrowTrendChart({ chartData }) {
  return <Bar data={chartData} options={{ responsive: true, plugins: { legend: { display: false } } }} />;
}
