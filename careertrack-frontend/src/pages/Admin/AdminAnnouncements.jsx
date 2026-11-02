
import { useCallback, useEffect, useMemo, useState } from "react";
import {
    Megaphone,
    Plus,
    Search,
    RefreshCw,
    FileText,
    Send,
    Users,
    GraduationCap,
    Building2,
    Clock3,
    CheckCircle2,
    Pencil,
    Trash2,
    Eye,
    X,
    AlertCircle,
    LoaderCircle,
    CalendarDays,
} from "lucide-react";

import AdminSidebar from "../../components/Admin/AdminSidebar";
import AdminNavbar from "../../components/Admin/AdminNavbar";

import {
    getAdminAnnouncements,
    getAdminAnnouncementSummary,
    createAdminAnnouncement,
    updateAdminAnnouncement,
    publishAdminAnnouncement,
    unpublishAdminAnnouncement,
    deleteAdminAnnouncement,
} from "../../services/adminService";

const EMPTY_FORM = {
    title: "",
    message: "",
    audience: "ALL",
};

const AUDIENCES = [
    { value: "ALL", label: "Everyone", icon: Users },
    { value: "STUDENT", label: "Students", icon: GraduationCap },
    { value: "EMPLOYER", label: "Employers", icon: Building2 },
];

const getAudienceLabel = (audience) =>
    AUDIENCES.find((item) => item.value === audience)?.label || audience;

const formatDate = (date) => {
    if (!date) return "Not published";

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) return "—";

    return parsed.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
};

const getErrorMessage = (error) =>
    error?.message || "Something went wrong. Please try again.";

const StatCard = ({ icon: Icon, label, value, color, description }) => (
    <div className="group relative overflow-hidden rounded-2xl border border-purple-100 bg-white !p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
        <div
            className={`absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-60 blur-2xl ${color}`}
        />

        <div className="relative flex items-start justify-between gap-3">
            <div>
                <p className="text-sm font-medium text-gray-500">{label}</p>
                <h3 className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
                    {value}
                </h3>
                <p className="mt-2 text-xs text-gray-500">{description}</p>
            </div>

            <div className="rounded-xl bg-purple-50 !p-3 text-purple-700 transition group-hover:scale-110">
                <Icon size={21} />
            </div>
        </div>
    </div>
);

