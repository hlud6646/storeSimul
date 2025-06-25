"use client";

import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
} from "chart.js";
import { useEffect, useState } from "react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "Chart.js Bar Chart",
    },
  },
};

export function OrdersLineChart() {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    async function fetchOrders() {
      try {
        const response = await fetch("http://localhost:8005/orders_over_time");
        const data = await response.json();
        const labels = data.map((item) => item.date);
        const values = data.map((item) => item.orders);

        setChartData({
          labels,
          datasets: [
            {
              label: "Orders per 10 seconds",
              data: values,
              borderColor: "rgb(75, 192, 192)",
              tension: 0.1,
            },
          ],
        });
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      }
    }

    fetchOrders();
    const interval = setInterval(fetchOrders, 10000); 

    return () => clearInterval(interval);
  }, []);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Orders Over Time",
      },
    },
  };

  return <Line options={chartOptions} data={chartData} />;
}

const labels = ["January", "February", "March", "April", "May", "June", "July"];

export const data = {
  labels,
  datasets: [
    {
      label: "Dataset 1",
      data: labels.map(() => Math.random() * 1000),
      backgroundColor: "rgba(255, 99, 132, 0.5)",
    },
    {
      label: "Dataset 2",
      data: labels.map(() => Math.random() * 1000),
      backgroundColor: "rgba(53, 162, 235, 0.5)",
    },
  ],
};

export function BarChart() {
  return <Bar options={options} data={data} />;
} 