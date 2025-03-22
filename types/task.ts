export enum Priority {
  LOW,
  MEDIUM,
  HIGH,
}

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  hashtags: string[];
  mentions: string[];
  createdAt: string;
  completed: boolean;
}
