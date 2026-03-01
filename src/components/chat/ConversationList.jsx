import { useState } from "react";
import { cn } from "@/lib/utils";
import { extractId } from "@/lib/utils";
import { formatDistanceToNowStrict, parseISO } from "date-fns";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { MessageSquare, Trash2 } from "lucide-react";
import { useConversations } from "@/hooks/queries/useChat";
import { useDeleteConversation } from "@/hooks/mutations/useChatMutations";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import { ROLES } from "@/lib/constants";
import { getProfilePicUrl } from "@/lib/utils";

/**
 * Given conversation.doctor / conversation.patient and the viewer's role,
 * return info about the OTHER party.
 */
function getOtherParty(conversation, role) {
  if (!conversation) return { name: "Unknown", userId: null };
  const isPatient = role === ROLES.PATIENT;
  const other = isPatient ? conversation.doctor : conversation.patient;
  const name = other?.user?.name ?? "Unknown";
  const userId = extractId(other?.user) ?? extractId(other?.user?._id);
  const profilePic = other?.profilePicture ?? null;
  return { name, userId, profilePic };
}

function relativeTime(dateStr) {
  if (!dateStr) return "";
  try {
    return formatDistanceToNowStrict(parseISO(dateStr), { addSuffix: true });
  } catch {
    return "";
  }
}

/**
 * @param {{
 *   currentUserId: string,
 *   currentUserRole: string,
 *   selectedId: string | null,
 *   onSelect: (id: string) => void,
 *   onSelectAfterDelete?: () => void,
 *   onlineUserIds: Set<string>,
 * }} props
 */
export default function ConversationList({
  currentUserId,
  currentUserRole,
  selectedId,
  onSelect,
  onSelectAfterDelete,
  onlineUserIds = new Set(),
}) {
  const { data, isLoading, isError } = useConversations({ page: 1, limit: 50 });
  const deleteMutation = useDeleteConversation();
  const [deleteTarget, setDeleteTarget] = useState(null);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-40">
        <LoadingSpinner />
      </div>
    );
  }

  if (isError) {
    return (
      <p className="p-4 text-sm text-destructive">Failed to load conversations.</p>
    );
  }

  const conversations = data?.data ?? [];

  if (!conversations.length) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 h-40 text-muted-foreground">
        <MessageSquare className="h-8 w-8" />
        <p className="text-sm">No conversations yet</p>
      </div>
    );
  }

  return (
    <>
    <ul className="divide-y divide-border overflow-y-auto">
      {conversations.map((conv) => {
        const { name, userId: otherId, profilePic } = getOtherParty(
          conv,
          currentUserRole,
        );
        const isOnline = onlineUserIds.has(otherId);
        const unread = conv.unreadCount ?? 0;
        const lastMsg = conv.lastMessage;

        return (
          <li key={conv._id} className="group relative">
            <button
              onClick={() => onSelect(conv._id)}
              className={cn(
                "w-full flex items-start gap-3 px-4 py-3 pr-10 text-left transition-colors hover:bg-accent",
                selectedId === conv._id && "bg-accent",
              )}
            >
              {/* Avatar with online indicator */}
              <div className="relative shrink-0 mt-0.5">
                <div className="h-9 w-9 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold uppercase text-sm select-none">
                  {name.charAt(0)}
                </div>
                {isOnline && (
                  <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-background" />
                )}
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline">
                  <span className="font-medium text-sm truncate">{name}</span>
                  {lastMsg?.createdAt && (
                    <span className="text-[11px] text-muted-foreground ml-2 shrink-0">
                      {relativeTime(lastMsg.createdAt)}
                    </span>
                  )}
                </div>
                <div className="flex justify-between items-center mt-0.5">
                  <span className="text-xs text-muted-foreground truncate">
                    {lastMsg?.content ?? "No messages yet"}
                  </span>
                  {unread > 0 && (
                    <span className="ml-2 shrink-0 h-4 min-w-[1rem] px-1 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center">
                      {unread > 99 ? "99+" : unread}
                    </span>
                  )}
                </div>
              </div>
            </button>

            {/* Delete button — visible on hover */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setDeleteTarget(conv._id);
              }}
              title="Delete conversation"
              className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 flex items-center justify-center rounded-full text-muted-foreground opacity-0 group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive transition-all"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </li>
        );
      })}
    </ul>

    {/* Delete confirmation */}
    <ConfirmDialog
      isOpen={!!deleteTarget}
      title="Delete conversation?"
      description="This conversation will be removed from your list. The other person won't be affected. You can start a new conversation with them anytime."
      confirmLabel="Delete"
      variant="danger"
      onConfirm={() => {
        const id = deleteTarget;
        setDeleteTarget(null);
        deleteMutation.mutate(id, {
          onSuccess: () => {
            // If the deleted conversation was selected, clear the selection
            if (selectedId === id) {
              onSelectAfterDelete?.();
            }
          },
        });
      }}
      onCancel={() => setDeleteTarget(null)}
    />
    </>
  );
}
