import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    BriefcaseBusiness,
    MessageCircle,
    UserRound,
    ChevronDown,
    Building2,
    Settings,
    LogOut,
    LayoutDashboard,
} from "lucide-react";

import NotificationBell from "../../../components/Notification/NotificationBell";

const EmployerNavbar = () => {
    const navigate = useNavigate();

    const [user, setUser] = useState({});
    const [profileOpen, setProfileOpen] = useState(false);

    useEffect(() => {
        try {
            const storedUser =
                localStorage.getItem("careertrack_user") ||
                localStorage.getItem("user");

            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
        } catch (error) {
            console.error("Unable to load employer details:", error);
        }
    }, []);

    const userName =
        user.fullName ||
        user.name ||
        user.username ||
        user.firstName ||
        "Employer";

    const initials = userName
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0].toUpperCase())
        .join("");

    const handleLogout = () => {
        setProfileOpen(false);

        localStorage.removeItem("token");
        localStorage.removeItem("careertrack_user");
        localStorage.removeItem("user");
        localStorage.removeItem("role");

        navigate("/login", { replace: true });
    };

    return (
        <header className="relative z-30 w-full border-b border-violet-100 bg-white/95 backdrop-blur-xl">
            <nav className="flex h-[76px] w-full items-center justify-between !px-4 sm:!px-6 lg:!px-8">

                {/* Brand */}
                <Link
                    to="/employer/dashboard"
                    className="flex min-w-0 shrink-0 items-center gap-3"
                >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                        <BriefcaseBusiness size={28} strokeWidth={2.2} />
                    </div>

                    <div className="min-w-0">
                        <h1 className="text-xl font-extrabold tracking-tight text-gray-900 sm:text-2xl">
                            Career<span className="text-violet-600">Track</span>
                        </h1>
                        <p className="hidden text-[11px] font-medium text-gray-500 sm:block">
                            Find Talent. Build Teams.
                        </p>
                    </div>
                </Link>

                {/* Right-side actions */}
                <div className="flex shrink-0 items-center gap-1 sm:gap-3">

                    {/* Employer dashboard shortcut */}
                    <button
                        type="button"
                        onClick={() => navigate("/employer/dashboard")}
                        aria-label="Employer dashboard"
                        title="Dashboard"
                        className="flex h-10 w-10 items-center justify-center rounded-xl text-gray-600 transition hover:bg-violet-50 hover:text-violet-700 sm:h-11 sm:w-11"
                    >
                        <LayoutDashboard size={21} />
                    </button>

                    {/* Messages */}
                    {/* <button
                        type="button"
                        onClick={() => navigate("/employer/messages")}
                        aria-label="Messages"
                        title="Messages"
                        className="flex h-10 w-10 items-center justify-center rounded-xl text-gray-600 transition hover:bg-violet-50 hover:text-violet-700 sm:h-11 sm:w-11"
                    >
                        <MessageCircle size={21} />
                    </button> */}

                    {/* Notifications */}
                    <NotificationBell />

                    {/* Profile */}
                    <div className="relative ml-1 border-l border-gray-200 !pl-3 sm:ml-2 sm:!pl-5">
                        <button
                            type="button"
                            onClick={() => setProfileOpen((open) => !open)}
                            aria-expanded={profileOpen}
                            aria-label="Open employer profile menu"
                            className="flex items-center gap-2 sm:gap-3"
                        >
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-purple-800 text-sm font-bold text-white ring-2 ring-violet-100">
                                {initials || <UserRound size={20} />}
                            </div>

                            <div className="hidden text-left sm:block">
                                <p className="max-w-32 truncate text-sm font-semibold text-gray-800">
                                    {userName}
                                </p>
                                <p className="text-xs text-violet-600">
                                    Employer
                                </p>
                            </div>

                            <ChevronDown
                                size={16}
                                className={`hidden text-gray-500 transition-transform sm:block ${
                                    profileOpen ? "rotate-180" : ""
                                }`}
                            />
                        </button>

                        {profileOpen && (
                            <div className="absolute right-0 top-14 z-50 w-56 overflow-hidden rounded-2xl border border-violet-100 bg-white !py-2 shadow-xl shadow-violet-100/50">

                                <div className="border-b border-gray-100 !px-4 !py-3">
                                    <p className="truncate text-sm font-semibold text-gray-800">
                                        {userName}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        Employer Account
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => {
                                        setProfileOpen(false);
                                        navigate("/employer/profile");
                                    }}
                                    className="flex w-full items-center gap-3 !px-4 !py-3 text-left text-sm text-gray-700 transition hover:bg-violet-50 hover:text-violet-700"
                                >
                                    <Building2 size={17} />
                                    Profile
                                </button>

                                {/* <button
                                    type="button"
                                    onClick={() => {
                                        setProfileOpen(false);
                                        navigate("/employer/settings");
                                    }}
                                    className="flex w-full items-center gap-3 !px-4 !py-3 text-left text-sm text-gray-700 transition hover:bg-violet-50 hover:text-violet-700"
                                >
                                    <Settings size={17} />
                                    Settings
                                </button> */}

                                <div className="my-1 border-t border-gray-100" />

                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    className="flex w-full items-center gap-3 !px-4 !py-3 text-left text-sm text-red-600 transition hover:bg-red-50"
                                >
                                    <LogOut size={17} />
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default EmployerNavbar;