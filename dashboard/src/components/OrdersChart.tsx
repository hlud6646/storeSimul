"use client"

import { useEffect, useState } from "react"
import { CartesianGrid, Line, LineChart, XAxis, YAxis, Tooltip, Legend } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart.tsx"

export function OrdersChart() {
  const [chartData, setChartData] = useState<any[]>([])

  useEffect(() => {
    fetch("http://localhost:8005/orders_over_time")
      .then((res) => res.json())
      .then((data) => {
        const formattedData = data.map(item => ({
          ...item,
          date: new Date(item.date + 'Z').toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
        }));
        setChartData(formattedData);
      })
      .catch((error) => console.error("Failed to fetch orders data:", error));
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Orders Over Time</CardTitle>
        <CardDescription>Number of orders in 5-minute intervals.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={{}} className="min-h-[200px] w-full">
          <LineChart data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              dataKey="orders"
              allowDecimals={false}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Line
              dataKey="orders"
              type="monotone"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
} 