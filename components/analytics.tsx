"use client";

import { useState } from "react";
import { useTaskStore } from "@/lib/task-store";
import { Header } from "@/components/header";
import { TaskCompletionChart } from "@/components/charts/task-completion-chart";
import { PriorityDistributionChart } from "@/components/charts/priority-distribution-chart";
import { TagsFrequencyChart } from "@/components/charts/tags-frequency-chart";
import { CompletionTimeChart } from "@/components/charts/completion-time-chart";
import { TasksOverviewCard } from "@/components/charts/tasks-overview-card";
import { MentionsFrequencyChart } from "@/components/charts/mentions-frequency-chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { maxAppWidth } from "@/constants";

export function Analytics() {
  const [maxWidth, setMaxWidth] = useState(maxAppWidth); // Wider for analytics
  const { tasks } = useTaskStore();

  return (
    <div className="flex flex-col min-h-screen">
      <Header maxWidth={maxWidth} setMaxWidth={setMaxWidth} />
      <div className="h-[60px] w-full" />
      <div
        className="flex-1 px-4 py-6 md:px-6"
        style={{ maxWidth: `${maxWidth}px`, margin: "0 auto", width: "100%" }}
      >
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="outline" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-3xl font-bold tracking-tight">
              Analytics Dashboard
            </h1>
          </div>
        </div>

        <div className="grid gap-6">
          <TasksOverviewCard tasks={tasks} />

          <Tabs defaultValue="completion" className="w-full">
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="completion">Completion</TabsTrigger>
              <TabsTrigger value="priority">Priority</TabsTrigger>
              <TabsTrigger value="tags">Tags</TabsTrigger>
              <TabsTrigger value="mentions">Mentions</TabsTrigger>
            </TabsList>

            <TabsContent value="completion" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Task Completion Over Time</CardTitle>
                  <CardDescription>
                    Visualizes when tasks were created and completed over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <TaskCompletionChart tasks={tasks} />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Average Completion Time by Priority</CardTitle>
                  <CardDescription>
                    Shows how long it takes to complete tasks of different
                    priorities
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <CompletionTimeChart tasks={tasks} />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="priority" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Task Distribution by Priority</CardTitle>
                  <CardDescription>
                    Shows the breakdown of tasks by priority level
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <PriorityDistributionChart tasks={tasks} />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="tags" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Most Used Tags</CardTitle>
                  <CardDescription>
                    Shows the frequency of tags used across all tasks
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <TagsFrequencyChart tasks={tasks} />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="mentions" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Most Mentioned People</CardTitle>
                  <CardDescription>
                    Shows the frequency of mentions across all tasks
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <MentionsFrequencyChart tasks={tasks} />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
