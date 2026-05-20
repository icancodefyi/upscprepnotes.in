import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function topperImageSrc(topper: { ProfileImage?: string; firstName: string; lastName: string }): string {
  const img = topper.ProfileImage;
  if (img && (img.startsWith("data:image") || img.startsWith("http://") || img.startsWith("https://"))) {
    return img;
  }
  return `https://api.dicebear.com/9.x/notionists/svg?seed=${topper.firstName}-${topper.lastName}`;
}
