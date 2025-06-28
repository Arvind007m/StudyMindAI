import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  const d = new Date(date);
  const now = new Date();
  const diffInMs = now.getTime() - d.getTime();
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInHours < 1) {
    return "Just now";
  } else if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  } else if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  } else {
    return d.toLocaleDateString();
  }
}

export function formatAccuracy(correct: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((correct / total) * 100);
}

export function getSubjectColor(subject: string): string {
  const colors = {
    Biology: "green",
    Chemistry: "purple", 
    Physics: "blue",
    Mathematics: "orange",
    Math: "orange",
    default: "blue"
  };
  return colors[subject as keyof typeof colors] || colors.default;
}

export function getFileTypeIcon(fileType: string): string {
  const icons = {
    pdf: "fas fa-file-pdf",
    image: "fas fa-image",
    text: "fas fa-file-alt",
    video: "fas fa-video",
    default: "fas fa-file"
  };
  return icons[fileType as keyof typeof icons] || icons.default;
}
