
import { useCallback, useEffect, useRef, useState } from "react";
import { Client } from "@stomp/stompjs";
import {
    Bell,
    Check,
    CheckCheck,
    ChevronDown,
    CircleAlert,
    LoaderCircle,
    RefreshCw,
    Sparkles,
    X,
    CalendarDays,
    BellRing,
} from "lucide-react";

import {
    getAnnouncementReadStatuses,
    markAnnouncementAsRead,
    markAllAnnouncementsAsRead,
} from "../../services/announcementReadService";

import {
    getEmployerAnnouncements,
    getStudentAnnouncements,
} from "../../services/announcementService";

const AnnouncementBanner = ({ role = "STUDENT" }) => {
    const [expanded, setExpanded] = useState(false);
    const [announcements, setAnnouncements] = useState([]);
    const [readIds, setReadIds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [markingAll, setMarkingAll] = useState(false);
    const [error, setError] = useState("");

    const clientRef = useRef(null);
    const mountedRef = useRef(false);

    const normalizedRole = String(role || "STUDENT")
        .toUpperCase()
        .replace("ROLE_", "");

    const isEmployer = normalizedRole === "EMPLOYER";

    const getAnnouncementId = (item) =>
        item?.id ?? item?.announcementId ?? item?.announcement_id;

    const getAnnouncementTitle = (item) =>
        item?.title || item?.subject || "Announcement";

    const getAnnouncementMessage = (item) =>
        item?.message || item?.content || item?.description || "";

    const getAnnouncementDate = (item) => {
        const value =
            item?.publishedAt ||
            item?.createdAt ||
            item?.updatedAt ||
            item?.created_at;

        if (!value) return "";

        const date = new Date(value);

        if (Number.isNaN(date.getTime())) return "";

        return date.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    };

    const extractList = (response) => {
        const data = response?.data ?? response;

        if (Array.isArray(data)) return data;
        if (Array.isArray(data?.content)) return data.content;
        if (Array.isArray(data?.announcements)) return data.announcements;
        if (Array.isArray(data?.data)) return data.data;

        return [];
    };

    const extractReadIds = (response) => {
        const data = response?.data ?? response;

        if (Array.isArray(data)) {
            return data
                .filter(
                    (item) =>
                        item?.isRead === true ||
                        item?.read === true ||
                        item?.readAt ||
                        item?.status === "READ"
                )
                .map((item) =>
                    typeof item === "object"
                        ? item.announcementId ??
                          item.announcement_id ??
                          item.id
                        : item
                )
                .filter((id) => id !== undefined && id !== null);
        }

        const ids =
            data?.readAnnouncementIds ??
            data?.readIds ??
            data?.announcementIds ??
            data?.data?.readAnnouncementIds ??
            [];

        return Array.isArray(ids) ? ids : [];
    };

    const fetchAnnouncements = useCallback(
        async (showRefreshing = false) => {
            if (showRefreshing) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            setError("");

            try {
                const announcementRequest = isEmployer
                    ? getEmployerAnnouncements()
                    : getStudentAnnouncements();

                const [announcementResponse, readResponse] =
                    await Promise.all([
                        announcementRequest,
                        getAnnouncementReadStatuses().catch(() => []),
                    ]);

                if (!mountedRef.current) return;

                const list = extractList(announcementResponse);

                setAnnouncements(
                    list.filter((item) => {
                        const status = String(
                            item?.status || ""
                        ).toUpperCase();

                        return (
                            !status ||
                            status === "PUBLISHED" ||
                            status === "ACTIVE"
                        );
                    })
                );

                setReadIds(extractReadIds(readResponse));
            } catch (err) {
                if (!mountedRef.current) return;

                console.error("Failed to load announcements:", err);

                setError(
                    err?.response?.data?.message ||
                        "Unable to load announcements. Please try again."
                );
            } finally {
                if (mountedRef.current) {
                    setLoading(false);
                    setRefreshing(false);
                }
            }
        },
        [isEmployer]
    );

    useEffect(() => {
        mountedRef.current = true;
        fetchAnnouncements();

        return () => {
            mountedRef.current = false;
        };
    }, [fetchAnnouncements]);

    useEffect(() => {
        const token =
            localStorage.getItem("token") ||
            localStorage.getItem("careertrack_token");

        const client = new Client({
            brokerURL: "ws://localhost:8080/ws",
            connectHeaders: token
                ? { Authorization: `Bearer ${token}` }
                : {},
            reconnectDelay: 5000,
            connectionTimeout: 10000,
            debug: () => {},
        });

        clientRef.current = client;

        client.onConnect = () => {
            const destination = isEmployer
                ? "/queue/announcements.employer"
                : "/queue/announcements.student";

            client.subscribe(destination, (message) => {
                try {
                    const event = JSON.parse(message.body || "{}");

                    const eventType = String(
                        event?.type ||
                            event?.eventType ||
                            event?.action ||
                            ""
                    ).toUpperCase();

                    const announcement =
                        event?.announcement || event?.data;

                    if (
                        ["DELETED", "UNPUBLISHED"].includes(eventType)
                    ) {
                        const removedId =
                            event?.announcementId ??
                            event?.id ??
                            getAnnouncementId(announcement);

                        if (removedId != null) {
                            setAnnouncements((current) =>
                                current.filter(
                                    (item) =>
                                        String(getAnnouncementId(item)) !==
                                        String(removedId)
                                )
                            );
                        } else {
                            fetchAnnouncements(true);
                        }

                        return;
                    }

                    fetchAnnouncements(true);
                } catch (err) {
                    console.error(
                        "Unable to process announcement update:",
                        err
                    );
                    fetchAnnouncements(true);
                }
            });
        };

        client.onStompError = (frame) => {
            console.error(
                "Announcement WebSocket error:",
                frame.headers?.message || frame.body
            );
        };

        client.activate();

        return () => {
            if (clientRef.current === client) {
                clientRef.current = null;
            }

            if (client.active) {
                client.deactivate();
            }
        };
    }, [isEmployer, fetchAnnouncements]);

    const handleToggle = () => {
        setExpanded((current) => !current);
    };

    const handleHeaderKeyDown = (event) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            handleToggle();
        }
    };

    const handleMarkAsRead = async (announcement, event) => {
        event?.stopPropagation();

        const id = getAnnouncementId(announcement);

        if (
            id == null ||
            readIds.some((readId) => String(readId) === String(id))
        ) {
            return;
        }

        try {
            await markAnnouncementAsRead(id);

            setReadIds((current) =>
                current.some((readId) => String(readId) === String(id))
                    ? current
                    : [...current, id]
            );
        } catch (err) {
            console.error("Failed to mark announcement as read:", err);
            setError("Unable to mark this announcement as read.");
        }
    };

    const handleMarkAllAsRead = async (event) => {
        event?.stopPropagation();

        const unread = announcements.filter(
            (announcement) =>
                !readIds.some(
                    (id) =>
                        String(id) ===
                        String(getAnnouncementId(announcement))
                )
        );

        if (unread.length === 0) return;

        setMarkingAll(true);
        setError("");

        try {
            await markAllAnnouncementsAsRead();

            setReadIds((current) => {
                const combined = [
                    ...current,
                    ...unread
                        .map(getAnnouncementId)
                        .filter((id) => id != null),
                ];

                return [...new Set(combined.map(String))];
            });
        } catch (err) {
            console.error("Failed to mark all announcements as read:", err);
            setError("Unable to mark all announcements as read.");
        } finally {
            setMarkingAll(false);
        }
    };

    const unreadCount = announcements.filter(
        (announcement) =>
            !readIds.some(
                (id) =>
                    String(id) ===
                    String(getAnnouncementId(announcement))
            )
    ).length;

    return (
        <section
            className="group relative w-full overflow-hidden rounded-2xl
                border border-purple-100/80 bg-white shadow-sm
                transition-all duration-300 hover:border-purple-200
                hover:shadow-lg hover:shadow-purple-100/60"
        >
            {/* Soft decorative background */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-10 -top-12
                    h-28 w-28 rounded-full bg-purple-200/30 blur-2xl
                    transition-all duration-500 group-hover:bg-purple-300/40"
            />

            {/* Click anywhere on the header to expand or collapse */}
            <div
                role="button"
                tabIndex={0}
                aria-expanded={expanded}
                aria-label={
                    expanded
                        ? "Collapse announcements"
                        : "Expand announcements"
                }
                onClick={handleToggle}
                onKeyDown={handleHeaderKeyDown}
                className="relative flex w-full cursor-pointer
                    items-center justify-between gap-3 !px-3 !py-3
                    transition-all duration-300 hover:bg-purple-50/70
                    focus-visible:outline-none focus-visible:ring-2
                    focus-visible:ring-inset focus-visible:ring-purple-400
                    sm:!px-4"
            >
                <div className="flex min-w-0 items-center gap-3">
                    {/* Animated bell icon */}
                    <div className="relative shrink-0">
                        <div
                            className={`absolute inset-0 rounded-xl
                                bg-purple-400/30 blur-md transition-all
                                duration-500 ${
                                    unreadCount > 0
                                        ? "scale-110 opacity-100"
                                        : "scale-75 opacity-0"
                                }`}
                        />

                        <div
                            className={`relative flex items-center
                                justify-center rounded-xl bg-gradient-to-br
                                from-violet-600 via-purple-600 to-indigo-600
                                !p-2.5 text-white shadow-md shadow-purple-200
                                transition-transform duration-300
                                group-hover:scale-105 ${
                                    unreadCount > 0
                                        ? "animate-[bellSwing_2.5s_ease-in-out_infinite]"
                                        : ""
                                }`}
                        >
                            {unreadCount > 0 ? (
                                <BellRing size={17} />
                            ) : (
                                <Bell size={17} />
                            )}
                        </div>

                        {unreadCount > 0 && (
                            <span
                                className="absolute -right-1 -top-1 flex
                                    h-3.5 w-3.5 items-center justify-center
                                    rounded-full border-2 border-white
                                    bg-pink-500"
                            >
                                <span
                                    className="absolute inset-0 rounded-full
                                        bg-pink-500 animate-ping opacity-60"
                                />
                            </span>
                        )}
                    </div>

                    <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-sm font-bold tracking-tight
                                text-gray-900 sm:text-base">
                                Announcements
                            </h3>

                            {unreadCount > 0 && (
                                <span
                                    className="inline-flex items-center gap-1
                                        rounded-full border border-purple-200
                                        bg-purple-100 !px-2 !py-0.5
                                        text-[10px] font-bold text-purple-700
                                        shadow-sm"
                                >
                                    <span className="h-1.5 w-1.5 rounded-full
                                        bg-purple-600 animate-pulse" />
                                    {unreadCount} new
                                </span>
                            )}
                        </div>

                        <p className="mt-0.5 text-[10px] leading-4
                            text-gray-500 sm:text-xs">
                            Your latest updates, all in one place
                        </p>
                    </div>
                </div>

                <div className="relative flex shrink-0 items-center gap-1.5">
                    <button
                        type="button"
                        aria-label="Refresh announcements"
                        title="Refresh announcements"
                        disabled={refreshing}
                        onClick={(event) => {
                            event.stopPropagation();
                            fetchAnnouncements(true);
                        }}
                        className="rounded-lg !p-2 text-gray-500
                            transition-all duration-200 hover:bg-white
                            hover:text-purple-700 hover:shadow-sm
                            active:scale-90 disabled:opacity-50"
                    >
                        <RefreshCw
                            size={14}
                            className={refreshing ? "animate-spin" : ""}
                        />
                    </button>

                    <div
                        className={`flex items-center justify-center
                            rounded-lg bg-purple-50 !p-2 text-purple-700
                            transition-all duration-300 ${
                                expanded
                                    ? "rotate-180 bg-purple-100"
                                    : "rotate-0"
                            }`}
                    >
                        <ChevronDown size={15} />
                    </div>
                </div>
            </div>

            {/* Smooth animated expand/collapse */}
            <div
                className={`grid transition-[grid-template-rows,opacity]
                    duration-400 ease-in-out ${
                        expanded
                            ? "grid-rows-[1fr] opacity-100"
                            : "grid-rows-[0fr] opacity-0"
                    }`}
            >
                <div className="min-h-0 overflow-hidden">
                    <div
                        className={`border-t border-purple-100/80
                            transition-transform duration-300 ${
                                expanded
                                    ? "translate-y-0"
                                    : "-translate-y-2"
                            }`}
                    >
                        {/* List toolbar */}
                        <div className="flex items-center justify-between
                            gap-2 bg-gradient-to-r from-purple-50/80
                            via-white to-indigo-50/60 !px-3 !py-2.5
                            sm:!px-4">
                            <div className="flex items-center gap-1.5">
                                <Sparkles
                                    size={13}
                                    className="text-purple-500"
                                />

                                <p className="text-[10px] font-medium
                                    text-gray-600 sm:text-xs">
                                    {announcements.length}{" "}
                                    {announcements.length === 1
                                        ? "announcement"
                                        : "announcements"}
                                </p>
                            </div>

                            {unreadCount > 0 && (
                                <button
                                    type="button"
                                    disabled={markingAll}
                                    onClick={handleMarkAllAsRead}
                                    className="inline-flex items-center gap-1.5
                                        rounded-lg border border-purple-100
                                        bg-white !px-2.5 !py-1.5 text-[10px]
                                        font-semibold text-purple-700 shadow-sm
                                        transition-all duration-200
                                        hover:border-purple-200 hover:bg-purple-50
                                        hover:shadow active:scale-95
                                        disabled:opacity-50"
                                >
                                    {markingAll ? (
                                        <LoaderCircle
                                            size={12}
                                            className="animate-spin"
                                        />
                                    ) : (
                                        <CheckCheck size={12} />
                                    )}
                                    Mark all read
                                </button>
                            )}
                        </div>

                        {error && (
                            <div className="mx-3 mt-2 flex items-start gap-2
                                rounded-xl border border-red-100
                                bg-red-50 !p-2.5 text-[11px] text-red-700
                                sm:mx-4">
                                <CircleAlert
                                    size={14}
                                    className="mt-0.5 shrink-0"
                                />

                                <p className="flex-1">{error}</p>

                                <button
                                    type="button"
                                    aria-label="Dismiss error"
                                    onClick={() => setError("")}
                                    className="rounded-md !p-1
                                        transition-colors hover:bg-red-100"
                                >
                                    <X size={12} />
                                </button>
                            </div>
                        )}

                        {loading ? (
                            <div className="flex flex-col items-center
                                justify-center !px-4 !py-8">
                                <div className="relative mb-3">
                                    <div className="absolute inset-0
                                        rounded-full bg-purple-200
                                        animate-ping opacity-40" />

                                    <div className="relative rounded-full
                                        bg-purple-50 !p-3">
                                        <LoaderCircle
                                            size={22}
                                            className="animate-spin
                                                text-purple-600"
                                        />
                                    </div>
                                </div>

                                <p className="text-xs font-semibold
                                    text-gray-700">
                                    Getting things ready...
                                </p>

                                <p className="mt-1 text-[10px] text-gray-400">
                                    Loading your announcements
                                </p>
                            </div>
                        ) : announcements.length === 0 ? (
                            <div className="relative flex flex-col
                                items-center justify-center overflow-hidden
                                !px-4 !py-8 text-center">
                                <div
                                    aria-hidden="true"
                                    className="absolute h-24 w-24 rounded-full
                                        bg-purple-100/70 blur-2xl"
                                />

                                <div className="relative mb-3 rounded-2xl
                                    border border-purple-100 bg-gradient-to-br
                                    from-purple-50 to-indigo-50 !p-3
                                    shadow-sm">
                                    <Bell
                                        size={22}
                                        className="text-purple-500"
                                    />
                                </div>

                                <h4 className="text-sm font-bold text-gray-800">
                                    You're all caught up!
                                </h4>

                                <p className="mt-1 max-w-xs text-[11px]
                                    leading-5 text-gray-500">
                                    No announcements right now. New updates
                                    will appear here when they're available.
                                </p>

                                <button
                                    type="button"
                                    onClick={() => fetchAnnouncements(true)}
                                    className="mt-3 inline-flex items-center
                                        gap-1.5 rounded-lg bg-purple-50
                                        !px-3 !py-2 text-[10px] font-semibold
                                        text-purple-700 transition-all
                                        hover:bg-purple-100 active:scale-95"
                                >
                                    <RefreshCw size={12} />
                                    Check again
                                </button>
                            </div>
                        ) : (
                            <div className="max-h-80 space-y-2
                                overflow-y-auto !p-3 sm:!p-4">
                                {announcements.map((announcement, index) => {
                                    const id =
                                        getAnnouncementId(announcement);

                                    const isRead = readIds.some(
                                        (readId) =>
                                            String(readId) === String(id)
                                    );

                                    return (
                                        <article
                                            key={id ?? index}
                                            style={{
                                                animationDelay: `${Math.min(
                                                    index * 70,
                                                    350
                                                )}ms`,
                                            }}
                                            className={`group/card relative
                                                overflow-hidden rounded-xl
                                                border !p-3
                                                transition-all duration-300
                                                animate-[cardEnter_400ms_ease-out_both]
                                                hover:-translate-y-0.5
                                                hover:shadow-md sm:!p-3.5 ${
                                                    isRead
                                                        ? "border-gray-100 bg-white hover:border-purple-100"
                                                        : "border-purple-100 bg-gradient-to-br from-purple-50/80 via-white to-indigo-50/60 hover:border-purple-200"
                                                }`}
                                        >
                                            {!isRead && (
                                                <div className="absolute
                                                    bottom-0 left-0 top-0
                                                    w-1 rounded-r-full
                                                    bg-gradient-to-b
                                                    from-purple-500 to-indigo-500" />
                                            )}

                                            <div className="flex items-start gap-2.5">
                                                <div
                                                    className={`mt-0.5 shrink-0
                                                        rounded-lg !p-2
                                                        transition-transform
                                                        duration-300
                                                        group-hover/card:scale-105 ${
                                                            isRead
                                                                ? "bg-gray-100 text-gray-500"
                                                                : "bg-gradient-to-br from-purple-100 to-indigo-100 text-purple-700"
                                                        }`}
                                                >
                                                    <Bell size={14} />
                                                </div>

                                                <div className="min-w-0 flex-1">
                                                    <div className="flex
                                                        items-start justify-between
                                                        gap-2">
                                                        <h4 className="break-words
                                                            text-xs font-bold
                                                            leading-5 text-gray-800
                                                            transition-colors
                                                            group-hover/card:text-purple-800
                                                            sm:text-sm">
                                                            {getAnnouncementTitle(
                                                                announcement
                                                            )}
                                                        </h4>

                                                        {!isRead && (
                                                            <span
                                                                className="mt-1
                                                                    h-2 w-2
                                                                    shrink-0
                                                                    rounded-full
                                                                    bg-purple-500
                                                                    ring-4
                                                                    ring-purple-100
                                                                    animate-pulse"
                                                                title="Unread"
                                                            />
                                                        )}
                                                    </div>

                                                    <p className="mt-1
                                                        whitespace-pre-wrap
                                                        break-words text-[11px]
                                                        leading-5 text-gray-600
                                                        [overflow-wrap:anywhere]
                                                        sm:text-xs">
                                                        {getAnnouncementMessage(
                                                            announcement
                                                        )}
                                                    </p>

                                                    <div className="mt-2.5
                                                        flex flex-wrap
                                                        items-center
                                                        justify-between gap-2
                                                        border-t border-gray-100/80
                                                        !pt-2">
                                                        <div className="flex
                                                            flex-wrap
                                                            items-center gap-2">
                                                            {getAnnouncementDate(
                                                                announcement
                                                            ) && (
                                                                <span className="inline-flex
                                                                    items-center
                                                                    gap-1 text-[10px]
                                                                    text-gray-400">
                                                                    <CalendarDays
                                                                        size={11}
                                                                    />
                                                                    {getAnnouncementDate(
                                                                        announcement
                                                                    )}
                                                                </span>
                                                            )}

                                                            <span
                                                                className={`inline-flex
                                                                    items-center
                                                                    gap-1 rounded-full
                                                                    !px-2 !py-0.5
                                                                    text-[9px]
                                                                    font-semibold ${
                                                                        isRead
                                                                            ? "bg-gray-100 text-gray-500"
                                                                            : "bg-purple-100 text-purple-700"
                                                                    }`}
                                                            >
                                                                <span
                                                                    className={`h-1.5
                                                                        w-1.5 rounded-full ${
                                                                            isRead
                                                                                ? "bg-gray-400"
                                                                                : "bg-purple-500"
                                                                        }`}
                                                                />
                                                                {isRead
                                                                    ? "Read"
                                                                    : "Unread"}
                                                            </span>
                                                        </div>

                                                        {!isRead && (
                                                            <button
                                                                type="button"
                                                                onClick={(event) =>
                                                                    handleMarkAsRead(
                                                                        announcement,
                                                                        event
                                                                    )
                                                                }
                                                                className="inline-flex
                                                                    items-center
                                                                    gap-1 rounded-lg
                                                                    border
                                                                    border-purple-100
                                                                    bg-white
                                                                    !px-2.5 !py-1.5
                                                                    text-[10px]
                                                                    font-semibold
                                                                    text-purple-700
                                                                    shadow-sm
                                                                    transition-all
                                                                    duration-200
                                                                    hover:border-purple-200
                                                                    hover:bg-purple-50
                                                                    hover:shadow
                                                                    active:scale-95"
                                                            >
                                                                <Check size={11} />
                                                                Mark read
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </article>
                                    );
                                })}
                            </div>
                        )}

                        <div className="h-1 bg-gradient-to-r
                            from-violet-500 via-purple-500 to-indigo-500
                            opacity-70" />
                    </div>
                </div>
            </div>

            {/* Component-scoped animation definitions */}
            <style>{`
                @keyframes bellSwing {
                    0%, 100% { transform: rotate(0deg); }
                    5%, 15% { transform: rotate(12deg); }
                    10%, 20% { transform: rotate(-12deg); }
                    25% { transform: rotate(0deg); }
                }

                @keyframes cardEnter {
                    from {
                        opacity: 0;
                        transform: translateY(8px) scale(0.985);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }
            `}</style>
        </section>
    );
};

export default AnnouncementBanner;
