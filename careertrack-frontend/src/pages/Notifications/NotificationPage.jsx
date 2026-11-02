import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Bell,
    CheckCheck,
    Check,
    Trash2,
    ArrowLeft,
    BriefcaseBusiness,
    CalendarDays,
    UserRound,
    Info,
    CircleCheck,
    Clock3,
    LoaderCircle,
    Inbox,
} from "lucide-react";

import useNotifications from "../../hooks/useNotifications";
import Sidebar from "../../components/Sidebar/Sidebar";
import UserNavbar from "../Student/Navbar/UserNavbar";

const FILTERS = ["All", "Unread", "Read"];

const getNotificationIcon = (type = "") => {
    const value = type.toUpperCase();

    if (value.includes("APPLICATION")) return BriefcaseBusiness;
    if (value.includes("INTERVIEW")) return CalendarDays;
    if (value.includes("PROFILE")) return UserRound;
    if (value.includes("SELECTED")) return CircleCheck;

    return Bell;
};

const formatDate = (dateValue) => {
    if (!dateValue) return "";

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) return "";

    const now = new Date();
    const sameDay = date.toDateString() === now.toDateString();

    if (sameDay) {
        return `Today, ${date.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        })}`;
    }

    return date.toLocaleString([], {
        day: "numeric",
        month: "short",
        year:
            date.getFullYear() === now.getFullYear()
                ? undefined
                : "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

const getCurrentUserRole = () => {
    try {
        const user = JSON.parse(
            localStorage.getItem("careertrack_user") ||
            localStorage.getItem("user") ||
            "{}"
        );

        const role =
            user.role ||
            user.userRole ||
            localStorage.getItem("role") ||
            "";

        return String(role)
            .replace(/^ROLE_/i, "")
            .toUpperCase();
    } catch {
        return "";
    }
};

const getNotificationPath = (notification, role) => {
    const referenceType = (
        notification.referenceType || ""
    ).toUpperCase();

    const type = (notification.type || "").toUpperCase();

    if (referenceType === "APPLICATION") {
        if (role === "EMPLOYER") {
            return `/employer/applicants/${notification.referenceId}`;
        }

        if (role === "STUDENT") {
            return `/student/applications/${notification.referenceId}`;
        }
    }

    if (
        referenceType === "INTERVIEW" ||
        type.includes("INTERVIEW")
    ) {
        if (role === "EMPLOYER") {
            return "/employer/interviews";
        }

        if (role === "STUDENT") {
            return "/student/applications";
        }
    }

    if (type.includes("PROFILE")) {
        if (role === "STUDENT") {
            return "/student/profile";
        }

        if (role === "EMPLOYER") {
            return "/employer/profile";
        }
    }

    return null;
};

const NotificationPage = () => {
    const navigate = useNavigate();

    const {
        notifications,
        unreadCount,
        connected,
        loading,
        markAsRead,
        markAllAsRead,
        removeNotification,
    } = useNotifications();

    const [activeFilter, setActiveFilter] = useState("All");
    const [search, setSearch] = useState("");
    const [isOpen, setIsOpen] = useState(false);

    const filteredNotifications = useMemo(() => {
        return notifications.filter((notification) => {
            const matchesFilter =
                activeFilter === "All" ||
                (activeFilter === "Unread" && !notification.read) ||
                (activeFilter === "Read" && notification.read);

            const searchText = search.trim().toLowerCase();

            const matchesSearch =
                !searchText ||
                `${notification.title || ""} ${
                    notification.message || ""
                } ${notification.type || ""}`
                    .toLowerCase()
                    .includes(searchText);

            return matchesFilter && matchesSearch;
        });
    }, [notifications, activeFilter, search]);

    const handleNotificationClick = async (notification) => {
        if (!notification.read) {
            await markAsRead(notification.id);
        }

        const role = getCurrentUserRole();

        const destination = getNotificationPath(
            notification,
            role
        );

        if (destination) {
            navigate(destination);
        }
    };

    const handleDelete = async (event, id) => {
        event.stopPropagation();

        if (window.confirm("Delete this notification?")) {
            await removeNotification(id);
        }
    };

    const handleMarkAllRead = async () => {
        if (unreadCount > 0) {
            await markAllAsRead();
        }
    };

    const readCount = notifications.filter(
        (item) => item.read
    ).length;

    return (
        <div className="min-h-screen w-full bg-slate-50 text-slate-800">
            <div className="grid min-h-screen grid-cols-1 md:grid-cols-[250px_minmax(0,1fr)]">

                {/* LEFT SIDEBAR */}
                <aside
                    className="sticky top-0 z-40 hidden h-screen md:block"
                >
                    <div className="relative h-screen">
                        <Sidebar
                            isOpen={isOpen}
                            setIsOpen={setIsOpen}
                        />
                    </div>
                </aside>

                {/* RIGHT CONTENT COLUMN */}
                <div className="flex min-h-screen min-w-0 flex-col">

                    {/* NAVBAR — CONFINED TO THE RIGHT COLUMN */}
                    <div className="sticky top-0 z-30 w-full border-b border-violet-100/80 bg-white/95 backdrop-blur-xl">
                        <UserNavbar />
                    </div>

                    {/* NOTIFICATION PAGE CONTENT */}
                    <main className="relative z-0 min-w-0 w-full flex-1 !px-4 !py-6 sm:!px-6 lg:!px-8 lg:!py-8">
    <div className="w-full min-w-0">

                            {/* HEADER */}
                            <div className="mb-7 flex items-center justify-between gap-4">
                                <div className="flex min-w-0 items-center gap-3">
                                    <button
                                        type="button"
                                        onClick={() => navigate(-1)}
                                        aria-label="Go back"
                                        className="rounded-xl border border-slate-200 bg-white !p-2.5 transition hover:bg-slate-100"
                                    >
                                        <ArrowLeft size={19} />
                                    </button>

                                    <div className="min-w-0">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                                                Notifications
                                            </h1>

                                            {unreadCount > 0 && (
                                                <span className="rounded-full bg-blue-100 !px-2.5 !py-1 text-xs font-bold text-blue-700">
                                                    {unreadCount > 99
                                                        ? "99+"
                                                        : unreadCount}{" "}
                                                    new
                                                </span>
                                            )}
                                        </div>

                                        <p className="mt-1 text-sm text-slate-500">
                                            Stay up to date with your CareerTrack activity.
                                        </p>
                                    </div>
                                </div>

                                <div
                                    className={`hidden items-center gap-2 rounded-full !px-3 !py-2 text-xs font-medium sm:flex ${
                                        connected
                                            ? "bg-emerald-50 text-emerald-700"
                                            : "bg-amber-50 text-amber-700"
                                    }`}
                                >
                                    <span
                                        className={`h-2 w-2 rounded-full ${
                                            connected
                                                ? "bg-emerald-500"
                                                : "bg-amber-500"
                                        }`}
                                    />
                                    {connected
                                        ? "Live updates on"
                                        : "Reconnecting"}
                                </div>
                            </div>

                            {/* SUMMARY CARDS */}
                            <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                                <div className="flex min-w-0 items-center gap-4 rounded-2xl border border-blue-100 bg-white !p-5 shadow-sm">
                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                        <Bell size={20} />
                                    </div>

                                    <div className="min-w-0">
                                        <p className="text-sm text-slate-500">
                                            Total notifications
                                        </p>
                                        <p className="mt-1 text-2xl font-bold text-slate-900">
                                            {notifications.length}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex min-w-0 items-center gap-4 rounded-2xl border border-blue-100 bg-white !p-5 shadow-sm">
                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                                        <Inbox size={20} />
                                    </div>

                                    <div className="min-w-0">
                                        <p className="text-sm text-slate-500">
                                            Unread
                                        </p>
                                        <p className="mt-1 text-2xl font-bold text-slate-900">
                                            {unreadCount}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex min-w-0 items-center gap-4 rounded-2xl border border-blue-100 bg-white !p-5 shadow-sm sm:col-span-2 xl:col-span-1">
                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                                        <CheckCheck size={20} />
                                    </div>

                                    <div className="min-w-0">
                                        <p className="text-sm text-slate-500">
                                            Read
                                        </p>
                                        <p className="mt-1 text-2xl font-bold text-slate-900">
                                            {readCount}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* NOTIFICATION PANEL */}
                            <section className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                                <div className="border-b border-slate-100 !p-4 sm:!p-5">
                                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                                        <div>
                                            <h2 className="text-lg font-bold text-slate-900">
                                                Your activity
                                            </h2>
                                            <p className="mt-1 text-sm text-slate-500">
                                                Application updates and important messages.
                                            </p>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={handleMarkAllRead}
                                            disabled={unreadCount === 0}
                                            className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-blue-200 !px-3 !py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-40 sm:self-auto"
                                        >
                                            <CheckCheck size={16} />
                                            Mark all as read
                                        </button>
                                    </div>

                                    {/* FILTERS AND SEARCH */}
                                    <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                        <div className="flex max-w-full gap-1 overflow-x-auto rounded-xl bg-slate-100 !p-1">
                                            {FILTERS.map((filter) => (
                                                <button
                                                    key={filter}
                                                    type="button"
                                                    onClick={() => setActiveFilter(filter)}
                                                    className={`shrink-0 rounded-lg !px-4 !py-2 text-sm font-semibold transition ${
                                                        activeFilter === filter
                                                            ? "bg-white text-blue-700 shadow-sm"
                                                            : "text-slate-500 hover:text-slate-800"
                                                    }`}
                                                >
                                                    {filter}

                                                    {filter === "Unread" &&
                                                        unreadCount > 0 && (
                                                            <span className="ml-1.5 text-xs">
                                                                {unreadCount}
                                                            </span>
                                                        )}
                                                </button>
                                            ))}
                                        </div>

                                        <input
                                            type="search"
                                            value={search}
                                            onChange={(event) =>
                                                setSearch(event.target.value)
                                            }
                                            placeholder="Search notifications..."
                                            aria-label="Search notifications"
                                            className="w-full min-w-0 rounded-xl border border-slate-200 bg-white !px-4 !py-2.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-50 sm:max-w-xs"
                                        />
                                    </div>
                                </div>

                                {/* NOTIFICATION LIST */}
                                {loading ? (
                                    <div className="flex min-h-64 flex-col items-center justify-center gap-3 !p-8 text-slate-500">
                                        <LoaderCircle
                                            className="animate-spin text-blue-600"
                                            size={30}
                                        />
                                        <p className="text-sm">
                                            Loading notifications...
                                        </p>
                                    </div>
                                ) : filteredNotifications.length === 0 ? (
                                    <div className="flex min-h-72 flex-col items-center justify-center !px-6 !py-12 text-center">
                                        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-500">
                                            <Bell size={30} />
                                        </div>

                                        <h3 className="text-lg font-bold text-slate-800">
                                            {search
                                                ? "No matching notifications"
                                                : activeFilter === "Unread"
                                                ? "You're all caught up!"
                                                : activeFilter === "Read"
                                                ? "No read notifications"
                                                : "No notifications yet"}
                                        </h3>

                                        <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
                                            {search
                                                ? "Try a different search term."
                                                : "When there's an update about your CareerTrack activity, it will appear here."}
                                        </p>
                                    </div>
                                ) : (
                                    <div>
                                        {filteredNotifications.map((notification) => {
                                            const Icon = getNotificationIcon(
                                                notification.type
                                            );

                                            return (
                                                <article
                                                    key={notification.id}
                                                    onClick={() =>
                                                        handleNotificationClick(notification)
                                                    }
                                                    className={`group flex min-w-0 cursor-pointer gap-3 border-b border-slate-100 !p-4 transition last:border-b-0 hover:bg-blue-50/50 sm:gap-4 sm:!p-5 ${
                                                        !notification.read
                                                            ? "bg-blue-50/40"
                                                            : "bg-white"
                                                    }`}
                                                >
                                                    <div
                                                        className={`relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                                                            !notification.read
                                                                ? "bg-blue-100 text-blue-700"
                                                                : "bg-slate-100 text-slate-500"
                                                        }`}
                                                    >
                                                        <Icon size={20} />

                                                        {!notification.read && (
                                                            <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-white bg-blue-600" />
                                                        )}
                                                    </div>

                                                    <div className="min-w-0 flex-1">
                                                        <div className="flex min-w-0 flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                                                            <h3
                                                                className={`break-words text-sm ${
                                                                    !notification.read
                                                                        ? "font-bold text-slate-900"
                                                                        : "font-semibold text-slate-700"
                                                                }`}
                                                            >
                                                                {notification.title ||
                                                                    "Notification"}
                                                            </h3>

                                                            <span className="flex shrink-0 items-center gap-1 text-xs text-slate-400">
                                                                <Clock3 size={12} />
                                                                {formatDate(
                                                                    notification.createdAt
                                                                )}
                                                            </span>
                                                        </div>

                                                        <p className="mt-1 whitespace-pre-line break-words text-sm leading-6 text-slate-600">
                                                            {notification.message}
                                                        </p>

                                                        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                                                            <span className="rounded-md bg-slate-100 !px-2 !py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                                                                {(notification.type ||
                                                                    "GENERAL").replaceAll(
                                                                    "_",
                                                                    " "
                                                                )}
                                                            </span>

                                                            <div className="flex items-center gap-1">
                                                                {!notification.read && (
                                                                    <button
                                                                        type="button"
                                                                        title="Mark as read"
                                                                        aria-label="Mark notification as read"
                                                                        onClick={async (event) => {
                                                                            event.stopPropagation();
                                                                            await markAsRead(
                                                                                notification.id
                                                                            );
                                                                        }}
                                                                        className="rounded-lg !p-2 text-slate-400 transition hover:bg-blue-100 hover:text-blue-700"
                                                                    >
                                                                        <Check size={17} />
                                                                    </button>
                                                                )}

                                                                <button
                                                                    type="button"
                                                                    title="Delete notification"
                                                                    aria-label="Delete notification"
                                                                    onClick={(event) =>
                                                                        handleDelete(
                                                                            event,
                                                                            notification.id
                                                                        )
                                                                    }
                                                                    className="rounded-lg !p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                                                                >
                                                                    <Trash2 size={16} />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </article>
                                            );
                                        })}
                                    </div>
                                )}

                                {/* FOOTER */}
                                {!loading && notifications.length > 0 && (
                                    <div className="flex flex-col justify-between gap-2 border-t border-slate-100 bg-slate-50/70 !px-4 !py-3 text-xs text-slate-500 sm:flex-row sm:items-center sm:!px-5">
                                        <span>
                                            Showing {filteredNotifications.length} of{" "}
                                            {notifications.length} notifications
                                        </span>

                                        <span className="flex items-center gap-1.5">
                                            <Info size={13} />
                                            Updates appear in real time
                                        </span>
                                    </div>
                                )}
                            </section>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default NotificationPage;