"use client";

import { useMemo } from "react";
import type { Task } from "@/types/task";
import { getAvgCompletionTimeByPriority } from "@/lib/chart-utils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface CompletionTimeChartProps {
  tasks: Task[];
}

export function CompletionTimeChart({ tasks }: CompletionTimeChartProps) {
  const chartData = useMemo(() => {
    if (tasks.length === 0) return [];

    const avgTimes = getAvgCompletionTimeByPriority(tasks);

    return [
      { name: "Low", hours: avgTimes["Low"] },
      { name: "Medium", hours: avgTimes["Medium"] },
      { name: "High", hours: avgTimes["High"] },
    ];
  }, [tasks]);

  const completedTasks = tasks.filter(
    (task) => task.completed && task.completedAt
  );

  if (completedTasks.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        No completed tasks to display
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={chartData}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis label={{ value: "Hours", angle: -90, position: "insideLeft" }} />
        <Tooltip formatter={(value) => [`${value} hours`, "Average Time"]} />
        <Legend />
        <Bar dataKey="hours" fill="#8884d8" name="Average Hours to Complete" />
      </BarChart>
    </ResponsiveContainer>
  );
}
