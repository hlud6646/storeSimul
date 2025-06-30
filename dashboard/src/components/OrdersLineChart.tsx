"use client";

import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
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
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement
);

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
        const slicedData = data.slice(-30);

        const labels = slicedData.map((item: { date: string }) => {
          const parts = item.date.split(" ");
          if (parts.length > 1) {
            const timeStr = parts[1];
            if (timeStr.length === 6) {
              return `${timeStr.substring(0, 2)}:${timeStr.substring(
                2,
                4
              )}:${timeStr.substring(4, 6)}`;
            }
            return timeStr;
          }
          return item.date;
        });
        const values = slicedData.map(
          (item: { orders: number }) => item.orders
        );

        setChartData({
          labels,
          datasets: [
            {
              // label: "Incoming Orders",
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
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: "top" as const,
        display: false,
      },
      title: {
        display: true,
        text: "Orders Over Time",
      },
    },
    scales: {
      x: {
        ticks: {
          maxRotation: 0,
          maxTicksLimit: 10,
        },
      },
    },
  };

  return <Line options={chartOptions} data={chartData} />;
} 