const AdminAnnouncements = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [summary, setSummary] = useState({
        total: 0,
        published: 0,
        drafts: 0,
    });

    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [actionId, setActionId] = useState(null);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [audienceFilter, setAudienceFilter] = useState("ALL");
    const [statusFilter, setStatusFilter] = useState("ALL");

    const [modalOpen, setModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState(EMPTY_FORM);
    const [formError, setFormError] = useState("");

    const loadAnnouncements = useCallback(async (showRefresh = false) => {
        if (showRefresh) {
            setRefreshing(true);
        } else {
            setLoading(true);
        }

        setError("");

        try {
            const [announcementData, summaryData] = await Promise.all([
                getAdminAnnouncements(),
                getAdminAnnouncementSummary(),
            ]);

            setAnnouncements(
                Array.isArray(announcementData) ? announcementData : []
            );

            setSummary({
                total: Number(summaryData?.total ?? announcementData?.length ?? 0),
                published: Number(summaryData?.published ?? 0),
                drafts: Number(summaryData?.drafts ?? 0),
            });
        } catch (err) {
            setError(getErrorMessage(err));
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        loadAnnouncements();
    }, [loadAnnouncements]);

    const filteredAnnouncements = useMemo(() => {
        const normalizedSearch = search.trim().toLowerCase();

        return announcements.filter((announcement) => {
            const matchesSearch =
                !normalizedSearch ||
                announcement.title?.toLowerCase().includes(normalizedSearch) ||
                announcement.message?.toLowerCase().includes(normalizedSearch) ||
                announcement.createdBy?.toLowerCase().includes(normalizedSearch);

            const matchesAudience =
                audienceFilter === "ALL" ||
                announcement.audience === audienceFilter;

            const matchesStatus =
                statusFilter === "ALL" ||
                announcement.status === statusFilter;

            return matchesSearch && matchesAudience && matchesStatus;
        });
    }, [announcements, search, audienceFilter, statusFilter]);

    const openCreateModal = () => {
        setEditingId(null);
        setForm(EMPTY_FORM);
        setFormError("");
        setModalOpen(true);
    };

    const openEditModal = (announcement) => {
        setEditingId(announcement.id);
        setForm({
            title: announcement.title || "",
            message: announcement.message || "",
            audience: announcement.audience || "ALL",
        });
        setFormError("");
        setModalOpen(true);
    };

    const closeModal = () => {
        if (saving) return;

        setModalOpen(false);
        setEditingId(null);
        setForm(EMPTY_FORM);
        setFormError("");
    };

    const handleSave = async (event) => {
        event.preventDefault();
        setFormError("");
        setSuccess("");

        const title = form.title.trim();
        const message = form.message.trim();

        if (!title || !message) {
            setFormError("Please enter both a title and a message.");
            return;
        }

        if (title.length > 150) {
            setFormError("Title cannot exceed 150 characters.");
            return;
        }

        setSaving(true);

        try {
            const payload = {
                title,
                message,
                audience: form.audience,
            };

            if (editingId !== null) {
                await updateAdminAnnouncement(editingId, payload);
                setSuccess("Announcement updated successfully.");
            } else {
                await createAdminAnnouncement(payload);
                setSuccess("Draft announcement created successfully.");
            }

            setModalOpen(false);
            setEditingId(null);
            setForm(EMPTY_FORM);

            await loadAnnouncements(true);
        } catch (err) {
            setFormError(getErrorMessage(err));
        } finally {
            setSaving(false);
        }
    };

    const handlePublishToggle = async (announcement) => {
        setActionId(announcement.id);
        setError("");
        setSuccess("");

        try {
            if (announcement.status === "PUBLISHED") {
                await unpublishAdminAnnouncement(announcement.id);
                setSuccess("Announcement moved back to drafts.");
            } else {
                await publishAdminAnnouncement(announcement.id);
                setSuccess("Announcement published successfully.");
            }

            await loadAnnouncements(true);
        } catch (err) {
            setError(getErrorMessage(err));
        } finally {
            setActionId(null);
        }
    };

    const handleDelete = async (announcement) => {
        const confirmed = window.confirm(
            `Delete "${announcement.title}"? This action cannot be undone.`
        );

        if (!confirmed) return;

        setActionId(announcement.id);
        setError("");
        setSuccess("");

        try {
            await deleteAdminAnnouncement(announcement.id);
            setAnnouncements((current) =>
                current.filter((item) => item.id !== announcement.id)
            );
            setSuccess("Announcement deleted successfully.");
            await loadAnnouncements(true);
        } catch (err) {
            setError(getErrorMessage(err));
        } finally {
            setActionId(null);
        }
    };

    const audienceIcon = (audience) => {
        const item = AUDIENCES.find((option) => option.value === audience);
        return item?.icon || Users;
    };

    return (
        <div className="min-h-screen bg-[#f8f6ff] text-gray-800">
            {sidebarOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <button
                        type="button"
                        aria-label="Close sidebar overlay"
                        className="absolute inset-0 bg-gray-950/40 backdrop-blur-sm"
                        onClick={() => setSidebarOpen(false)}
                    />
                    <div className="relative z-10 h-full w-[270px] max-w-[85vw]">
                        <AdminSidebar onClose={() => setSidebarOpen(false)} />
                    </div>
                </div>
            )}

            <div className="lg:pl-[260px]">
                <header className="sticky top-0 z-30">
                    <AdminNavbar onMenuClick={() => setSidebarOpen(true)} />
                </header>

                <main className="mx-auto max-w-[1600px] space-y-7 !p-4 sm:p-6 xl:!p-8">
                    {/* Page heading */}
                    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-700 via-purple-700 to-indigo-800 !p-6 text-white shadow-xl shadow-purple-200/60 sm:p-8">
                        <div className="absolute -right-12 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
                        <div className="absolute -bottom-24 right-1/3 h-48 w-48 rounded-full bg-fuchsia-300/20 blur-3xl" />

                        <div className="relative flex flex-col justify-between gap-6 md:flex-row md:items-center">
                            <div className="max-w-2xl">
                                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 !px-3 !py-1.5 text-xs font-semibold tracking-wide text-purple-100">
                                    <Megaphone size={15} />
                                    CAREERTRACK COMMUNICATION HUB
                                </div>

                                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                                    Announcements & Notifications
                                </h1>

                                <p className="mt-2 max-w-xl text-sm leading-6 text-purple-100 sm:text-base">
                                    Share important updates, reach the right
                                    audience, and manage platform announcements
                                    from one place.
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-3">
                                <button
                                    type="button"
                                    onClick={() => loadAnnouncements(true)}
                                    disabled={refreshing}
                                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/25 bg-white/10 !px-4 !py-3 text-sm font-semibold text-white transition hover:bg-white/20 disabled:opacity-60"
                                >
                                    <RefreshCw
                                        size={17}
                                        className={refreshing ? "animate-spin" : ""}
                                    />
                                    Refresh
                                </button>

                                <button
                                    type="button"
                                    onClick={openCreateModal}
                                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-white !px-4 !py-3 text-sm font-bold text-purple-800 shadow-lg transition hover:-translate-y-0.5 hover:bg-purple-50"
                                >
                                    <Plus size={18} />
                                    New announcement
                                </button>
                            </div>
                        </div>
                    </section>

                    {/* Alerts */}
                    {error && (
                        <div
                            role="alert"
                            className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 !p-4 text-sm text-red-700"
                        >
                            <AlertCircle size={19} className="mt-0.5 shrink-0" />
                            <div className="flex-1">{error}</div>
                            <button
                                type="button"
                                onClick={() => setError("")}
                                aria-label="Dismiss error"
                            >
                                <X size={17} />
                            </button>
                        </div>
                    )}

                    {success && (
                        <div
                            role="status"
                            className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 !p-4 text-sm text-emerald-800"
                        >
                            <CheckCircle2 size={19} className="shrink-0" />
                            <div className="flex-1">{success}</div>
                            <button
                                type="button"
                                onClick={() => setSuccess("")}
                                aria-label="Dismiss success message"
                            >
                                <X size={17} />
                            </button>
                        </div>
                    )}

                    {/* Summary cards */}
                    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                        <StatCard
                            icon={Megaphone}
                            label="Total announcements"
                            value={summary.total}
                            color="bg-violet-300"
                            description="All saved announcements"
                        />
                        <StatCard
                            icon={Send}
                            label="Published"
                            value={summary.published}
                            color="bg-emerald-300"
                            description="Currently published"
                        />
                        <StatCard
                            icon={FileText}
                            label="Drafts"
                            value={summary.drafts}
                            color="bg-amber-300"
                            description="Saved but not published"
                        />
                    </section>

                    {/* Main list */}
                    <section className="overflow-hidden rounded-3xl border border-purple-100 bg-white shadow-sm">
                        <div className="border-b border-purple-100 !p-5 sm:p-6">
                            <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-center">
                                <div>
                                    <h2 className="text-lg font-bold text-gray-900">
                                        Announcement library
                                    </h2>
                                    <p className="mt-1 text-sm text-gray-500">
                                        Search, edit, publish, or manage saved announcements.
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                                    <div className="relative sm:col-span-1">
                                        <Search
                                            size={17}
                                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                        />
                                        <input
                                            type="search"
                                            value={search}
                                            onChange={(event) => setSearch(event.target.value)}
                                            placeholder="Search announcements..."
                                            className="w-full rounded-xl border border-gray-200 bg-gray-50 !py-2.5 !pl-9 !pr-3 text-sm outline-none transition focus:border-purple-400 focus:bg-white focus:ring-4 focus:ring-purple-100"
                                        />
                                    </div>

                                    <select
                                        value={audienceFilter}
                                        onChange={(event) => setAudienceFilter(event.target.value)}
                                        className="rounded-xl border border-gray-200 bg-gray-50 !px-3 !py-2.5 text-sm outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-100"
                                        aria-label="Filter by audience"
                                    >
                                        <option value="ALL">All audiences</option>
                                        <option value="STUDENT">Students</option>
                                        <option value="EMPLOYER">Employers</option>
                                    </select>

                                    <select
                                        value={statusFilter}
                                        onChange={(event) => setStatusFilter(event.target.value)}
                                        className="rounded-xl border border-gray-200 bg-gray-50 !px-3 !py-2.5 text-sm outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-100"
                                        aria-label="Filter by status"
                                    >
                                        <option value="ALL">All statuses</option>
                                        <option value="PUBLISHED">Published</option>
                                        <option value="DRAFT">Drafts</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {loading ? (
                            <div className="flex min-h-64 flex-col items-center justify-center gap-3 !p-8">
                                <LoaderCircle
                                    size={32}
                                    className="animate-spin text-purple-600"
                                />
                                <p className="text-sm text-gray-500">
                                    Loading announcements...
                                </p>
                            </div>
                        ) : filteredAnnouncements.length === 0 ? (
                            <div className="flex min-h-72 flex-col items-center justify-center !px-6 !py-12 text-center">
                                <div className="rounded-2xl bg-purple-50 p-5 text-purple-600">
                                    <Megaphone size={32} />
                                </div>
                                <h3 className="mt-4 text-lg font-bold text-gray-900">
                                    {announcements.length === 0
                                        ? "Your announcement space is ready"
                                        : "No matching announcements"}
                                </h3>
                                <p className="mt-2 max-w-md text-sm leading-6 text-gray-500">
                                    {announcements.length === 0
                                        ? "Create your first announcement to share important updates with the CareerTrack community."
                                        : "Try another search term or change the selected filters."}
                                </p>

                                {announcements.length === 0 && (
                                    <button
                                        type="button"
                                        onClick={openCreateModal}
                                        className="mt-5 inline-flex items-center gap-2 rounded-xl bg-purple-700 !px-4 !py-2.5 text-sm font-semibold text-white transition hover:bg-purple-800"
                                    >
                                        <Plus size={17} />
                                        Create announcement
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div className="divide-y divide-purple-50">
                                {filteredAnnouncements.map((announcement) => {
                                    const AudienceIcon = audienceIcon(announcement.audience);
                                    const isPublished = announcement.status === "PUBLISHED";
                                    const isBusy = actionId === announcement.id;

                                    return (
                                        <article
                                            key={announcement.id}
                                            className="!p-5 transition hover:bg-purple-50/40 sm:p-6"
                                        >
                                            <div className="flex flex-col gap-4 xl:flex-row xl:items-start">
                                                <div className="flex min-w-0 flex-1 gap-4">
                                                    <div
                                                        className={`hidden h-12 w-12 shrink-0 items-center justify-center rounded-2xl sm:flex ${
                                                            isPublished
                                                                ? "bg-emerald-50 text-emerald-600"
                                                                : "bg-amber-50 text-amber-600"
                                                        }`}
                                                    >
                                                        {isPublished ? (
                                                            <Send size={21} />
                                                        ) : (
                                                            <FileText size={21} />
                                                        )}
                                                    </div>

                                                    <div className="min-w-0 flex-1">
                                                        <div className="flex flex-wrap items-center gap-2">
                                                            <h3 className="break-words text-base font-bold text-gray-900">
                                                                {announcement.title}
                                                            </h3>

                                                            <span
                                                                className={`rounded-full !px-2.5 !py-1 text-xs font-semibold ${
                                                                    isPublished
                                                                        ? "bg-emerald-50 text-emerald-700"
                                                                        : "bg-amber-50 text-amber-700"
                                                                }`}
                                                            >
                                                                {isPublished ? "Published" : "Draft"}
                                                            </span>
                                                        </div>

                                                        <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-gray-600">
                                                            {announcement.message}
                                                        </p>

                                                        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-gray-500">
                                                            <span className="inline-flex items-center gap-1.5 rounded-lg bg-purple-50 !px-2.5 !py-1.5 font-medium text-purple-700">
                                                                <AudienceIcon size={14} />
                                                                {getAudienceLabel(announcement.audience)}
                                                            </span>

                                                            <span className="inline-flex items-center gap-1.5">
                                                                <CalendarDays size={14} />
                                                                Created {formatDate(announcement.createdAt)}
                                                            </span>

                                                            {isPublished && (
                                                                <span className="inline-flex items-center gap-1.5">
                                                                    <Clock3 size={14} />
                                                                    Published {formatDate(announcement.publishedAt)}
                                                                </span>
                                                            )}

                                                            {announcement.createdBy && (
                                                                <span>
                                                                    By {announcement.createdBy}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex flex-wrap items-center gap-2 xl:justify-end">
                                                    <button
                                                        type="button"
                                                        onClick={() => openEditModal(announcement)}
                                                        disabled={isBusy}
                                                        className="inline-flex items-center gap-2 rounded-xl border border-purple-200 bg-white !px-3 !py-2 text-sm font-semibold text-purple-700 transition hover:bg-purple-50 disabled:opacity-50"
                                                    >
                                                        <Pencil size={15} />
                                                        Edit
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() => handlePublishToggle(announcement)}
                                                        disabled={isBusy}
                                                        className={`inline-flex items-center gap-2 rounded-xl !px-3 !py-2 text-sm font-semibold transition disabled:opacity-50 ${
                                                            isPublished
                                                                ? "border border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100"
                                                                : "bg-purple-700 text-white hover:bg-purple-800"
                                                        }`}
                                                    >
                                                        {isBusy ? (
                                                            <LoaderCircle size={15} className="animate-spin" />
                                                        ) : isPublished ? (
                                                            <Eye size={15} />
                                                        ) : (
                                                            <Send size={15} />
                                                        )}
                                                        {isPublished ? "Unpublish" : "Publish"}
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() => handleDelete(announcement)}
                                                        disabled={isBusy}
                                                        aria-label={`Delete ${announcement.title}`}
                                                        className="inline-flex items-center justify-center rounded-xl border border-red-100 bg-red-50 !p-2.5 text-red-600 transition hover:bg-red-100 disabled:opacity-50"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        </article>
                                    );
                                })}
                            </div>
                        )}

                        {!loading && filteredAnnouncements.length > 0 && (
                            <div className="flex flex-col gap-2 border-t border-purple-100 bg-purple-50/40 !px-5 !py-4 text-xs text-gray-500 sm:flex-row sm:items-center sm:justify-between">
                                <span>
                                    Showing {filteredAnnouncements.length} of {announcements.length} announcements
                                </span>
                                <span className="inline-flex items-center gap-1.5">
                                    <CheckCircle2 size={14} className="text-purple-600" />
                                    Changes are saved to the database
                                </span>
                            </div>
                        )}
                    </section>
                </main>
            </div>

            {/* Create / Edit modal */}
            {modalOpen && (
                <div
                    className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-gray-950/50 !p-4 backdrop-blur-sm"
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget) closeModal();
                    }}
                >
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="announcement-modal-title"
                        className="my-auto w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl"
                    >
                        <div className="relative overflow-hidden bg-gradient-to-r from-violet-700 to-indigo-700 !px-6 !py-6 text-white sm:px-8">
                            <div className="absolute -right-8 -top-12 h-36 w-36 rounded-full bg-white/10 blur-2xl" />

                            <div className="relative flex items-start justify-between gap-4">
                                <div>
                                    <div className="mb-3 inline-flex rounded-xl bg-white/15 !p-2.5">
                                        <Megaphone size={22} />
                                    </div>
                                    <h2
                                        id="announcement-modal-title"
                                        className="text-xl font-bold"
                                    >
                                        {editingId !== null
                                            ? "Edit announcement"
                                            : "Create announcement"}
                                    </h2>
                                    <p className="mt-1 text-sm text-purple-100">
                                        {editingId !== null
                                            ? "Update the details and audience."
                                            : "Create a draft first, then publish it when ready."}
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={closeModal}
                                    disabled={saving}
                                    aria-label="Close modal"
                                    className="rounded-xl bg-white/10 !p-2.5 transition hover:bg-white/20 disabled:opacity-50"
                                >
                                    <X size={19} />
                                </button>
                            </div>
                        </div>

                        <form onSubmit={handleSave} className="space-y-6 !p-6 sm:p-8">
                            {formError && (
                                <div
                                    role="alert"
                                    className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 !p-3 text-sm text-red-700"
                                >
                                    <AlertCircle size={17} className="mt-0.5 shrink-0" />
                                    {formError}
                                </div>
                            )}

                            <div>
                                <label
                                    htmlFor="announcement-title"
                                    className="mb-2 block text-sm font-semibold text-gray-700"
                                >
                                    Announcement title
                                </label>
                                <input
                                    id="announcement-title"
                                    type="text"
                                    maxLength={150}
                                    required
                                    value={form.title}
                                    onChange={(event) =>
                                        setForm((current) => ({
                                            ...current,
                                            title: event.target.value,
                                        }))
                                    }
                                    placeholder="e.g. Upcoming placement drive"
                                    className="w-full rounded-xl border border-gray-200 !px-4 !py-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-purple-400 focus:ring-4 focus:ring-purple-100"
                                />
                                <p className="mt-1.5 text-right text-xs text-gray-400">
                                    {form.title.length}/150
                                </p>
                            </div>

                            <div>
                                <label
                                    htmlFor="announcement-message"
                                    className="mb-2 block text-sm font-semibold text-gray-700"
                                >
                                    Message
                                </label>
                                <textarea
                                    id="announcement-message"
                                    required
                                    rows={5}
                                    value={form.message}
                                    onChange={(event) =>
                                        setForm((current) => ({
                                            ...current,
                                            message: event.target.value,
                                        }))
                                    }
                                    placeholder="Write a clear message for your audience..."
                                    className="w-full resize-y rounded-xl border border-gray-200 !px-4 !py-3 text-sm leading-6 outline-none transition placeholder:text-gray-400 focus:border-purple-400 focus:ring-4 focus:ring-purple-100"
                                />
                            </div>

                            <fieldset>
                                <legend className="mb-3 text-sm font-semibold text-gray-700">
                                    Choose your audience
                                </legend>

                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                                    {AUDIENCES.map((audience) => {
                                        const Icon = audience.icon;
                                        const selected = form.audience === audience.value;

                                        return (
                                            <button
                                                key={audience.value}
                                                type="button"
                                                onClick={() =>
                                                    setForm((current) => ({
                                                        ...current,
                                                        audience: audience.value,
                                                    }))
                                                }
                                                className={`flex items-center gap-3 rounded-xl border !p-3 text-left transition ${
                                                    selected
                                                        ? "border-purple-500 bg-purple-50 ring-2 ring-purple-100"
                                                        : "border-gray-200 bg-white hover:border-purple-200 hover:bg-purple-50/50"
                                                }`}
                                            >
                                                <span
                                                    className={`rounded-lg !p-2 ${
                                                        selected
                                                            ? "bg-purple-700 text-white"
                                                            : "bg-gray-100 text-gray-600"
                                                    }`}
                                                >
                                                    <Icon size={18} />
                                                </span>
                                                <span className="text-sm font-semibold text-gray-800">
                                                    {audience.label}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </fieldset>

                            <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:justify-end">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    disabled={saving}
                                    className="rounded-xl border border-gray-200 !px-5 !py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 disabled:opacity-50"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-purple-700 !px-6 !py-3 text-sm font-bold text-white shadow-lg shadow-purple-200 transition hover:bg-purple-800 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {saving ? (
                                        <LoaderCircle size={17} className="animate-spin" />
                                    ) : editingId !== null ? (
                                        <Pencil size={17} />
                                    ) : (
                                        <Plus size={18} />
                                    )}

                                    {saving
                                        ? "Saving..."
                                        : editingId !== null
                                          ? "Save changes"
                                          : "Save as draft"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminAnnouncements;
