import { FileCode } from "lucide-react";

export const EmptyState = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center h-full bg-surface-card border border-outline rounded-xl p-8 text-center shadow-sm">
      <FileCode className="size-12 text-on-surface-variant/40 mb-3" />
      <h4 className="text-base font-medium text-on-surface mb-1">
        No Document Selected
      </h4>
      <p className="text-xs text-on-surface-variant max-w-xs">
        Choose a document from the explorer on the left to start editing or
        reading.
      </p>
    </div>
  );
};