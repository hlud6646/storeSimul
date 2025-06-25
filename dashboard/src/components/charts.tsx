"use client";

import { Line, Bar } from "react-chartjs-2";
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
import type { ChartData, ChartOptions } from "chart.js";
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

export const options: ChartOptions<'bar'> = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: true,
      text: "Chart.js Bar Chart",
    },
  },
};

export function BarChart({ data, options }: { data: ChartData<'bar'>, options?: ChartOptions<'bar'> }) {
    return <Bar options={options} data={data} />;
}

export function OrdersLineChart() {
  const [chartData, setChartData] = useState<ChartData<'line'>>({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    async function fetchOrders() {
      try {
        const response = await fetch("http://localhost:8005/orders_over_time");
        const data = await response.json();
        data.reverse();
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
    const interval = setInterval(fetchOrders, 2000); 

    return () => clearInterval(interval);
  }, []);

  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Orders Over Time",
      },
    },
  };

  return <Line options={chartOptions} data={chartData} />;
}
