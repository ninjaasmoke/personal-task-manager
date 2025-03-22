"use client";

import type React from "react";

import { useState, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { type Task, Priority } from "@/types/task";
import { PrioritySelector } from "./priority-selector";

interface NewTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddTask: (task: Task) => void;
}

export function NewTaskDialog({
  open,
  onOpenChange,
  onAddTask,
}: NewTaskDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Priority>(Priority.MEDIUM);
  const [tagsInput, setTagsInput] = useState("");
  const [mentionsInput, setMentionsInput] = useState("");

  // Track the last detected tags and mentions to avoid duplicates
  const lastDetectedTags = useRef<Set<string>>(new Set());
  const lastDetectedMentions = useRef<Set<string>>(new Set());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Helper function to extract tags or mentions from text
    const extractItems = (text: string, prefix: string) => {
      return text
        .split(/[,]+/)
        .filter((word) => word.startsWith(prefix))
        .map((item) => item.substring(prefix.length));
    };

    // Extract tags and mentions from both title and description
    const titleTags = extractItems(title, "#");
    const titleMentions = extractItems(title, "@");
    const descriptionTags = extractItems(description, "#");
    const descriptionMentions = extractItems(description, "@");

    // Helper function to normalize input that may contain prefixes
    const normalizeInput = (input: string, prefix: string) => {
      return input
        .split(/[,]+/)
        .map((item) => item.trim())
        .filter((item) => item.length > 0)
        .map((item) =>
          item.startsWith(prefix) ? item.substring(prefix.length) : item
        );
    };

    // Process hashtags and mentions inputs
    const inputTags = normalizeInput(tagsInput, "#");
    const inputMentions = normalizeInput(mentionsInput, "@");

    // Combine and deduplicate all tags and mentions
    const hashtags = [...inputTags, ...titleTags, ...descriptionTags].filter(
      (tag) => !lastDetectedTags.current.has(tag)
    );

    const mentions = [
      ...inputMentions,
      ...titleMentions,
      ...descriptionMentions,
    ].filter((mention) => !lastDetectedMentions.current.has(mention));

    const newTask: Task = {
      id: uuidv4(),
      title,
      description,
      priority,
      hashtags,
      mentions,
      createdAt: new Date().toISOString(),
      completed: false,
    };

    onAddTask(newTask);
    resetForm();
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setPriority(Priority.MEDIUM);
    setTagsInput("");
    setMentionsInput("");
    lastDetectedTags.current.clear();
    lastDetectedMentions.current.clear();
  };

  const handleDialogClose = (open: boolean) => {
    if (!open) {
      resetForm();
    }
    onOpenChange(open);
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
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Task</DialogTitle>
            <DialogDescription>
              Add a new task to your list. Press Enter to submit.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={handleTitleChange}
                placeholder="Task title"
                required
              />
              <p className="text-xs text-muted-foreground">
                Use # for tags and @ for mentions
              </p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={handleDescriptionChange}
                placeholder="Task description"
                rows={3}
              />
              <p className="text-xs text-muted-foreground">
                Use # for tags and @ for mentions
              </p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="priority">Priority</Label>
              <PrioritySelector value={priority} onChange={setPriority} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="hashtags">Hashtags</Label>
              <Input
                id="hashtags"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="e.g. work, project, meeting (comma separated)"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="mentions">Mentions</Label>
              <Input
                id="mentions"
                value={mentionsInput}
                onChange={(e) => setMentionsInput(e.target.value)}
                placeholder="e.g. john, sarah (comma separated)"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={!title.trim()}>
              Create Task
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
