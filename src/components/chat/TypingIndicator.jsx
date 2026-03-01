export default function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-3 py-2 text-muted-foreground text-sm">
      <span className="inline-flex items-center gap-0.5">
        <span
          className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce"
          style={{ animationDelay: "0ms" }}
        />
        <span
          className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce"
          style={{ animationDelay: "150ms" }}
        />
        <span
          className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce"
          style={{ animationDelay: "300ms" }}
        />
      </span>
      <span className="ml-1">typing…</span>
    </div>
  );
}
