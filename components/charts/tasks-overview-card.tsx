"use client";

import { useMemo } from "react";
import { type Task, Priority } from "@/types/task";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Clock, AlertTriangle, Calendar } from "lucide-react";

interface TasksOverviewCardProps {
  tasks: Task[];
}

export function TasksOverviewCard({ tasks }: TasksOverviewCardProps) {
  const stats = useMemo(() => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((task) => task.completed).length;
    const pendingTasks = totalTasks - completedTasks;
    const highPriorityTasks = tasks.filter(
      (task) => task.priority === Priority.HIGH && !task.completed
    ).length;

    // Calculate completion rate
    const completionRate =
      totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // Calculate average completion time in days
    let avgCompletionDays = 0;
    const completedTasksWithTime = tasks.filter(
      (task) => task.completed && task.completedAt
    );

    if (completedTasksWithTime.length > 0) {
      const totalDays = completedTasksWithTime.reduce((total, task) => {
        const createdDate = new Date(task.createdAt).getTime();
        const completedDate = new Date(task.completedAt!).getTime();
        const days = Math.round(
          (completedDate - createdDate) / (1000 * 60 * 60 * 24)
        );
        return total + days;
      }, 0);

      avgCompletionDays = Math.round(totalDays / completedTasksWithTime.length);
    }

    return {
      totalTasks,
      completedTasks,
      pendingTasks,
      highPriorityTasks,
      completionRate,
      avgCompletionDays,
    };
  }, [tasks]);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardContent className="flex flex-col items-center justify-center p-6">
          <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900 mb-4">
            <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-300" />
          </div>
          <div className="space-y-0.5 text-center">
            <p className="text-sm font-medium text-muted-foreground">
              Total Tasks
            </p>
            <p className="text-3xl font-bold">{stats.totalTasks}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex flex-col items-center justify-center p-6">
          <div className="flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900 mb-4">
            <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-300" />
          </div>
          <div className="space-y-0.5 text-center">
            <p className="text-sm font-medium text-muted-foreground">
              Completion Rate
            </p>
            <p className="text-3xl font-bold">{stats.completionRate}%</p>
            <p className="text-xs text-muted-foreground">
              {stats.completedTasks} of {stats.totalTasks} tasks
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex flex-col items-center justify-center p-6">
          <div className="flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 dark:bg-yellow-900 mb-4">
            <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-300" />
          </div>
          <div className="space-y-0.5 text-center">
            <p className="text-sm font-medium text-muted-foreground">
              Avg. Completion Time
            </p>
            <p className="text-3xl font-bold">{stats.avgCompletionDays}</p>
            <p className="text-xs text-muted-foreground">days per task</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex flex-col items-center justify-center p-6">
          <div className="flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900 mb-4">
            <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-300" />
          </div>
          <div className="space-y-0.5 text-center">
            <p className="text-sm font-medium text-muted-foreground">
              High Priority
            </p>
            <p className="text-3xl font-bold">{stats.highPriorityTasks}</p>
            <p className="text-xs text-muted-foreground">pending tasks</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
