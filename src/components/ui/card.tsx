import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const cardVariants = cva("rounded-xl border text-card-foreground", {
  variants: {
    variant: {
      default: "border-border bg-card shadow-soft",
      elevated:
        "border-border bg-card shadow-soft transition-[transform,border-color,box-shadow] duration-200 hover:-translate-y-0.5 hover:border-border-strong hover:shadow-raised",
      glass:
        "border-black/5 bg-card/70 shadow-raised backdrop-blur-xl dark:border-white/10 dark:bg-card/60",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export interface CardProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof cardVariants> {}

export function Card({ className, variant, ...props }: CardProps) {
  return (
    <div className={cn(cardVariants({ variant }), className)} {...props} />
  );
}

export function CardHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return <div className={cn("space-y-1.5 p-5", className)} {...props} />;
}

export function CardTitle({
  className,
  ...props
}: React.ComponentProps<"h3">) {
  return (
    <h3
      className={cn("text-base font-semibold leading-none", className)}
      {...props}
    />
  );
}

export function CardDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p className={cn("text-sm text-muted-foreground", className)} {...props} />
  );
}

export function CardContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return <div className={cn("p-5 pt-0", className)} {...props} />;
}

export function CardFooter({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return <div className={cn("flex items-center p-5 pt-0", className)} {...props} />;
}
