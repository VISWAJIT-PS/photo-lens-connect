import { User } from "@/types"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function FullName(user: User){
  return `${user.user_metadata.first_name} ${user.user_metadata.last_name}`
}
