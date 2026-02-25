import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Pagination({ pagination, onPageChange }) {
  if (!pagination || pagination.totalPages <= 1) return null;

  const { page, totalPages, hasNextPage, hasPrevPage } = pagination;

  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={!hasPrevPage}
        className={cn(
          "flex items-center gap-1 px-3 py-2 text-sm rounded-md border",
          hasPrevPage
            ? "hover:bg-accent cursor-pointer"
            : "opacity-50 cursor-not-allowed",
        )}
      >
        <ChevronLeft className="h-4 w-4" />
        Previous
      </button>

      <div className="flex items-center gap-1">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={cn(
              "px-3 py-2 text-sm rounded-md",
              p === page
                ? "bg-primary text-primary-foreground"
                : "border hover:bg-accent cursor-pointer",
            )}
          >
            {p}
          </button>
        ))}
      </div>

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={!hasNextPage}
        className={cn(
          "flex items-center gap-1 px-3 py-2 text-sm rounded-md border",
          hasNextPage
            ? "hover:bg-accent cursor-pointer"
            : "opacity-50 cursor-not-allowed",
        )}
      >
        Next
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
