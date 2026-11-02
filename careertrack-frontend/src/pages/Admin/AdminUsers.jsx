
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    Users,
    Search,
    RefreshCw,
    ArrowLeft,
    ShieldCheck,
    GraduationCap,
    Building2,
    Mail,
    MapPin,
    Phone,
    CalendarDays,
    AlertCircle,
    LoaderCircle,
    UserRound,
    SlidersHorizontal,
} from "lucide-react";

import AdminSidebar from "../../components/Admin/AdminSidebar";
import AdminNavbar from "../../components/Admin/AdminNavbar";
import { getAdminUsers } from "../../services/adminService";

const ROLE_FILTERS = [
    { label: "All accounts", value: "ALL" },
    { label: "Students", value: "STUDENT" },
    { label: "Employers", value: "EMPLOYER" },
    { label: "Admins", value: "ADMIN" },
];

const roleStyles = {
    STUDENT: "bg-violet-100 text-violet-700",
    EMPLOYER: "bg-blue-100 text-blue-700",
    ADMIN: "bg-amber-100 text-amber-700",
};

const formatDate = (date) => {
    if (!date) return "—";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return "—";

    return parsedDate.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
};

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [role, setRole] = useState("ALL");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const loadUsers = useCallback(async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getAdminUsers({ search, role });

            setUsers(Array.isArray(data) ? data : []);
        } catch (err) {
            setError(
                err?.message || "Unable to load user accounts."
            );
        } finally {
            setLoading(false);
        }
    }, [search, role]);

    useEffect(() => {
        loadUsers();
    }, [loadUsers]);

    const studentCount = users.filter(
        (user) => user.role === "STUDENT"
    ).length;

    const employerCount = users.filter(
        (user) => user.role === "EMPLOYER"
    ).length;

    const adminCount = users.filter(
        (user) => user.role === "ADMIN"
    ).length;

    const getRoleIcon = (userRole) => {
        if (userRole === "STUDENT") return GraduationCap;
        if (userRole === "EMPLOYER") return Building2;
        return ShieldCheck;
    };

    return (
        <div className="min-h-screen bg-[#f8f7fc] text-gray-800">
            <div className="flex min-h-screen">
                {/* Desktop sidebar */}
                <aside className="hidden lg:block">
                    <AdminSidebar />
                </aside>

                {/* Mobile sidebar */}
                {sidebarOpen && (
                    <div className="fixed inset-0 z-[100] flex lg:hidden">
                        <button
                            type="button"
                            aria-label="Close navigation"
                            onClick={() => setSidebarOpen(false)}
                            className="absolute inset-0 bg-slate-950/50"
                        />

                        <div className="relative z-10 h-full">
                            <AdminSidebar
                                onClose={() => setSidebarOpen(false)}
                            />
                        </div>
                    </div>
                )}

                <main className="min-w-0 flex-1">
                    <AdminNavbar
                        onMenuClick={() => setSidebarOpen(true)}
                    />

                    <div className="mx-auto max-w-[1600px] space-y-6 !px-4 !py-6 sm:px-6 md:px-8">

                        {/* Page heading */}
                        <section className="flex flex-wrap items-center justify-between gap-4">
                            <div>
                                <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-purple-600">
                                    <ShieldCheck size={15} />
                                    Administration
                                </div>

                                <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
                                    User Management
                                </h1>

                                <p className="mt-2 max-w-xl text-sm leading-6 text-gray-500">
                                    Search registered accounts and review
                                    student, employer, and administrator
                                    information.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={loadUsers}
                                disabled={loading}
                                className="inline-flex items-center gap-2 rounded-xl border border-purple-200 bg-white !px-4 !py-3 text-sm font-bold text-purple-700 shadow-sm transition hover:bg-purple-50 disabled:opacity-60"
                            >
                                <RefreshCw
                                    size={16}
                                    className={loading ? "animate-spin" : ""}
                                />
                                Refresh
                            </button>
                        </section>

                        {/* Summary cards */}
                        <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                            <SummaryCard
                                title="Students"
                                count={studentCount}
                                icon={GraduationCap}
                                color="bg-violet-100 text-violet-700"
                            />

                            <SummaryCard
                                title="Employers"
                                count={employerCount}
                                icon={Building2}
                                color="bg-blue-100 text-blue-700"
                            />

                            <SummaryCard
                                title="Administrators"
                                count={adminCount}
                                icon={ShieldCheck}
                                color="bg-amber-100 text-amber-700"
                            />
                        </section>

                        {/* User list */}
                        <section className="overflow-hidden rounded-2xl border border-purple-100 bg-white shadow-sm">

                            {/* Table heading */}
                            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 !p-5 sm:p-6">
                                <div className="flex items-center gap-3">
                                    <div className="rounded-xl bg-purple-100 !p-3 text-purple-700">
                                        <Users size={22} />
                                    </div>

                                    <div>
                                        <h2 className="font-extrabold text-gray-900">
                                            Registered accounts
                                        </h2>
                                        <p className="mt-1 text-xs text-gray-500">
                                            {loading
                                                ? "Loading accounts..."
                                                : `${users.length} matching account${users.length === 1 ? "" : "s"}`}
                                        </p>
                                    </div>
                                </div>

                                <span className="rounded-full bg-purple-50 !px-3 !py-1.5 text-xs font-bold text-purple-700">
                                    Admin view
                                </span>
                            </div>

                            {/* Search and filter */}
                            <div className="grid grid-cols-1 gap-3 border-b border-gray-100 bg-[#fcfbff] !p-4 sm:grid-cols-[1fr_220px] sm:p-5">
                                <div className="relative">
                                    <Search
                                        size={18}
                                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                                    />

                                    <input
                                        type="search"
                                        value={search}
                                        onChange={(event) =>
                                            setSearch(event.target.value)
                                        }
                                        placeholder="Search by name or email..."
                                        className="w-full rounded-xl border border-gray-200 bg-white !py-3 !pl-10 !pr-4 text-sm outline-none transition placeholder:text-gray-400 focus:border-purple-400 focus:ring-4 focus:ring-purple-100"
                                    />
                                </div>

                                <div className="relative">
                                    <SlidersHorizontal
                                        size={16}
                                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                                    />

                                    <select
                                        value={role}
                                        onChange={(event) =>
                                            setRole(event.target.value)
                                        }
                                        className="w-full appearance-none rounded-xl border border-gray-200 bg-white !py-3 !pl-10 !pr-4 text-sm font-semibold text-gray-700 outline-none transition focus:border-purple-400 focus:ring-4 focus:ring-purple-100"
                                    >
                                        {ROLE_FILTERS.map((filter) => (
                                            <option
                                                key={filter.value}
                                                value={filter.value}
                                            >
                                                {filter.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Error */}
                            {error && (
                                <div
                                    role="alert"
                                    className="m-4 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 !p-4 text-sm text-red-700"
                                >
                                    <AlertCircle
                                        size={19}
                                        className="mt-0.5 shrink-0"
                                    />

                                    <div className="flex-1">
                                        <p className="font-bold">
                                            Could not load users
                                        </p>
                                        <p className="mt-1">{error}</p>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={loadUsers}
                                        className="font-bold underline"
                                    >
                                        Retry
                                    </button>
                                </div>
                            )}

                            {/* Loading */}
                            {loading && users.length === 0 && !error && (
                                <div className="flex flex-col items-center justify-center gap-3 !px-6 !py-16">
                                    <LoaderCircle
                                        size={32}
                                        className="animate-spin text-purple-600"
                                    />
                                    <p className="text-sm text-gray-500">
                                        Loading user accounts...
                                    </p>
                                </div>
                            )}

                            {/* Empty state */}
                            {!loading && !error && users.length === 0 && (
                                <div className="flex flex-col items-center !px-6 !py-16 text-center">
                                    <div className="rounded-2xl bg-purple-50 !p-4 text-purple-500">
                                        <UserRound size={32} />
                                    </div>

                                    <h3 className="mt-4 font-bold text-gray-900">
                                        No users found
                                    </h3>

                                    <p className="mt-2 max-w-sm text-sm leading-6 text-gray-500">
                                        Try a different search term or change
                                        the role filter.
                                    </p>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSearch("");
                                            setRole("ALL");
                                        }}
                                        className="mt-4 rounded-xl bg-purple-100 !px-4 !py-2.5 text-sm font-bold text-purple-700 hover:bg-purple-200"
                                    >
                                        Clear filters
                                    </button>
                                </div>
                            )}

                            {/* Desktop table */}
                            {users.length > 0 && (
                                <div className="overflow-x-auto">
                                    <table className="w-full min-w-[850px] text-left">
                                        <thead className="bg-gray-50/80">
                                            <tr className="text-xs uppercase tracking-wider text-gray-500">
                                                <th className="!px-6 !py-4 font-bold">
                                                    User
                                                </th>
                                                <th className="!px-6 !py-4 font-bold">
                                                    Role
                                                </th>
                                                <th className="!px-6 !py-4 font-bold">
                                                    Contact
                                                </th>
                                                <th className="!px-6 !py-4 font-bold">
                                                    Location
                                                </th>
                                                <th className="!px-6 !py-4 font-bold">
                                                    Registered
                                                </th>
                                                <th className="!px-6 !py-4 font-bold text-right">
                                                    Details
                                                </th>
                                            </tr>
                                        </thead>

                                        <tbody className="divide-y divide-gray-100">
                                            {users.map((user) => {
                                                const RoleIcon = getRoleIcon(
                                                    user.role
                                                );

                                                return (
                                                    <tr
                                                        key={user.id}
                                                        className="transition hover:bg-purple-50/40"
                                                    >
                                                        <td className="!px-6 !py-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-100 to-violet-200 font-extrabold text-purple-700">
                                                                    {(user.name || "U")
                                                                        .trim()
                                                                        .charAt(0)
                                                                        .toUpperCase()}
                                                                </div>

                                                                <div className="min-w-0">
                                                                    <p className="max-w-[220px] truncate text-sm font-bold text-gray-900">
                                                                        {user.name || "Unnamed user"}
                                                                    </p>
                                                                    <p className="mt-1 text-xs text-gray-400">
                                                                        ID: {user.id}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </td>

                                                        <td className="!px-6 !py-4">
                                                            <span
                                                                className={`inline-flex items-center gap-1.5 rounded-full !px-3 !py-1.5 text-xs font-bold ${
                                                                    roleStyles[user.role] ||
                                                                    "bg-gray-100 text-gray-700"
                                                                }`}
                                                            >
                                                                <RoleIcon size={14} />
                                                                {user.role || "UNKNOWN"}
                                                            </span>
                                                        </td>

                                                        <td className="!px-6 !py-4">
                                                            <div className="space-y-2">
                                                                <p className="flex items-center gap-2 text-sm text-gray-700">
                                                                    <Mail
                                                                        size={14}
                                                                        className="shrink-0 text-gray-400"
                                                                    />
                                                                    <span className="max-w-[230px] truncate">
                                                                        {user.email || "—"}
                                                                    </span>
                                                                </p>

                                                                <p className="flex items-center gap-2 text-xs text-gray-500">
                                                                    <Phone
                                                                        size={13}
                                                                        className="shrink-0 text-gray-400"
                                                                    />
                                                                    {user.phone || "Not provided"}
                                                                </p>
                                                            </div>
                                                        </td>

                                                        <td className="!px-6 !py-4">
                                                            <p className="flex max-w-[160px] items-center gap-2 text-sm text-gray-600">
                                                                <MapPin
                                                                    size={14}
                                                                    className="shrink-0 text-gray-400"
                                                                />
                                                                <span className="truncate">
                                                                    {user.location || "Not provided"}
                                                                </span>
                                                            </p>
                                                        </td>

                                                        <td className="!px-6 !py-4">
                                                            <p className="flex items-center gap-2 whitespace-nowrap text-sm text-gray-600">
                                                                <CalendarDays
                                                                    size={15}
                                                                    className="text-gray-400"
                                                                />
                                                                {formatDate(user.createdAt)}
                                                            </p>
                                                        </td>

                                                        <td className="!px-6 !py-4 text-right">
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    setSelectedUser(user)
                                                                }
                                                                className="rounded-lg border border-purple-200 !px-3 !py-2 text-xs font-bold text-purple-700 transition hover:bg-purple-100"
                                                            >
                                                                View details
                                                            </button>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {loading && users.length > 0 && (
                                <div className="flex items-center justify-center gap-2 border-t border-gray-100 bg-purple-50/50 !py-3 text-xs font-semibold text-purple-700">
                                    <LoaderCircle
                                        size={15}
                                        className="animate-spin"
                                    />
                                    Updating results...
                                </div>
                            )}
                        </section>

                        <footer className="!pb-3 text-center text-xs text-gray-400">
                            CareerTrack Admin Console · User Management
                        </footer>
                    </div>
                </main>
            </div>

            {/* User details modal */}
            {selectedUser && (
                <div
                    className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-950/50 !p-4 backdrop-blur-sm"
                    onClick={() => setSelectedUser(null)}
                >
                    <section
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="user-details-title"
                        className="w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className="relative overflow-hidden bg-gradient-to-br from-[#4c1d95] to-[#8b5cf6] !px-6 !py-7 text-white">
                            <button
                                type="button"
                                aria-label="Close user details"
                                onClick={() => setSelectedUser(null)}
                                className="absolute right-4 top-4 rounded-lg !p-2 text-white/80 hover:bg-white/15 hover:text-white"
                            >
                                <span className="text-lg">×</span>
                            </button>

                            <div className="flex items-center gap-4">
                                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/20 bg-white/15 text-2xl font-extrabold">
                                    {(selectedUser.name || "U")
                                        .trim()
                                        .charAt(0)
                                        .toUpperCase()}
                                </div>

                                <div className="min-w-0">
                                    <p className="text-xs font-bold uppercase tracking-widest text-purple-200">
                                        Account details
                                    </p>

                                    <h2
                                        id="user-details-title"
                                        className="mt-1 break-words text-xl font-extrabold"
                                    >
                                        {selectedUser.name || "Unnamed user"}
                                    </h2>

                                    <p className="mt-1 text-sm text-purple-100">
                                        User ID: {selectedUser.id}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 !p-6">
                            <DetailRow
                                icon={ShieldCheck}
                                label="Account role"
                                value={selectedUser.role || "Unknown"}
                            />

                            <DetailRow
                                icon={Mail}
                                label="Email address"
                                value={selectedUser.email || "Not provided"}
                            />

                            <DetailRow
                                icon={Phone}
                                label="Phone number"
                                value={selectedUser.phone || "Not provided"}
                            />

                            <DetailRow
                                icon={MapPin}
                                label="Location"
                                value={selectedUser.location || "Not provided"}
                            />

                            <DetailRow
                                icon={CalendarDays}
                                label="Registration date"
                                value={formatDate(selectedUser.createdAt)}
                            />

                            <button
                                type="button"
                                onClick={() => setSelectedUser(null)}
                                className="mt-3 w-full rounded-xl bg-purple-700 !py-3 text-sm font-bold text-white transition hover:bg-purple-800"
                            >
                                Close details
                            </button>
                        </div>
                    </section>
                </div>
            )}
        </div>
    );
};

const SummaryCard = ({ title, count, icon: Icon, color }) => (
    <article className="rounded-2xl border border-purple-100 bg-white !p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
        <div className="flex items-center justify-between gap-3">
            <div>
                <p className="text-sm font-semibold text-gray-500">
                    {title}
                </p>

                <p className="mt-3 text-3xl font-extrabold tracking-tight text-gray-900">
                    {count.toLocaleString("en-IN")}
                </p>
            </div>

            <div className={`rounded-2xl p-3 ${color}`}>
                <Icon size={23} />
            </div>
        </div>
    </article>
);

const DetailRow = ({ icon: Icon, label, value }) => (
    <div className="flex items-start gap-3">
        <div className="rounded-lg bg-purple-50 !p-2 text-purple-700">
            <Icon size={17} />
        </div>

        <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-gray-400">{label}</p>
            <p className="mt-1 break-words text-sm font-semibold text-gray-800">
                {value}
            </p>
        </div>
    </div>
);

export default AdminUsers;
