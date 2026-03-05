import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

export function DoughnutChart({ data }) {
  const options = {
    responsive: true,
    maintainAspectRatio: false, // Allows it to grow to fill its container
    plugins: {
      legend: {
        position: 'right', // Moves labels to the side like your goal image
      },
    },
  };

  return <Doughnut data={data} options={options} />;
}