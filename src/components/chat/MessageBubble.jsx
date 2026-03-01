import { cn } from "@/lib/utils";
import { Check, CheckCheck } from "lucide-react";
import { format, parseISO } from "date-fns";

/**
 * @param {{ message: object, isMine: boolean }} props
 */
export default function MessageBubble({ message, isMine }) {
  const time =
    message.createdAt
      ? format(parseISO(message.createdAt), "HH:mm")
      : "";

  return (
    <div
      className={cn(
        "flex flex-col max-w-[75%] gap-1",
        isMine ? "self-end items-end" : "self-start items-start",
      )}
    >
      <div
        className={cn(
          "px-4 py-2 rounded-2xl text-sm leading-relaxed break-words",
          isMine
            ? "bg-primary text-primary-foreground rounded-br-none"
            : "bg-accent text-accent-foreground rounded-bl-none",
          message.pending && "opacity-60",
        )}
      >
        {message.content}
      </div>

      <div className="flex items-center gap-1 text-[11px] text-muted-foreground px-1">
        <span>{time}</span>
        {isMine && (
          message.isRead ? (
            <CheckCheck className="h-3.5 w-3.5 text-primary" />
          ) : (
            <Check className="h-3.5 w-3.5" />
          )
        )}
      </div>
    </div>
  );
}
