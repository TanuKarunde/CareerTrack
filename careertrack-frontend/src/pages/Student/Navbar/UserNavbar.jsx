
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  BriefcaseBusiness,
  Bell,
  MessageCircle,
  UserRound,
  ChevronDown,
} from "lucide-react";
import { getUnreadNotificationCount } from "../../../services/notificationService";
import NotificationBell from "../../../components/Notification/NotificationBell";



const UserNavbar = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState({});
  const [unreadCount, setUnreadCount] = useState(0);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    // Read the logged-in user's details
    try {
      const storedUser =
        localStorage.getItem("careertrack_user") ||
        localStorage.getItem("user");

      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Unable to load user details:", error);
    }

    // Load unread notification count
    const loadUnreadCount = async () => {
      try {
        const count = await getUnreadNotificationCount();
        setUnreadCount(Number(count) || 0);
      } catch (error) {
        console.error("Unable to load notifications:", error);
      }
    };

    loadUnreadCount();
  }, []);

  const userName =
    user.fullName ||
    user.name ||
    user.username ||
    user.firstName ||
    "Student";

  const initials = userName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");

  return (
    <header className="sticky top-0 z-50 w-full border-b border-purple-100 bg-white">
      <nav className="mx-auto flex h-[76px] max-w-[1600px] items-center justify-between !px-4 sm:px-6 lg:px-10">

        {/* Logo and brand */}
        <Link
          to="/student/dashboard"
          className="flex shrink-0 items-center gap-3"
        >
          <div className="flex h-11 w-11 items-center justify-center bg-gradient-to-br text-violet-500 ">
            <BriefcaseBusiness size={40} strokeWidth={2.2} />
          </div>

          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-gray-900 sm:text-2xl">
              Career<span className="text-violet-600">Track</span>
            </h1>
            <p className="hidden text-[11px] font-medium text-gray-500 sm:block">
              Track. Prepare. Get Hired.
            </p>
          </div>
        </Link>

        {/* Right side actions */}
        <div className="flex items-center gap-2 sm:gap-4">

          {/* Messages */}
          <button
            type="button"
            onClick={() => navigate("/student/chat")}
            aria-label="Messages"
            title="Messages"
            className="relative flex h-10 w-10 items-center justify-center rounded-xl text-gray-600 transition hover:bg-purple-50 hover:text-violet-700 sm:h-11 sm:w-11"
          >
            <MessageCircle size={22} />
          </button>

          <NotificationBell/>

          {/* Profile */}
          <div className="relative ml-1 border-l border-gray-200 !pl-3 sm:ml-2 sm:pl-5">
            <button
              type="button"
              onClick={() => setProfileOpen((open) => !open)}
              aria-expanded={profileOpen}
              className="flex items-center gap-2 sm:gap-3"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-purple-800 text-sm font-bold text-white ring-2 ring-purple-100">
                {initials || <UserRound size={20} />}
              </div>

              <div className="hidden text-left sm:block">
                <p className="max-w-32 truncate text-sm font-semibold text-gray-800">
                  {userName}
                </p>
              </div>

              <ChevronDown
                size={16}
                className="hidden text-gray-500 sm:block"
              />
            </button>

            {profileOpen && (
              <div className="absolute right-0 top-14 w-48 overflow-hidden rounded-xl border border-gray-100 bg-white py-2 shadow-xl">
                <button
                  type="button"
                  onClick={() => {
                    setProfileOpen(false);
                    navigate("/student/profile");
                  }}
                  className="w-full !px-4 !py-3 text-left text-sm text-gray-700 hover:bg-purple-50 hover:text-violet-700"
                >
                  My Profile
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default UserNavbar;
