import React from "react";
import Chart from "react-apexcharts";

const StockChart = ({ selectedStock }) => {
  const series = [{
    data: [
      { x: new Date(2026, 2, 1), y: [1550, 1560, 1545, 1555] },
      { x: new Date(2026, 2, 2), y: [1555, 1575, 1550, 1570] },
      { x: new Date(2026, 2, 3), y: [1570, 1580, 1560, 1565] },
      { x: new Date(2026, 2, 4), y: [1565, 1570, 1540, 1555] },
    ]
  }];

  const options = {
    chart: { type: "candlestick", toolbar: { show: false } },
    xaxis: { type: "datetime" },
    plotOptions: { candlestick: { colors: { upward: '#4caf50', downward: '#f44336' } } }
  };

  return (
    <div className="chart-container" style={{ marginTop: '20px', padding: '20px', background: '#fff' }}>
      <h5>{selectedStock?.name} Performance</h5>
      <Chart options={options} series={series} type="candlestick" height={300} />
    </div>
  );
};

export default StockChart;