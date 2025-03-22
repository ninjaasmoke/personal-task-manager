"use client";

import { useMemo } from "react";
import type { Task } from "@/types/task";
import { countMentionsFrequency } from "@/lib/chart-utils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface MentionsFrequencyChartProps {
  tasks: Task[];
}

export function MentionsFrequencyChart({ tasks }: MentionsFrequencyChartProps) {
  const chartData = useMemo(() => {
    if (tasks.length === 0) return [];
    return countMentionsFrequency(tasks);
  }, [tasks]);

  if (tasks.length === 0 || chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        No mentions to display
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
          labelFormatter={(label) => `@${label}`}
        />
        <Bar dataKey="count" fill="#3b82f6" name="Tasks" />
      </BarChart>
    </ResponsiveContainer>
  );
}
