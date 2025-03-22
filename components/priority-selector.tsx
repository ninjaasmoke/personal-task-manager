"use client";

import { Priority } from "@/types/task";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PrioritySelectorProps {
  value: Priority;
  onChange: (priority: Priority) => void;
  className?: string;
}

export function PrioritySelector({
  value,
  onChange,
  className,
}: PrioritySelectorProps) {
  const priorityColors = {
    [Priority.LOW]:
      "bg-green-500/20 text-green-700 dark:text-green-400 hover:bg-green-500/30",
    [Priority.MEDIUM]:
      "bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 hover:bg-yellow-500/30",
    [Priority.HIGH]:
      "bg-red-500/20 text-red-700 dark:text-red-400 hover:bg-red-500/30",
  };

  const selectedStyles = {
    [Priority.LOW]: "ring-2 ring-green-500 dark:ring-green-400",
    [Priority.MEDIUM]: "ring-2 ring-yellow-500 dark:ring-yellow-400",
    [Priority.HIGH]: "ring-2 ring-red-500 dark:ring-red-400",
  };

  return (
    <div className={cn("flex gap-2", className)}>
      {[Priority.LOW, Priority.MEDIUM, Priority.HIGH].map((priority) => (
        <Button
          key={priority}
          type="button"
          variant="outline"
          className={cn(
            "flex-1 font-normal transition-all",
            priorityColors[priority],
            value === priority && selectedStyles[priority]
          )}
          onClick={() => onChange(priority)}
        >
          {Priority[priority]}
        </Button>
      ))}
    </div>
  );
}
