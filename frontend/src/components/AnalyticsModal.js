import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";

// Register ChartJS modules
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const AnalyticsModal = ({ stockName, close }) => {
  // Mock data - In a real app, you would fetch this from your backend based on the stockName
  const data = {
    labels: ["9:30", "10:30", "11:30", "12:30", "1:30", "2:30", "3:30"],
    datasets: [
      {
        label: `${stockName} Price History`,
        data: [1550, 1565, 1540, 1555, 1580, 1570, 1590], // Replace with real API data
        borderColor: "#4184f3",
        backgroundColor: "rgba(65, 132, 243, 0.1)",
        fill: true,
        tension: 0.4, // Makes the line curved
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: `Real-time Analytics: ${stockName}` },
    },
    scales: {
      y: { beginAtZero: false },
    },
  };

  return (
    <div className="modal-overlay" style={styles.overlay} onClick={close}>
      {/* Added onClick={e => e.stopPropagation()} to prevent closing when clicking inside the modal */}
      <div className="modal-content" style={styles.content} onClick={e => e.stopPropagation()}>
        <div style={styles.header}>
          <h3>Stock Performance - {stockName}</h3>
          <button onClick={close} style={styles.closeBtn}>X</button>
        </div>
        
        <div style={styles.chartContainer}>
          <Line data={data} options={options} />
        </div>

        <div style={styles.stats}>
          <div style={styles.statBox}>
            <p>52W High</p>
            <strong>1,850.00</strong>
          </div>
          <div style={styles.statBox}>
            <p>52W Low</p>
            <strong>1,240.00</strong>
          </div>
          <div style={styles.statBox}>
            <p>Market Cap</p>
            <strong>12.4T</strong>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2000,
  },
  content: {
    backgroundColor: "white",
    padding: "30px",
    borderRadius: "8px",
    width: "600px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
    borderBottom: "1px solid #eee",
    paddingBottom: "10px",
  },
  closeBtn: {
    border: "none",
    background: "none",
    fontSize: "18px",
    cursor: "pointer",
    color: "#999",
  },
  chartContainer: {
    marginBottom: "20px",
  },
  stats: {
    display: "flex",
    justifyContent: "space-between",
    borderTop: "1px solid #eee",
    paddingTop: "20px",
  },
  statBox: {
    textAlign: "center",
  },
};

export default AnalyticsModal;