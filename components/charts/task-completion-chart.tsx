"use client";

import { useMemo } from "react";
import type { Task } from "@/types/task";
import {
  formatDate,
  groupTasksByDate,
  groupCompletedTasksByDate,
} from "@/lib/chart-utils";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface TaskCompletionChartProps {
  tasks: Task[];
}

export function TaskCompletionChart({ tasks }: TaskCompletionChartProps) {
  const chartData = useMemo(() => {
    if (tasks.length === 0) return [];

    // Sort tasks by date
    const sortedTasks = [...tasks].sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    // Get earliest and latest dates
    const earliestDate = new Date(sortedTasks[0].createdAt);
    const latestDate = new Date();

    // Create array of all dates between earliest and latest
    const allDates: string[] = [];
    const currentDate = new Date(earliestDate);

    while (currentDate <= latestDate) {
      allDates.push(formatDate(currentDate.toISOString()));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Group tasks by date
    const createdByDate = groupTasksByDate(tasks);
    const completedByDate = groupCompletedTasksByDate(tasks);

    // Create chart data
    return allDates.map((date) => ({
      date,
      created: createdByDate[date] || 0,
      completed: completedByDate[date] || 0,
    }));
  }, [tasks]);

  if (tasks.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        No tasks to display
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={chartData}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Area
          type="monotone"
          dataKey="created"
          name="Tasks Created"
          stackId="1"
          stroke="#8884d8"
          fill="#8884d8"
        />
        <Area
          type="monotone"
          dataKey="completed"
          name="Tasks Completed"
          stackId="2"
          stroke="#82ca9d"
          fill="#82ca9d"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
