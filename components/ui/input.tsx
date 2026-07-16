import * as React from "react";
import { cn } from "@/lib/utils";

function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "flex h-12 w-full rounded-full border border-gold/40 bg-white px-5 text-base text-ink shadow-sm placeholder:text-clay focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-gold",
        className
      )}
      {...props}
    />
  );
}

export { Input };
