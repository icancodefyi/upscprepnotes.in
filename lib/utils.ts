import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const PREVIEW_SLUGS = new Set([
  "ishita-kishore", "garima-lohia", "harshita-goyal",
  "uma-harathi", "divya-tanwar", "ayan-jain",
  "shivani-ettaboyina", "vaishali-chopra",
]);

export function topperImageSrc(topper: { slug?: string; ProfileImage?: string; firstName: string; lastName: string }): string {
  const img = topper.ProfileImage;
  if (img && (img.startsWith("data:image") || img.startsWith("http://") || img.startsWith("https://"))) {
    return img;
  }
  if (topper.slug && PREVIEW_SLUGS.has(topper.slug)) {
    return `/previews/${topper.slug}.png`;
  }
  return `https://api.dicebear.com/9.x/notionists/svg?seed=${topper.firstName}-${topper.lastName}`;
}
