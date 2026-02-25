import { InboxIcon } from "lucide-react";

export default function EmptyState({
  title = "No data found",
  description = "There's nothing here yet.",
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <InboxIcon className="h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="text-lg font-medium">{title}</h3>
      <p className="text-muted-foreground mt-1">{description}</p>
    </div>
  );
}
