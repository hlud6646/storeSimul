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
  ChartOptions,
  ChartData,
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

export const options: ChartOptions<"bar"> = {
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

export const BarChart: React.FC<{ data: ChartData<"bar">; options?: ChartOptions<"bar"> }> = ({
  data,
  options,
}) => {
  return <Bar data={data} options={options} />;
};

export function OrdersLineChart() {
  const [chartData, setChartData] = useState<ChartData<"line">>({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    async function fetchOrders() {
      try {
        const response = await fetch("http://localhost:8005/orders_over_time");
        const data = await response.json();
        const labels = data.map((item: { date: string }) => item.date);
        const values = data.map((item: { orders: number }) => item.orders);

        setChartData({
          labels,
          datasets: [
            {
              label: "Recent Orders",
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

  const chartOptions: ChartOptions<"line"> = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: false,
        text: "Orders Over Time",
      },
    },
  };

  return <Line options={chartOptions} data={chartData} />;
}
