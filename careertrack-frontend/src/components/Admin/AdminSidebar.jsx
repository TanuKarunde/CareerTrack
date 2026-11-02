import { NavLink } from "react-router-dom";
import {
    LayoutDashboard,
    Users,
    Building2,
    BriefcaseBusiness,
    ChartNoAxesCombined,
    ShieldCheck,
    GraduationCap,
    PanelLeftClose,
    Megaphone,
} from "lucide-react";

const navigation = [
    {
        title: "OVERVIEW",
        items: [
            {
                label: "Dashboard",
                path: "/admin/dashboard",
                icon: LayoutDashboard,
            },
        ],
    },
    {
        title: "MANAGEMENT",
        items: [
            {
                label: "Users",
                path: "/admin/users",
                icon: Users,
            },
            {
                label: "Companies",
                path: "/admin/companies",
                icon: Building2,
            },
            {
                label: "Job Moderation",
                path: "/admin/jobs",
                icon: BriefcaseBusiness,
            },
            {
                label: "Analytics",
                path: "/admin/analytics",
                icon: ChartNoAxesCombined,
            },
            {
                label: "Announcements",
                path: "/admin/announcements",
                icon: Megaphone,
            }
        ],
    },
];

const AdminSidebar = ({ onClose }) => {
    return (
        <aside className="sticky top-0 flex h-screen w-[258px]
            shrink-0 flex-col border-r border-purple-100
            bg-[#0A1931] !px-4 !py-5 ">

            <div className="flex items-center justify-between !px-2">
                <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center
                        justify-center rounded-2xl bg-purple-700
                        text-white ">
                        <GraduationCap size={25} />
                    </div>

                    <div>
                        <h1 className="text-lg font-extrabold
                            tracking-tight text-white">
                            CareerTrack
                        </h1>
                        <p className="text-[10px] font-bold
                            tracking-[0.2em] text-purple-600">
                            ADMIN CONSOLE
                        </p>
                    </div>
                </div>

                {onClose && (
                    <button
                        onClick={onClose}
                        className="rounded-lg !p-2 text-gray-500
                            hover:bg-purple-50 lg:hidden"
                        aria-label="Close sidebar"
                    >
                        <PanelLeftClose size={20} />
                    </button>
                )}
            </div>

            <div className="my-7 h-px bg-purple-100" />

            <nav className="flex-1 space-y-7 overflow-y-auto">
                {navigation.map((group) => (
                    <div key={group.title}>
                        <p className="mb-3 !px-3 text-[10px]
                            font-extrabold tracking-[0.18em]
                            text-gray-400">
                            {group.title}
                        </p>

                        <div className="space-y-1.5">
                            {group.items.map((item) => {
                                const Icon = item.icon;

                                return (
                                    <NavLink
                                        key={item.path}
                                        to={item.path}
                                        onClick={onClose}
                                        className={({ isActive }) =>
                                            `group flex items-center gap-3
                                            rounded-xl !px-3 !py-3 text-sm
                                            font-semibold transition-all
                                            duration-200 ${isActive
                                                ? "bg-purple-700 text-white shadow-md shadow-purple-200"
                                                : "text-gray-500 hover:bg-purple-100 hover:text-purple-700"
                                            }`
                                        }
                                    >
                                        <Icon size={19} />
                                        <span>{item.label}</span>
                                    </NavLink>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </nav>

            <div className="mt-5 rounded-2xl border border-purple-100
                bg-gradient-to-br from-purple-50 to-white !p-4">
                <div className="mb-2 flex items-center gap-2">
                    <ShieldCheck size={19} className="text-purple-700" />
                    <span className="text-sm font-bold text-gray-800">
                        Admin access
                    </span>
                </div>

                <p className="text-xs leading-5 text-gray-500">
                    Manage users, recruitment activity and platform
                    performance from one place.
                </p>
            </div>
        </aside>
    );
};

export default AdminSidebar;