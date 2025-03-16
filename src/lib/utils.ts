
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

/**
 * Format a number for display with K/M/B suffixes for thousands/millions/billions
 * 
 * @param num - Number to format
 * @param digits - Number of decimal places to show (default: 1)
 * @returns Formatted string
 */
export function formatNumber(num: number, digits = 1) {
  const lookup = [
    { value: 1, symbol: "" },
    { value: 1e3, symbol: "K" },
    { value: 1e6, symbol: "M" },
    { value: 1e9, symbol: "B" }
  ];
  
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  const item = lookup
    .slice()
    .reverse()
    .find(function(item) {
      return num >= item.value;
    });
    
  return item 
    ? (num / item.value).toFixed(digits).replace(rx, "$1") + item.symbol 
    : "0";
}
