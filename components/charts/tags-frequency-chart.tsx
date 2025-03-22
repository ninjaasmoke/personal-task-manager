"use client";

import { useMemo } from "react";
import type { Task } from "@/types/task";
import { countTagsFrequency } from "@/lib/chart-utils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface TagsFrequencyChartProps {
  tasks: Task[];
}

export function TagsFrequencyChart({ tasks }: TagsFrequencyChartProps) {
  const chartData = useMemo(() => {
    if (tasks.length === 0) return [];
    return countTagsFrequency(tasks);
  }, [tasks]);

  if (tasks.length === 0 || chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        No tags to display
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={chartData}
        layout="vertical"
        margin={{ top: 5, right: 30, left: 50, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" />
        <YAxis type="category" dataKey="name" tick={{ fontSize: 14 }} />
        <Tooltip
          formatter={(value) => [`${value} tasks`, "Frequency"]}
          labelFormatter={(label) => `#${label}`}
        />
        <Bar dataKey="count" fill="#8884d8" name="Tasks" />
      </BarChart>
    </ResponsiveContainer>
  );
}
