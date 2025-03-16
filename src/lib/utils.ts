
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Utility function to merge Tailwind CSS classes safely
 * Combines clsx and twMerge to handle conditional classes and merge them efficiently
 * 
 * @param inputs - Array of class values, conditionals, or objects
 * @returns Merged and optimized Tailwind class string
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
