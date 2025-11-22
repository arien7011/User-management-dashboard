import { type ClassValue } from "clsx";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * cn: Combine conditional class names, then resolve Tailwind conflicts.
 * Example: cn("px-2 py-2", isActive && "bg-blue-600", "px-4") -> "py-2 bg-blue-600 px-4"
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
