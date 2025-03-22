"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import { Priority } from "@/types/task";
import { useTaskStore } from "@/lib/task-store";
import { X, Check, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { PrioritySelector } from "./priority-selector";

interface TaskDetailPanelProps {
  taskId: string | null;
  onClose: () => void;
  onTagClick: (tag: string) => void;
  onMentionClick: (mention: string) => void;
}

const priorityColors = {
  [Priority.LOW]: "bg-green-500/20 text-green-700 dark:text-green-400",
  [Priority.MEDIUM]: "bg-yellow-500/20 text-yellow-700 dark:text-yellow-400",
  [Priority.HIGH]: "bg-red-500/20 text-red-700 dark:text-red-400",
};

export function TaskDetailPanel({
  taskId,
  onClose,
  onTagClick,
  onMentionClick,
}: TaskDetailPanelProps) {
  const { tasks, updateTask, deleteTask } = useTaskStore();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Priority>(Priority.MEDIUM);
  const [tagsInput, setTagsInput] = useState("");
  const [mentionsInput, setMentionsInput] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Track the last detected tags and mentions to avoid duplicates
  const lastDetectedTags = useRef<Set<string>>(new Set());
  const lastDetectedMentions = useRef<Set<string>>(new Set());

  // Get the current task
  const task = taskId ? tasks.find((t) => t.id === taskId) : null;

  // Initialize form with task data when task changes
  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setPriority(task.priority);
      setTagsInput(task.hashtags.join(", "));
      setMentionsInput(task.mentions.join(", "));

      // Reset detected tags and mentions
      lastDetectedTags.current = new Set(task.hashtags);
      lastDetectedMentions.current = new Set(task.mentions);
    }
  }, [task]);

  // Handle escape key to close panel
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsEditing(false);
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleSave = () => {
    if (!task) return;

    // Parse hashtags and mentions
    const hashtags = tagsInput
      .split(/[,]+/)
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0)
      .map((tag) => (tag.startsWith("#") ? tag.substring(1) : tag));

    const mentions = mentionsInput
      .split(/[,]+/)
      .map((mention) => mention.trim())
      .filter((mention) => mention.length > 0)
      .map((mention) =>
        mention.startsWith("@") ? mention.substring(1) : mention
      );

    updateTask(task.id, {
      title,
      description,
      priority,
      hashtags,
      mentions,
    });

    setIsEditing(false);
  };

  const toggleTaskCompletion = () => {
    if (!task) return;
    updateTask(task.id, {
      completed: !task.completed,
      completedAt: task.completed ? undefined : new Date().toISOString(),
    });
  };

  const handleDeleteTask = () => {
    if (!task) return;
    deleteTask(task.id);
    setIsEditing(false);
    onClose();
    setIsDeleteDialogOpen(false);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
  };

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const newDescription = e.target.value;
    setDescription(newDescription);
  };

  return (
    <>
      <div
        className={cn(
          "fixed inset-y-0 right-0 z-50 w-full sm:w-1/2 lg:w-2/5 bg-background border-l shadow-lg transform transition-transform duration-300 ease-in-out",
          taskId ? "translate-x-0" : "translate-x-full"
        )}
      >
        {task && (
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-xl font-semibold">Task Details</h2>
              <div className="flex items-center gap-2">
                {isEditing ? (
                  <Button onClick={handleSave} variant="default" size="sm">
                    Save
                  </Button>
                ) : (
                  <Button
                    onClick={() => setIsEditing(true)}
                    variant="outline"
                    size="sm"
                  >
                    Edit
                  </Button>
                )}
                <Button
                  onClick={() => {
                    setIsEditing(false);
                    onClose();
                  }}
                  variant="ghost"
                  size="icon"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <Label className="mb-1" htmlFor="edit-title">
                      Title
                    </Label>
                    <Input
                      id="edit-title"
                      value={title}
                      onChange={handleTitleChange}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Use # for tags and @ for mentions
                    </p>
                  </div>

                  <div>
                    <Label className="mb-1" htmlFor="edit-description">
                      Description
                    </Label>
                    <Textarea
                      id="edit-description"
                      value={description}
                      onChange={handleDescriptionChange}
                      rows={5}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Use # for tags and @ for mentions
                    </p>
                  </div>

                  <div>
                    <Label className="mb-1" htmlFor="edit-priority">
                      Priority
                    </Label>
                    <PrioritySelector value={priority} onChange={setPriority} />
                  </div>

                  <div>
                    <Label className="mb-1" htmlFor="edit-hashtags">
                      Hashtags
                    </Label>
                    <Input
                      id="edit-hashtags"
                      value={tagsInput}
                      onChange={(e) => setTagsInput(e.target.value)}
                      placeholder="e.g. work, project, meeting (comma separated)"
                    />
                  </div>

                  <div>
                    <Label className="mb-1" htmlFor="edit-mentions">
                      Mentions
                    </Label>
                    <Input
                      id="edit-mentions"
                      value={mentionsInput}
                      onChange={(e) => setMentionsInput(e.target.value)}
                      placeholder="e.g. john, sarah (comma separated)"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h3
                      className={cn(
                        "text-2xl font-medium",
                        task.completed && "line-through text-muted-foreground"
                      )}
                    >
                      {task.title}
                    </h3>
                    <Badge className={priorityColors[task.priority]}>
                      {Priority[task.priority]}
                    </Badge>
                    {task.completed && (
                      <Badge
                        variant="outline"
                        className="ml-2 bg-gray-100 dark:bg-gray-800"
                      >
                        Completed
                      </Badge>
                    )}
                  </div>

                  <Separator />

                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">
                      Description
                    </h4>
                    <p className="whitespace-pre-line">
                      {task.description || "No description provided."}
                    </p>
                  </div>

                  {(task.hashtags.length > 0 || task.mentions.length > 0) && (
                    <Separator />
                  )}

                  {task.hashtags.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-2">
                        Tags
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {task.hashtags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="cursor-pointer hover:bg-muted"
                            onClick={() => onTagClick(tag)}
                          >
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {task.mentions.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-2">
                        Mentions
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {task.mentions.map((mention) => (
                          <Badge
                            key={mention}
                            variant="outline"
                            className="bg-blue-500/10 text-blue-700 dark:text-blue-400 cursor-pointer hover:bg-blue-500/20"
                            onClick={() => onMentionClick(mention)}
                          >
                            @{mention}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <Separator />

                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">
                      Created
                    </h4>
                    <p>
                      {new Date(task.createdAt).toLocaleString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "numeric",
                        minute: "numeric",
                        localeMatcher: "best fit",
                      })}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">
                      Stats
                    </h4>
                    <pre className="overflow-y-auto bg-muted p-2 rounded-md">
                      {JSON.stringify(task, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t">
              <div className="flex flex-col gap-2">
                <Button
                  onClick={toggleTaskCompletion}
                  variant={task.completed ? "outline" : "default"}
                  className="w-full"
                >
                  {task.completed ? (
                    <>Mark as Incomplete</>
                  ) : (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Mark as Complete
                    </>
                  )}
                </Button>

                <Button
                  onClick={() => setIsDeleteDialogOpen(true)}
                  variant="destructive"
                  className="w-full"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Task
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              task.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteTask}
              className="bg-destructive text-destructive-foreground"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
