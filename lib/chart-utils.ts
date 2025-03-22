import { type Task, Priority } from "@/types/task";

// Format date for charts
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return `${date.getMonth() + 1}/${date.getDate()}`;
}

// Get time difference in hours between two dates
export function getHoursBetween(startDate: string, endDate: string): number {
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();
  return Math.round((end - start) / (1000 * 60 * 60));
}

// Get time difference in days between two dates
export function getDaysBetween(startDate: string, endDate: string): number {
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();
  return Math.round((end - start) / (1000 * 60 * 60 * 24));
}

// Group tasks by date
export function groupTasksByDate(tasks: Task[]): Record<string, number> {
  const grouped: Record<string, number> = {};

  tasks.forEach((task) => {
    const date = formatDate(task.createdAt);
    grouped[date] = (grouped[date] || 0) + 1;
  });

  return grouped;
}

// Group completed tasks by date
export function groupCompletedTasksByDate(
  tasks: Task[]
): Record<string, number> {
  const grouped: Record<string, number> = {};

  tasks.forEach((task) => {
    if (task.completed && task.completedAt) {
      const date = formatDate(task.completedAt);
      grouped[date] = (grouped[date] || 0) + 1;
    }
  });

  return grouped;
}

// Count tasks by priority
export function countTasksByPriority(tasks: Task[]): Record<string, number> {
  const counts = {
    Low: 0,
    Medium: 0,
    High: 0,
  };

  tasks.forEach((task) => {
    if (task.priority === Priority.LOW) counts["Low"]++;
    else if (task.priority === Priority.MEDIUM) counts["Medium"]++;
    else if (task.priority === Priority.HIGH) counts["High"]++;
  });

  return counts;
}

// Count completed tasks by priority
export function countCompletedTasksByPriority(
  tasks: Task[]
): Record<string, number> {
  const counts = {
    Low: 0,
    Medium: 0,
    High: 0,
  };

  tasks.forEach((task) => {
    if (task.completed) {
      if (task.priority === Priority.LOW) counts["Low"]++;
      else if (task.priority === Priority.MEDIUM) counts["Medium"]++;
      else if (task.priority === Priority.HIGH) counts["High"]++;
    }
  });

  return counts;
}

// Get average completion time by priority
export function getAvgCompletionTimeByPriority(
  tasks: Task[]
): Record<string, number> {
  const totals = {
    Low: 0,
    Medium: 0,
    High: 0,
  };

  const counts = {
    Low: 0,
    Medium: 0,
    High: 0,
  };

  tasks.forEach((task) => {
    if (task.completed && task.completedAt) {
      const hours = getHoursBetween(task.createdAt, task.completedAt);

      if (task.priority === Priority.LOW) {
        totals["Low"] += hours;
        counts["Low"]++;
      } else if (task.priority === Priority.MEDIUM) {
        totals["Medium"] += hours;
        counts["Medium"]++;
      } else if (task.priority === Priority.HIGH) {
        totals["High"] += hours;
        counts["High"]++;
      }
    }
  });

  return {
    Low: counts["Low"] ? Math.round(totals["Low"] / counts["Low"]) : 0,
    Medium: counts["Medium"]
      ? Math.round(totals["Medium"] / counts["Medium"])
      : 0,
    High: counts["High"] ? Math.round(totals["High"] / counts["High"]) : 0,
  };
}

// Count frequency of tags
export function countTagsFrequency(
  tasks: Task[]
): { name: string; count: number }[] {
  const counts: Record<string, number> = {};

  tasks.forEach((task) => {
    task.hashtags.forEach((tag) => {
      counts[tag] = (counts[tag] || 0) + 1;
    });
  });

  return Object.entries(counts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10); // Top 10 tags
}

// Count frequency of mentions
export function countMentionsFrequency(
  tasks: Task[]
): { name: string; count: number }[] {
  const counts: Record<string, number> = {};

  tasks.forEach((task) => {
    task.mentions.forEach((mention) => {
      counts[mention] = (counts[mention] || 0) + 1;
    });
  });

  return Object.entries(counts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10); // Top 10 mentions
}
