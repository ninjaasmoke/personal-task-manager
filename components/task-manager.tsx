"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Header } from "@/components/header";
import { TaskTable } from "@/components/task-table";
import { NewTaskDialog } from "@/components/new-task-dialog";
import { TaskDetailPanel } from "@/components/task-detail-panel";
import type { Task } from "@/types/task";
import { useTaskStore } from "@/lib/task-store";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { maxAppWidth } from "@/constants";

export function TaskManager() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [maxWidth, setMaxWidth] = useState(maxAppWidth);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const { tasks, addTask } = useTaskStore();
  const router = useRouter();
  const searchParams = useSearchParams();

  const tagFilter = searchParams.get("tag");
  const mentionFilter = searchParams.get("mention");

  const hasFilter = tagFilter || mentionFilter;

  // Handle keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isInputActive =
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement;
      const searchInput = document.getElementById(
        "search-input"
      ) as HTMLInputElement;

      if (e.key === "n" && !isDialogOpen && !selectedTaskId && !isInputActive) {
        e.preventDefault();
        setIsDialogOpen(true);
        return;
      }

      if (e.key === "/" && !isDialogOpen && !selectedTaskId && !isInputActive) {
        e.preventDefault();
        searchInput?.focus();
        return;
      }

      if (e.key === "Escape") {
        e.preventDefault();
        searchInput?.blur();
        setIsDialogOpen(false);
        setSelectedTaskId(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isDialogOpen, selectedTaskId]);

  const handleAddTask = (task: Task) => {
    addTask(task);
    setIsDialogOpen(false);
  };

  const handleTaskClick = (taskId: string) => {
    setSelectedTaskId(taskId);
  };

  const handleClosePanel = () => {
    setSelectedTaskId(null);
  };

  const handleTagClick = (tag: string) => {
    handleClosePanel();
    router.push(`?tag=${encodeURIComponent(tag)}`);
  };

  const handleMentionClick = (mention: string) => {
    handleClosePanel();
    router.push(`?mention=${encodeURIComponent(mention)}`);
  };

  const clearFilters = () => {
    router.push("/");
  };

  // Filter tasks based on URL query parameters
  const filteredTasks = tasks.filter((task) => {
    if (tagFilter) {
      return task.hashtags.includes(tagFilter);
    }
    if (mentionFilter) {
      return task.mentions.includes(mentionFilter);
    }
    return true;
  });

  return (
    <div className="flex flex-col min-h-screen">
      <Header maxWidth={maxWidth} setMaxWidth={setMaxWidth} />
      <div
        className="flex-1 px-4 py-6 md:px-6"
        style={{ maxWidth: `${maxWidth}px`, margin: "0 auto", width: "100%" }}
      >
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
          <button
            onClick={() => setIsDialogOpen(true)}
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
          >
            New Task
          </button>
        </div>

        {hasFilter && (
          <div className="mb-6 flex items-center">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Filtered by:
              </span>
              {tagFilter && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  #{tagFilter}
                </Badge>
              )}
              {mentionFilter && (
                <Badge
                  variant="secondary"
                  className="flex items-center gap-1 bg-blue-500/10 text-blue-700 dark:text-blue-400"
                >
                  @{mentionFilter}
                </Badge>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="h-7 px-2"
              >
                <X className="h-4 w-4 mr-1" />
                Clear filter
              </Button>
            </div>
          </div>
        )}

        <TaskTable
          tasks={filteredTasks}
          onTaskClick={handleTaskClick}
          onTagClick={handleTagClick}
          onMentionClick={handleMentionClick}
        />
      </div>
      <NewTaskDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onAddTask={handleAddTask}
      />
      <TaskDetailPanel
        taskId={selectedTaskId}
        onClose={handleClosePanel}
        onTagClick={handleTagClick}
        onMentionClick={handleMentionClick}
      />
      {/* Overlay when panel is open on mobile */}
      {selectedTaskId && (
        <div
          className="sm:hidden fixed inset-0 bg-black/50 z-40"
          onClick={handleClosePanel}
        />
      )}
    </div>
  );
}
