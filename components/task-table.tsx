"use client";

import type React from "react";

import { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Filter, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { type Task, Priority } from "@/types/task";
import { useTaskStore } from "@/lib/task-store";
import { cn } from "@/lib/utils";

interface TaskTableProps {
  tasks: Task[];
  onTaskClick: (taskId: string) => void;
  onTagClick: (tag: string) => void;
  onMentionClick: (mention: string) => void;
}

type SortField = "title" | "priority" | "createdAt";
type SortDirection = "asc" | "desc";
type CompletionFilter = "all" | "completed" | "active";

const priorityColors = {
  [Priority.LOW]: "bg-green-500/20 text-green-700 dark:text-green-400",
  [Priority.MEDIUM]: "bg-yellow-500/20 text-yellow-700 dark:text-yellow-400",
  [Priority.HIGH]: "bg-red-500/20 text-red-700 dark:text-red-400",
};

export function TaskTable({
  tasks,
  onTaskClick,
  onTagClick,
  onMentionClick,
}: TaskTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<SortField>("priority");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [priorityFilter, setPriorityFilter] = useState<Priority | null>(null);
  const [completionFilter, setCompletionFilter] =
    useState<CompletionFilter>("all");
  const { updateTask } = useTaskStore();

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const toggleTaskCompletion = (
    e: React.MouseEvent,
    taskId: string,
    completed: boolean
  ) => {
    e.stopPropagation(); // Prevent row click from firing
    updateTask(taskId, { completed: !completed });
  };

  const handleTagClick = (e: React.MouseEvent, tag: string) => {
    e.stopPropagation(); // Prevent row click from firing
    onTagClick(tag);
  };

  const handleMentionClick = (e: React.MouseEvent, mention: string) => {
    e.stopPropagation(); // Prevent row click from firing
    onMentionClick(mention);
  };

  const filteredAndSortedTasks = useMemo(() => {
    return tasks
      .filter((task) => {
        // Filter by search query
        const matchesSearch =
          task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          task.hashtags.some((tag) =>
            tag.toLowerCase().includes(searchQuery.toLowerCase())
          ) ||
          task.mentions.some((mention) =>
            mention.toLowerCase().includes(searchQuery.toLowerCase())
          );

        // Filter by priority
        const matchesPriority =
          priorityFilter === null || task.priority === priorityFilter;

        // Filter by completion status
        const matchesCompletion =
          completionFilter === "all" ||
          (completionFilter === "completed" && task.completed) ||
          (completionFilter === "active" && !task.completed);

        return matchesSearch && matchesPriority && matchesCompletion;
      })
      .sort((a, b) => {
        // First sort by completion status
        if (a.completed !== b.completed) {
          return a.completed ? 1 : -1; // Completed tasks go to the bottom
        }

        // Then sort by the selected field
        let comparison = 0;

        if (sortField === "title") {
          comparison = a.title.localeCompare(b.title);
        } else if (sortField === "priority") {
          comparison = a.priority - b.priority;
        } else if (sortField === "createdAt") {
          comparison =
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        }

        return sortDirection === "asc" ? comparison : -comparison;
      });
  }, [
    tasks,
    searchQuery,
    sortField,
    sortDirection,
    priorityFilter,
    completionFilter,
  ]);

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return null;
    return sortDirection === "asc" ? (
      <ChevronUp className="ml-2 h-4 w-4" />
    ) : (
      <ChevronDown className="ml-2 h-4 w-4" />
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Input
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
        <div className="flex flex-wrap gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Status
                {completionFilter !== "all" && (
                  <Badge variant="secondary" className="ml-2">
                    {completionFilter === "completed" ? "Completed" : "Active"}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setCompletionFilter("all")}>
                All Tasks
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setCompletionFilter("active")}>
                Active Tasks
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setCompletionFilter("completed")}
              >
                Completed Tasks
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Priority
                {priorityFilter !== null && (
                  <Badge variant="secondary" className="ml-2">
                    {Priority[priorityFilter]}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setPriorityFilter(null)}>
                All Priorities
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setPriorityFilter(Priority.LOW)}>
                Low Priority
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setPriorityFilter(Priority.MEDIUM)}
              >
                Medium Priority
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setPriorityFilter(Priority.HIGH)}
              >
                High Priority
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12"></TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("title")}
              >
                <div className="flex items-center">
                  Title
                  {getSortIcon("title")}
                </div>
              </TableHead>
              <TableHead>Description</TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("priority")}
              >
                <div className="flex items-center">
                  Priority
                  {getSortIcon("priority")}
                </div>
              </TableHead>
              <TableHead>Tags</TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("createdAt")}
              >
                <div className="flex items-center">
                  Created
                  {getSortIcon("createdAt")}
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedTasks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No tasks yet.
                </TableCell>
              </TableRow>
            ) : (
              filteredAndSortedTasks.map((task) => (
                <TableRow
                  key={task.id}
                  onClick={() => onTaskClick(task.id)}
                  className={cn(
                    "cursor-pointer hover:bg-muted/50",
                    task.completed && "bg-muted/30 text-muted-foreground"
                  )}
                >
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={(e) =>
                        toggleTaskCompletion(e, task.id, task.completed)
                      }
                    >
                      <div
                        className={cn(
                          "h-5 w-5 rounded-full border-2",
                          task.completed
                            ? "bg-primary border-primary flex items-center justify-center"
                            : "border-muted-foreground"
                        )}
                      >
                        {task.completed && (
                          <Check className="h-3 w-3 text-primary-foreground" />
                        )}
                      </div>
                    </Button>
                  </TableCell>
                  <TableCell
                    className={cn(
                      "font-medium",
                      task.completed && "line-through"
                    )}
                  >
                    {task.title}
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {task.description}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={cn(
                        priorityColors[task.priority],
                        task.completed && "opacity-60"
                      )}
                    >
                      {Priority[task.priority]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {task.hashtags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="outline"
                          className={cn(
                            "text-xs cursor-pointer hover:bg-muted",
                            task.completed && "opacity-60"
                          )}
                          onClick={(e) => handleTagClick(e, tag)}
                        >
                          #{tag}
                        </Badge>
                      ))}
                      {task.mentions.map((mention) => (
                        <Badge
                          key={mention}
                          variant="outline"
                          className={cn(
                            "text-xs bg-blue-500/10 text-blue-700 dark:text-blue-400 cursor-pointer hover:bg-blue-500/20",
                            task.completed && "opacity-60"
                          )}
                          onClick={(e) => handleMentionClick(e, mention)}
                        >
                          @{mention}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(task.createdAt).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
