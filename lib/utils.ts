import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function dateStringToFriendly(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();

  const diffInMilliseconds = now.getTime() - date.getTime();
  const diffInHours = Math.floor(diffInMilliseconds / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));

  // For dates from today, show hours
  if (diffInDays === 0) {
    if (diffInHours === 0) {
      return "just now";
    } else if (diffInHours === 1) {
      return "1 hour ago";
    } else {
      return `${diffInHours} hours ago`;
    }
  } else if (diffInDays === 1) {
    return "yesterday";
  } else if (diffInDays < 7) {
    return `${diffInDays} days ago`;
  } else if (diffInDays < 30) {
    const diffInWeeks = Math.floor(diffInDays / 7);
    return diffInWeeks === 1 ? "last week" : `${diffInWeeks} weeks ago`;
  } else if (diffInDays < 365) {
    const diffInMonths = Math.floor(diffInDays / 30);
    return diffInMonths === 1 ? "last month" : `${diffInMonths} months ago`;
  } else {
    const diffInYears = Math.floor(diffInDays / 365);
    return diffInYears === 1 ? "last year" : `${diffInYears} years ago`;
  }
}
