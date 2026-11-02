import { useEffect, useState } from "react";
import { Bell, User } from "lucide-react";
import { getEmployerProfile, getEmployerProfileImage } from "../../services/employerService";
import NotificationBell from "../Notification/NotificationBell";

const EmployerProfileHeader = () => {

    const [user, setUser] = useState(null);
    const [profileImage, setProfileImage] = useState(null);

    useEffect(() => {
        loadEmployer();
    }, []);

    const loadEmployer = async () => {
        try {
            // Get real logged-in employer data
            const storedUser = localStorage.getItem("careertrack_user");

            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }

            // Get latest profile data from backend
            const profile = await getEmployerProfile();

            setUser(previous => ({
                ...previous,
                ...profile
            }));

            // Get profile image from MySQL BLOB
            try {
                const imageUrl = await getEmployerProfileImage();
                setProfileImage(imageUrl);
            } catch (imageError) {
                console.log("No profile image found.");
                setProfileImage(null);
            }

        } catch (error) {
            console.error(
                "FAILED TO LOAD EMPLOYER HEADER:",
                error
            );
        }
    };

    const employerName = user?.name || "Employer";
    const designation = user?.designation || "Employer";

    return (
        <div className="flex items-center gap-8">

            {/* Notification */}

            <div>
                <NotificationBell />
            </div>
            <button
                type="button"
                className="
                    relative
                    flex
                    items-center
                    justify-center
                    w-10
                    h-10
                    text-slate-700
                    hover:text-purple-600
                    transition
                "
            >
                <Bell
                    size={26}
                    strokeWidth={2}
                />

                {/* Notification dot */}
                <span
                    className="
                        absolute
                        top-1
                        right-1
                        w-2
                        h-2
                        bg-purple-600
                        rounded-full
                    "
                />
            </button>

            {/* Employer information */}
            <div className="flex items-center gap-4">

                {/* Profile image */}
                <div
                    className="
                        w-14
                        h-14
                        rounded-full
                        overflow-hidden
                        bg-purple-100
                        flex
                        items-center
                        justify-center
                        border-2
                        border-purple-100
                    "
                >

                    {profileImage ? (

                        <img
                            src={profileImage}
                            alt={employerName}
                            className="w-full h-full object-cover"
                        />

                    ) : (

                        <User
                            size={28}
                            className="text-purple-500"
                        />

                    )}

                </div>

                {/* Name and designation */}
                <div className="flex flex-col">

                    <h3
                        className="
                            text-lg
                            font-semibold
                            text-slate-700
                            leading-tight
                        "
                    >
                        {employerName}
                    </h3>

                    <p
                        className="
                            text-sm
                            text-slate-400
                            mt-1
                        "
                    >
                        {designation}
                    </p>

                </div>

            </div>

        </div>
    );
};

export default EmployerProfileHeader;