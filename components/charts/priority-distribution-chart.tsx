"use client";

import { useMemo } from "react";
import type { Task } from "@/types/task";
import {
  countTasksByPriority,
  countCompletedTasksByPriority,
} from "@/lib/chart-utils";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

interface PriorityDistributionChartProps {
  tasks: Task[];
}

const COLORS = ["#4ade80", "#facc15", "#f87171"];
const RADIAN = Math.PI / 180;

export function PriorityDistributionChart({
  tasks,
}: PriorityDistributionChartProps) {
  const chartData = useMemo(() => {
    if (tasks.length === 0) return [];

    const priorityCounts = countTasksByPriority(tasks);
    const completedCounts = countCompletedTasksByPriority(tasks);

    return [
      {
        name: "Low",
        value: priorityCounts["Low"],
        completed: completedCounts["Low"],
      },
      {
        name: "Medium",
        value: priorityCounts["Medium"],
        completed: completedCounts["Medium"],
      },
      {
        name: "High",
        value: priorityCounts["High"],
        completed: completedCounts["High"],
      },
    ];
  }, [tasks]);

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
    name,
  }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
      >
        {`${name} ${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  if (tasks.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        No tasks to display
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
      <div>
        <h3 className="text-lg font-medium text-center mb-4">All Tasks</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div>
        <h3 className="text-lg font-medium text-center mb-4">
          Completed Tasks
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={100}
              fill="#8884d8"
              dataKey="completed"
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
