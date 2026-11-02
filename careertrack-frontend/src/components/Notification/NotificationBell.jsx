
import { useState } from "react";
import { Bell, CheckCheck, Trash2, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useNotifications from "../../hooks/useNotifications";
import { useAuth } from "../../context/authContext";

function timeAgo(value) {
    const seconds = Math.max(
        0,
        Math.floor((Date.now() - new Date(value).getTime()) / 1000)
    );

    if (seconds < 60) return "Just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;

    return new Date(value).toLocaleDateString();
}

export default function NotificationBell() {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    const { user } = useAuth();

const role = String(user?.role || user?.userRole || "")
    .replace(/^ROLE_/i, "")
    .trim()
    .toUpperCase();

   const {
    notifications,
    unreadCount,
    loading,
    connected,
    error,
    markAsRead: markRead,
    markAllAsRead: markAllRead,
    removeNotification,
} = useNotifications();

    async function openNotification(item) {
    try {
        if (!item.read) {
            await markRead(item.id);
        }
    } catch (err) {
        console.error("Unable to mark notification as read", err);
    }

    setOpen(false);

    const referenceType = String(item.referenceType || "")
        .toUpperCase();

    const type = String(item.type || "").toUpperCase();

    const referenceId = item.referenceId;

    // Application notifications
    if (referenceType === "APPLICATION" && referenceId) {
        if (role === "EMPLOYER") {
            navigate(`/employer/applicants/${referenceId}`);
        } else if (role === "STUDENT") {
            navigate(`/student/applications/${referenceId}`);
        } else {
            navigate("/notifications");
        }

        return;
    }

    // Job notifications
    if (referenceType === "JOB" && referenceId) {
        navigate(
            role === "EMPLOYER"
                ? `/employer/jobs/${referenceId}`
                : `/student/jobs/${referenceId}`
        );
        return;
    }

    // Interview notifications
    if (
        referenceType === "INTERVIEW" ||
        type.includes("INTERVIEW")
    ) {
        navigate(
            role === "EMPLOYER"
                ? "/employer/interviews"
                : "/student/applications"
        );
        return;
    }

    // Profile notifications
    if (type.includes("PROFILE")) {
        navigate(
            role === "EMPLOYER"
                ? "/employer/profile"
                : "/student/profile"
        );
        return;
    }

    navigate("/notifications");
}

    return (
        <div className="relative">
            <button
                type="button"
                onClick={() => setOpen((value) => !value)}
                aria-label={`Notifications, ${unreadCount} unread`}
                aria-expanded={open}
                className="relative flex h-10 w-10 items-center justify-center
                    rounded-xl text-gray-600 transition hover:bg-purple-50
                    hover:text-purple-700"
            >
                <Bell size={21} />

                {unreadCount > 0 && (
                    <span className="absolute -right-1 -top-1 flex
                        min-h-5 min-w-5 items-center justify-center
                        rounded-full bg-red-500 px-1 text-[10px]
                        font-bold text-white">
                        {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                )}
            </button>

            {open && (
                <>
                    <button
                        type="button"
                        aria-label="Close notifications"
                        onClick={() => setOpen(false)}
                        className="fixed inset-0 z-40 cursor-default"
                    />

                    <div className="absolute right-0 top-12 z-50
                        w-[min(24rem,calc(100vw-2rem))]
                        overflow-hidden rounded-2xl border border-gray-200
                        bg-white shadow-xl">

                        <div className="flex items-center justify-between
                            border-b border-gray-100 !p-4">
                            <div>
                                <h3 className="font-semibold text-gray-900">
                                    Notifications
                                </h3>
                                <p className="text-xs text-gray-500">
                                    {connected
                                        ? "Live connection active"
                                        : "Connecting to live updates..."}
                                </p>
                            </div>

                            <div className="flex items-center gap-2">
                                {unreadCount > 0 && (
                                    <button
                                        type="button"
                                        title="Mark all as read"
                                        onClick={() => markAllRead()}
                                        className="rounded-lg !p-2 text-purple-600
                                            hover:bg-purple-50"
                                    >
                                        <CheckCheck size={18} />
                                    </button>
                                )}

                                <button
                                    type="button"
                                    onClick={() => setOpen(false)}
                                    className="rounded-lg !p-2 text-gray-500
                                        hover:bg-gray-100"
                                >
                                    <X size={18} />
                                </button>
                            </div>
                        </div>

                        {error && (
                            <p className="!px-4 !pt-3 text-sm text-red-600">
                                {error}
                            </p>
                        )}

                        <div className="max-h-[420px] overflow-y-auto">
                            {loading ? (
                                <p className="p-6 text-center text-sm
                                    text-gray-500">
                                    Loading notifications...
                                </p>
                            ) : notifications.length === 0 ? (
                                <div className="!p-8 text-center">
                                    <Bell className="mx-auto mb-3
                                        text-gray-300" size={30} />
                                    <p className="font-medium text-gray-700">
                                        You're all caught up!
                                    </p>
                                    <p className="mt-1 text-sm text-gray-500">
                                        New updates will appear here.
                                    </p>
                                </div>
                            ) : (
                                notifications.map((item) => (
                                    <div
                                        key={item.id}
                                        className={`group flex gap-3 border-b
                                            border-gray-100 !p-4 transition
                                            hover:bg-purple-50/50
                                            ${!item.read
                                                ? "bg-purple-50/40"
                                                : ""}`}
                                    >
                                        <button
                                            type="button"
                                            onClick={() =>
                                                openNotification(item)
                                            }
                                            className="min-w-0 flex-1 text-left"
                                        >
                                            <div className="flex items-start
                                                gap-2">
                                                <span className={`mt-1.5 h-2
                                                    w-2 shrink-0 rounded-full
                                                    ${item.read
                                                        ? "bg-transparent"
                                                        : "bg-purple-600"}`} />

                                                <div className="min-w-0 flex-1">
                                                    <p className="text-sm
                                                        font-semibold
                                                        text-gray-900">
                                                        {item.title}
                                                    </p>
                                                    <p className="mt-1 text-sm
                                                        leading-5 text-gray-600">
                                                        {item.message}
                                                    </p>
                                                    <p className="mt-2 text-xs
                                                        text-gray-400">
                                                        {timeAgo(item.createdAt)}
                                                    </p>
                                                </div>
                                            </div>
                                        </button>

                                        <button
                                            type="button"
                                            title="Delete notification"
                                            onClick={() =>
                                                removeNotification(item.id)
                                            }
                                            className="h-8 shrink-0 rounded-lg
                                                !p-2 text-gray-400 opacity-100
                                                hover:bg-red-50 hover:text-red-600
                                                sm:opacity-0 sm:group-hover:opacity-100"
                                        >
                                            <Trash2 size={15} />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>

                        <button
                            type="button"
                            onClick={() => {
                                setOpen(false);
                                navigate("/notifications");
                            }}
                            className="w-full border-t border-gray-100 !p-3
                                text-sm font-semibold text-purple-700
                                hover:bg-purple-50"
                        >
                            View all notifications
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
