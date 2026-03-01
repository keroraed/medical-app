import { useCallback, useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";
import { cn } from "@/lib/utils";

const TYPING_DEBOUNCE_MS = 1500;

/**
 * @param {{
 *   onSend: (content: string) => void,
 *   onTypingStart: () => void,
 *   onTypingStop: () => void,
 *   disabled?: boolean,
 * }} props
 */
export default function ChatInput({
  onSend,
  onTypingStart,
  onTypingStop,
  disabled = false,
}) {
  const [value, setValue] = useState("");
  const typingTimerRef = useRef(null);
  const isTypingRef = useRef(false);

  // Clear the debounce timer on unmount
  useEffect(() => {
    return () => clearTimeout(typingTimerRef.current);
  }, []);

  const stopTyping = useCallback(() => {
    if (isTypingRef.current) {
      isTypingRef.current = false;
      onTypingStop?.();
    }
  }, [onTypingStop]);

  const handleChange = (e) => {
    setValue(e.target.value);

    if (!isTypingRef.current) {
      isTypingRef.current = true;
      onTypingStart?.();
    }

    // Reset the debounce timer
    clearTimeout(typingTimerRef.current);
    typingTimerRef.current = setTimeout(stopTyping, TYPING_DEBOUNCE_MS);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed || disabled) return;

    stopTyping();
    clearTimeout(typingTimerRef.current);
    onSend(trimmed);
    setValue("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      handleSubmit(e);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-end gap-2 p-3 border-t bg-background"
    >
      <textarea
        rows={1}
        placeholder="Type a message…"
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        className={cn(
          "flex-1 resize-none rounded-xl border border-input bg-background px-3 py-2",
          "text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-ring",
          "max-h-32 overflow-y-auto",
        )}
      />
      <button
        type="submit"
        disabled={!value.trim() || disabled}
        className={cn(
          "shrink-0 h-9 w-9 rounded-full flex items-center justify-center",
          "bg-primary text-primary-foreground transition-opacity",
          (!value.trim() || disabled) && "opacity-40 cursor-not-allowed",
        )}
        aria-label="Send message"
      >
        <Send className="h-4 w-4" />
      </button>
    </form>
  );
}
