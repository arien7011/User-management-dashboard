// src/components/ui/Button.tsx
"use client";

import { cn } from "@/utils/cn";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger";
};

export default function Button({ variant = "primary", className, ...props }: Props) {
  const base =
    "px-5 py-2 rounded-md text-sm font-medium transition-all duration-300 ease-in-out transform";

  const variants = {
    primary:
      "bg-blue-600 text-white hover:bg-blue-700 hover:scale-105 active:scale-95 shadow hover:shadow-lg",
    secondary:
      "bg-neutral-200 text-neutral-800 hover:bg-neutral-300 hover:scale-105 active:scale-95 shadow hover:shadow-md",
    danger:
      "bg-red-600 text-white hover:bg-red-700 hover:scale-105 active:scale-95 shadow hover:shadow-lg",
  };

  return <button className={cn(base, variants[variant], className)} {...props} />;
}
