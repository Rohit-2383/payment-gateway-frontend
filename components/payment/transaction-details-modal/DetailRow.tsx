import * as React from "react";

interface DetailRowProps {
  label: string;
  children: React.ReactNode;
}

export function DetailRow({ label, children }: DetailRowProps) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5 border-b border-gray-100 last:border-b-0">
      <span className="text-sm text-muted-foreground font-medium shrink-0">{label}</span>
      <span className="text-sm text-foreground text-right">{children}</span>
    </div>
  );
}
