import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

// Register ChartJS modules
ChartJS.register(ArcElement, Tooltip, Legend);

export function DoughnutChart({ data }) {
  // Default options for the chart to make it responsive and styled for Finora
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom', // Positions legend below the chart
        labels: {
          padding: 20,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed !== null) {
              // Formats value as currency
              label += new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(context.parsed);
            }
            return label;
          }
        }
      }
    },
    cutout: '70%', // Adjusts the thickness of the doughnut
  };

  return <Doughnut data={data} options={options} />;
}