
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Search,
  Plus,
  Smile,
  Send,
  Phone,
  MoreVertical,
  PanelLeftClose,
  PanelLeftOpen,
  ArrowLeft,
  Check,
  CheckCheck,
  MessageCircle,
  LoaderCircle,
  Users,
} from "lucide-react";

import {
  getChatStudents,
  getChatConversations,
  getChatMessages,
  getOrCreateChatConversation,
  sendChatMessage,
  markChatMessagesAsRead,
} from "../../../services/chatService";

function Avatar({ student, size = "h-11 w-11" }) {
  const name = student?.name || "Student";
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <div
      className={`${size} flex shrink-0 items-center justify-center rounded-full bg-violet-100 font-semibold text-violet-700`}
      title={name}
    >
      {initials || "S"}
    </div>
  );
}

function formatTime(value) {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const now = new Date();

  if (date.toDateString() === now.toDateString()) {
    return date.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });
  }

  return date.toLocaleDateString([], {
    month: "short",
    day: "numeric",
  });
}

function MessageStatus({ read }) {
  return read ? (
    <CheckCheck
      className="h-4 w-4 text-blue-500"
      aria-label="Seen"
      title="Seen"
    />
  ) : (
    <Check
      className="h-4 w-4 text-gray-400"
      aria-label="Sent; not yet marked as read"
      title="Sent; not yet marked as read"
    />
  );
}

