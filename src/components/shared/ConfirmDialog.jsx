import { AlertTriangle } from "lucide-react";

/**
 * Accessible confirmation dialog — replaces native window.confirm().
 *
 * Usage:
 *   const [confirmState, setConfirmState] = useState(null);
 *
 *   <ConfirmDialog
 *     isOpen={!!confirmState}
 *     title="Delete specialty?"
 *     description="This action cannot be undone."
 *     onConfirm={() => { doSomething(); setConfirmState(null); }}
 *     onCancel={() => setConfirmState(null)}
 *     variant="danger"
 *     confirmLabel="Delete"
 *   />
 */
export default function ConfirmDialog({
  isOpen,
  title = "Are you sure?",
  description,
  onConfirm,
  onCancel,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "danger",
}) {
  if (!isOpen) return null;

  const confirmCls =
    variant === "danger"
      ? "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500"
      : "bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-primary";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
      aria-describedby={description ? "confirm-dialog-desc" : undefined}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onCancel}
        aria-hidden="true"
      />

      {/* Panel */}
      <div className="relative z-10 w-full max-w-sm bg-card rounded-xl shadow-xl border p-6">
        <div className="flex items-start gap-4 mb-4">
          <div className="p-2 bg-red-100 rounded-full shrink-0">
            <AlertTriangle className="h-5 w-5 text-red-600" />
          </div>
          <div>
            <h2
              id="confirm-dialog-title"
              className="text-base font-semibold leading-snug"
            >
              {title}
            </h2>
            {description && (
              <p
                id="confirm-dialog-desc"
                className="text-sm text-muted-foreground mt-1"
              >
                {description}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm rounded-lg border hover:bg-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`px-4 py-2 text-sm rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 ${confirmCls}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
