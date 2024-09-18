import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export function chatHrefConstructor(id1: string, id2: string) {
  const sortedIds = [id1, id2].sort()
  return `${sortedIds[0]}--${sortedIds[1]}`
}
export function toPusherKey(key: string) {
  return key.replace(/:/g, '__')
}

export const formatTimestamp=(timestamp: number): string => {
  const date = new Date(timestamp);
  const hours = date.getHours().toString().padStart(2, "0"); 
  const minutes = date.getMinutes().toString().padStart(2, "0"); 

  return `${hours}:${minutes}`;
}
