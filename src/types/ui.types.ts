import { badgeVariants } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { toggleVariants } from "@/components/ui/toggle";
import { type VariantProps } from "class-variance-authority";
import type React from "react";

// Base React types
export type ReactNode = React.ReactNode;

// Form types (from react-hook-form)
export type FieldValues = Record<string, unknown>;
export type FieldPath<T> = string & keyof T;

// Button types
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {}

// Badge types
export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

// Form types
export interface FormFieldContextValue<TFieldValues = FieldValues, TName extends string = string> {
  name: TName;
}

export interface FormItemContextValue {
  id: string;
}

// Toast types
export type ToastProps = React.HTMLAttributes<HTMLDivElement>;
export type ToastActionElement = React.ReactElement;

export interface ToasterToast extends Omit<ToastProps, 'title'> {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
  dismissible?: boolean;
  onDismiss?: (toast: ToasterToast) => void;
}

// Calendar types
export type CalendarProps = React.ComponentProps<'div'> & {
  selected?: Date;
  onSelect?: (date: Date | undefined) => void;
  mode?: 'single' | 'multiple' | 'range';
  disabled?: boolean | ((date: Date) => boolean);
};

// Carousel types
export type CarouselApi = {
  scrollNext: () => void;
  scrollPrev: () => void;
  scrollTo: (index: number) => void;
  selectedScrollSnap: () => number;
  on: (event: string, callback: (api: CarouselApi) => void) => void;
};
export type UseCarouselParameters = [{
  loop?: boolean;
  align?: 'start' | 'center' | 'end';
  skipSnaps?: boolean;
  slidesToScroll?: number;
}];
export type CarouselOptions = UseCarouselParameters[0];
export type CarouselPlugin = (api: CarouselApi) => void;

export interface CarouselProps {
  opts?: CarouselOptions;
  plugins?: CarouselPlugin[];
  orientation?: "horizontal" | "vertical";
  setApi?: (api: CarouselApi) => void;
}

// Chart types
export type ChartConfig = {
  [k in string]: {
    label?: React.ReactNode;
    color?: string;
    icon?: React.ComponentType;
  };
};

// Sidebar types
export interface SidebarContext {
  state: "expanded" | "collapsed";
  open: boolean;
  setOpen: (open: boolean) => void;
  openMobile: boolean;
  setOpenMobile: (open: boolean) => void;
  isMobile: boolean;
  toggleSidebar: () => void;
}

// Toggle types
export interface ToggleProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof toggleVariants> {}

// Input types
export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

// Sheet types
export type SheetContentProps = React.HTMLAttributes<HTMLDivElement>;

// Pagination types
export interface PaginationLinkProps {
  isActive?: boolean;
  size?: "default" | "sm" | "icon";
}