export default function ChatPage() {
  const [students, setStudents] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);

  const [selectedConversation, setSelectedConversation] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const [search, setSearch] = useState("");
  const [draft, setDraft] = useState("");
  const [showNewChat, setShowNewChat] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileChatOpen, setMobileChatOpen] = useState(false);

  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [openingStudentId, setOpeningStudentId] = useState(null);
  const [error, setError] = useState("");

  const loadConversations = useCallback(async () => {
    const data = await getChatConversations();
    setConversations(Array.isArray(data) ? data : []);
    return Array.isArray(data) ? data : [];
  }, []);

  const loadStudents = useCallback(async () => {
    const data = await getChatStudents();
    setStudents(Array.isArray(data) ? data : []);
  }, []);

  const loadMessages = useCallback(async (conversationId) => {
    setMessagesLoading(true);

    try {
      const data = await getChatMessages(conversationId);
      setMessages(Array.isArray(data) ? data : []);
    } finally {
      setMessagesLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function initialize() {
      setLoading(true);
      setError("");

      try {
        const [studentData, conversationData] = await Promise.all([
          getChatStudents(),
          getChatConversations(),
        ]);

        if (cancelled) return;

        setStudents(Array.isArray(studentData) ? studentData : []);
        setConversations(
          Array.isArray(conversationData) ? conversationData : []
        );
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Could not load your chats.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    initialize();

    return () => {
      cancelled = true;
    };
  }, []);

  const activeStudent =
    selectedStudent ||
    selectedConversation?.otherStudent ||
    null;

  const visibleItems = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (showNewChat) {
      return students.filter((student) =>
        (student.name || "").toLowerCase().includes(term)
      );
    }

    return conversations.filter((conversation) =>
      (conversation.otherStudent?.name || "")
        .toLowerCase()
        .includes(term)
    );
  }, [conversations, students, search, showNewChat]);

  const openConversation = async (conversation) => {
  setError("");
  setShowNewChat(false);
  setSelectedConversation(conversation);
  setSelectedStudent(conversation.otherStudent);
  setMobileChatOpen(true);

  try {
    await markChatMessagesAsRead(conversation.id);

    // Reload messages after the backend updates their read status.
    await loadMessages(conversation.id);

    // Refresh unread counts in the sidebar.
    await loadConversations();
  } catch (err) {
    setError(err.message || "Could not open this conversation.");
  }
};

  const startChat = async (student) => {
    setError("");
    setOpeningStudentId(student.id);

    try {
      // Backend should return an existing conversation when one exists.
      const conversation = await getOrCreateChatConversation(student.id);

      // Refresh the list using actual backend data.
      const updatedConversations = await loadConversations();

      const actualConversation =
        updatedConversations.find((item) => item.id === conversation.id) ||
        conversation;

      setSelectedConversation(actualConversation);
      setSelectedStudent(actualConversation.otherStudent || student);
      setShowNewChat(false);
      setMobileChatOpen(true);

      await loadMessages(actualConversation.id);
    } catch (err) {
      setError(err.message || "Could not open this conversation.");
    } finally {
      setOpeningStudentId(null);
    }
  };

  const handleSendMessage = async (event) => {
    event.preventDefault();

    const content = draft.trim();

    if (!content || !selectedConversation || sending) return;

    setSending(true);
    setError("");

    try {
      // Persist the message in the database first.
      await sendChatMessage(selectedConversation.id, content);
      setDraft("");

      // Reload server-authoritative messages and last-message previews.
      await Promise.all([
        loadMessages(selectedConversation.id),
        loadConversations(),
      ]);
    } catch (err) {
      setError(err.message || "Message could not be sent.");
    } finally {
      setSending(false);
    }
  };

  const handleNewChat = async () => {
    setShowNewChat(true);
    setSearch("");
    setMobileChatOpen(false);
    setError("");

    try {
      await loadStudents();
    } catch (err) {
      setError(err.message || "Could not load students.");
    }
  };

  const getLastMessage = (conversation) =>
    conversation.lastMessage || "No messages yet";

  return (
    <div className="flex h-[calc(100dvh-2rem)] min-h-[540px] flex-col overflow-hidden border border-gray-200 bg-white shadow-sm">
      <header className="flex items-center justify-between bg-violet-700 !px-4 !py-4 text-white sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/15">
            <MessageCircle className="h-6 w-6" />
          </div>
          <div className="min-w-0">
            <h1 className="text-lg font-bold sm:text-xl">
              CareerTrack Chat
            </h1>
            <p className="text-xs text-violet-200 sm:text-sm">
              Connect with fellow students
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setSidebarCollapsed((value) => !value)}
          title={sidebarCollapsed ? "Show conversations" : "Collapse conversations"}
          className="hidden rounded-lg p-2 transition hover:bg-white/15 md:inline-flex"
        >
          {sidebarCollapsed ? (
            <PanelLeftOpen className="h-5 w-5" />
          ) : (
            <PanelLeftClose className="h-5 w-5" />
          )}
        </button>
      </header>

      <div className="flex min-h-0 flex-1">
        <aside
          className={`${
            mobileChatOpen ? "hidden md:flex" : "flex"
          } ${
            sidebarCollapsed ? "md:hidden" : "md:flex"
          } w-full shrink-0 flex-col border-r border-gray-200 bg-white md:w-[310px] lg:w-[350px]`}
        >
          <div className="border-b border-gray-100 !p-4">
            <div className="mb-3 flex items-center justify-between gap-2">
              <h2 className="text-xl font-bold text-gray-900">
                {showNewChat ? "New chat" : "Chats"}
              </h2>

              <button
                type="button"
                onClick={
                  showNewChat
                    ? () => {
                        setShowNewChat(false);
                        setSearch("");
                      }
                    : handleNewChat
                }
                title={showNewChat ? "Back to chats" : "Start a new chat"}
                className="rounded-lg bg-violet-50 p-2 text-violet-700 transition hover:bg-violet-100"
              >
                {showNewChat ? (
                  <ArrowLeft className="h-5 w-5" />
                ) : (
                  <Plus className="h-5 w-5" />
                )}
              </button>
            </div>

            <div className="flex items-center gap-2 rounded-xl bg-gray-100 !px-3 !py-2.5 focus-within:ring-2 focus-within:ring-violet-200">
              <Search className="h-4 w-4 shrink-0 text-gray-500" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder={
                  showNewChat ? "Search students..." : "Search conversations..."
                }
                className="w-full bg-transparent text-sm text-gray-800 outline-none placeholder:text-gray-500"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center gap-2 !p-8 text-sm text-gray-500">
                <LoaderCircle className="h-5 w-5 animate-spin" />
                Loading chats...
              </div>
            ) : visibleItems.length === 0 ? (
              <div className="!px-5 !py-12 text-center">
                <Users className="mx-auto mb-3 h-7 w-7 text-gray-300" />
                <p className="text-sm font-medium text-gray-700">
                  {showNewChat
                    ? "No students found"
                    : "No conversations yet"}
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  {showNewChat
                    ? "Try searching for another student."
                    : "Use the + button to start a new chat."}
                </p>
              </div>
            ) : (
              visibleItems.map((item) => {
                const student = showNewChat
                  ? item
                  : item.otherStudent;

                if (!student) return null;

                const active =
                  !showNewChat &&
                  item.id === selectedConversation?.id;

                return (
                  <button
                    type="button"
                    key={showNewChat ? `student-${student.id}` : `conversation-${item.id}`}
                    onClick={() =>
                      showNewChat
                        ? startChat(student)
                        : openConversation(item)
                    }
                    disabled={
                      showNewChat && openingStudentId === student.id
                    }
                    className={`flex w-full items-center gap-3 border-b border-gray-50 !px-4 !py-3.5 text-left transition ${
                      active ? "bg-violet-50" : "hover:bg-gray-50"
                    }`}
                  >
                    <Avatar student={student} />

                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex items-center justify-between gap-2">
                        <span className="truncate text-sm font-semibold text-gray-900">
                          {student.name}
                        </span>
                        {!showNewChat && (
                          <span className="shrink-0 text-[11px] text-gray-400">
                            {formatTime(item.lastMessageAt)}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate text-xs text-gray-500">
                          {showNewChat
                            ? student.designation || student.location || "Student"
                            : getLastMessage(item)}
                        </p>

                        {!showNewChat && item.unreadCount > 0 && (
                          <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-violet-600 !px-1.5 text-[10px] font-semibold text-white">
                            {item.unreadCount}
                          </span>
                        )}

                        {showNewChat && openingStudentId === student.id && (
                          <LoaderCircle className="h-4 w-4 animate-spin text-violet-600" />
                        )}
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </aside>

        <main
          className={`${
            mobileChatOpen ? "flex" : "hidden md:flex"
          } min-w-0 flex-1 flex-col`}
        >
          {activeStudent && selectedConversation ? (
            <>
              <div className="flex items-center gap-3 border-b border-gray-200 bg-white !px-3 !py-3 sm:px-5">
                <button
                  type="button"
                  onClick={() => setMobileChatOpen(false)}
                  className="rounded-lg !p-2 text-gray-500 hover:bg-gray-100 md:hidden"
                  aria-label="Back to conversations"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>

                <Avatar student={activeStudent} size="h-10 w-10" />

                <div className="min-w-0 flex-1">
                  <h2 className="truncate text-sm font-semibold text-gray-900 sm:text-base">
                    {activeStudent.name}
                  </h2>
                  <p className="text-xs text-gray-500">
                    {activeStudent.designation ||
                      activeStudent.location ||
                      "CareerTrack student"}
                  </p>
                </div>

                <div className="flex items-center gap-1 text-gray-500">
                  <button
                    type="button"
                    title="Voice call (not implemented)"
                    className="rounded-lg !p-2 hover:bg-gray-100"
                  >
                    <Phone className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    title="More options"
                    className="rounded-lg !p-2 hover:bg-gray-100"
                  >
                    <MoreVertical className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {error && (
                <div className="border-b border-red-100 bg-red-50 !px-4 !py-2 text-sm text-red-700">
                  {error}
                </div>
              )}

              <div
                className="flex-1 space-y-4 overflow-y-auto !px-3 !py-5 sm:px-6"
                style={{
                  backgroundColor: "#F7F3EE",
                  backgroundImage:
                    "radial-gradient(rgba(124,58,237,0.045) 0.8px, transparent 0.8px)",
                  backgroundSize: "18px 18px",
                }}
              >
                {messagesLoading ? (
                  <div className="flex items-center justify-center gap-2 !py-10 text-sm text-gray-500">
                    <LoaderCircle className="h-5 w-5 animate-spin" />
                    Loading messages...
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex h-full min-h-48 flex-col items-center justify-center text-center">
                    <MessageCircle className="mb-3 h-10 w-10 text-violet-300" />
                    <p className="font-medium text-gray-700">
                      No messages yet
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      Send a message to start the conversation.
                    </p>
                  </div>
                ) : (
                  messages.map((message) => {
                    // In this conversation, otherStudent is the recipient
                    // from the current user's perspective.
                    const mine =
                      Number(message.senderId) !==
                      Number(activeStudent.id);

                    return (
                      <div
                        key={message.id}
                        className={`flex ${
                          mine ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[88%] rounded-2xl !px-3 !py-2 shadow-sm sm:max-w-[75%] ${
                            mine
                              ? "rounded-br-sm bg-violet-100 text-violet-950"
                              : "rounded-bl-sm bg-white text-gray-800"
                          }`}
                        >
                          <p className="whitespace-pre-wrap break-words text-sm leading-6">
                            {message.content}
                          </p>

                          <div className="mt-1 flex items-center justify-end gap-1.5">
                            <span className="text-[10px] text-gray-400">
                              {formatTime(message.createdAt)}
                            </span>
                            {mine && (
                              <MessageStatus read={message.read} />
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              <form
                onSubmit={handleSendMessage}
                className="flex items-center gap-2 border-t border-gray-200 bg-white !px-3 !py-3 sm:gap-3 sm:px-5"
              >
                <button
                  type="button"
                  title="Emoji (not implemented)"
                  className="hidden rounded-lg !p-2 text-gray-500 hover:bg-gray-100 sm:inline-flex"
                >
                  <Smile className="h-5 w-5" />
                </button>

                <input
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  placeholder="Type a message..."
                  maxLength={2000}
                  className="min-w-0 flex-1 rounded-full bg-gray-100 !px-4 !py-3 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-violet-200"
                  aria-label="Type a message"
                />

                <button
                  type="submit"
                  disabled={!draft.trim() || sending || messagesLoading}
                  title="Send message"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-600 text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {sending ? (
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </button>
              </form>
            </>
          ) : (
            <div className="hidden flex-1 items-center justify-center bg-gray-50 md:flex">
              <div className="max-w-sm px-6 text-center">
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-violet-100 text-violet-600">
                  <MessageCircle className="h-10 w-10" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Your conversations
                </h2>
                <p className="mt-2 text-sm leading-6 text-gray-500">
                  Select an existing chat or start a new conversation with a student.
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
