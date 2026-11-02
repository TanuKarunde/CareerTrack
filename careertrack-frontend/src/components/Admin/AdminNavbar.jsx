
import {
    Bell,
    Menu,
    Search,
    ShieldCheck,
    Sparkles,
    ChevronDown,
    CircleCheck,
} from "lucide-react";

const AdminNavbar = ({ onMenuClick }) => {
    return (
        <header className="sticky top-0 z-30 w-full border-b border-purple-100/80 bg-white/90 backdrop-blur-2xl">

            {/* Subtle top accent */}
            <div className="h-[3px] w-full bg-gradient-to-r from-violet-600 via-purple-500 to-fuchsia-400" />

            <div className="flex min-h-[76px] items-center justify-between gap-3 !px-4 !py-3 sm:px-6 lg:px-8">

                {/* LEFT SECTION */}
                <div className="flex min-w-0 items-center gap-3 sm:gap-4">

                    {/* Mobile Sidebar Toggle */}
                    <button
                        type="button"
                        onClick={onMenuClick}
                        aria-label="Open sidebar"
                        className="group flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-purple-100 bg-white text-purple-700 shadow-sm transition-all duration-200 hover:border-purple-300 hover:bg-purple-50 hover:shadow-md active:scale-95 lg:hidden"
                    >
                        <Menu
                            size={20}
                            className="transition-transform group-hover:scale-110"
                        />
                    </button>

                    {/* Brand / Page Title */}
                    <div className="flex min-w-0 items-center gap-3">

                        <div className="relative hidden h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 text-white shadow-lg shadow-purple-200/70 sm:flex">
                            <ShieldCheck size={23} strokeWidth={2.2} />

                            <span className="absolute right-1 top-1 h-2 w-2 rounded-full border border-white bg-emerald-300" />
                        </div>

                        <div className="min-w-0">
                            <div className="mb-1 flex items-center gap-2">
                                <span className="truncate text-[10px] font-bold uppercase tracking-[0.17em] text-purple-600 sm:text-[11px]">
                                    CareerTrack
                                </span>

                                <span className="hidden h-1 w-1 rounded-full bg-purple-300 sm:block" />

                                <span className="hidden text-[10px] font-medium text-gray-400 sm:inline">
                                    Administration
                                </span>
                            </div>

                            <div className="flex items-center gap-2">
                                <h2 className="truncate text-base font-extrabold tracking-tight text-gray-900 sm:text-xl">
                                    Admin Workspace
                                </h2>

                                <span className="hidden items-center gap-1 rounded-full border border-emerald-100 bg-emerald-50 !px-2 !py-0.5 text-[9px] font-bold text-emerald-700 md:inline-flex">
                                    <CircleCheck size={11} />
                                    ADMIN
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT SECTION */}
                <div className="flex shrink-0 items-center gap-2 sm:gap-3">

                    {/* Platform Overview */}
                    <div className="hidden items-center gap-2.5 rounded-2xl border border-purple-100/80 bg-gradient-to-r from-purple-50/90 to-white !px-3.5 !py-2.5 transition hover:border-purple-200 hover:shadow-sm md:flex">
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white text-purple-600 shadow-sm ring-1 ring-purple-100">
                            <Sparkles size={16} />
                        </div>

                        <div>
                            <p className="text-[10px] font-medium text-gray-400">
                                Workspace
                            </p>
                            <p className="text-xs font-bold text-gray-800">
                                Platform Overview
                            </p>
                        </div>
                    </div>

                    {/* Search Shortcut */}
                    <button
                        type="button"
                        title="Platform overview"
                        aria-label="Platform overview"
                        className="hidden h-10 w-10 items-center justify-center rounded-xl border border-purple-100 bg-white text-gray-500 transition hover:border-purple-200 hover:bg-purple-50 hover:text-purple-700 sm:flex md:hidden"
                    >
                        <Search size={18} />
                    </button>

                    {/* Notifications */}
                    <button
                        type="button"
                        aria-label="Notifications"
                        title="Notifications"
                        className="group relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-purple-100 bg-white text-gray-600 shadow-sm transition-all duration-200 hover:border-purple-200 hover:bg-purple-50 hover:text-purple-700 hover:shadow-md active:scale-95"
                    >
                        <Bell
                            size={19}
                            className="transition-transform duration-200 group-hover:-rotate-12"
                        />

                        <span className="absolute right-[9px] top-[8px] h-2 w-2 rounded-full border-2 border-white bg-fuchsia-500" />
                    </button>

                    {/* Administrator Profile */}
                    <button
                        type="button"
                        title="Administrator profile"
                        className="group flex shrink-0 items-center gap-2 rounded-2xl border border-purple-100 bg-white !p-1.5 !pr-2.5 shadow-sm transition-all duration-200 hover:border-purple-200 hover:bg-purple-50/70 hover:shadow-md sm:gap-3 sm:pr-3"
                    >
                        <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-purple-800 text-white shadow-md shadow-purple-200 transition-transform duration-200 group-hover:scale-105">
                            <ShieldCheck size={19} />

                            <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-400" />
                        </div>

                        <div className="hidden text-left sm:block">
                            <p className="text-xs font-extrabold text-gray-800">
                                Administrator
                            </p>
                            <p className="mt-0.5 text-[10px] font-medium text-purple-600">
                                Platform Admin
                            </p>
                        </div>

                        <ChevronDown
                            size={14}
                            className="hidden text-gray-400 transition-transform group-hover:text-purple-600 sm:block"
                        />
                    </button>

                </div>
            </div>
        </header>
    );
};

export default AdminNavbar;
