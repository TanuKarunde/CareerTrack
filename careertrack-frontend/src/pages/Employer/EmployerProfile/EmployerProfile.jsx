
import { useEffect, useState } from "react";
import {
    User,
    Mail,
    Phone,
    BriefcaseBusiness,
    MapPin,
    Camera,
    Save,
    Loader2,
    Sparkles,
    ShieldCheck,
    CheckCircle2,
    CircleAlert,
    ImagePlus,
    ArrowUpRight,
    Building2,
    BadgeCheck
} from "lucide-react";

import {
    getEmployerProfile,
    getEmployerProfileImage,
    updateEmployerProfile,
    uploadEmployerProfileImage
} from "../../../services/employerService";

import Sidebar from "../../../components/Sidebar/Sidebar";
import EmployerNavbar from "../ENavbar/EmployerNavbar";

const EmployerProfile = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        designation: "",
        location: "",
        bio: ""
    });

    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(true);
    const [imageUploading, setImageUploading] = useState(false);
    const [saveStatus, setSaveStatus] = useState("idle");
    const [error, setError] = useState("");
    const [imageError, setImageError] = useState(false);

    useEffect(() => {
        let active = true;
        let temporaryImageUrl = null;

        const loadProfile = async () => {
            try {
                setLoading(true);
                setError("");

                const data = await getEmployerProfile();
                if (!active) return;

                setFormData({
                    name: data.name || "",
                    email: data.email || "",
                    phone: data.phone || "",
                    designation: data.designation || "",
                    location: data.location || "",
                    bio: data.bio || ""
                });

                if (data.profileImage) {
                    try {
                        const imageUrl = await getEmployerProfileImage();
                        if (active) {
                            setImagePreview(imageUrl);
                            setImageError(false);
                        }
                    } catch (imageLoadError) {
                        console.error("PROFILE IMAGE LOAD ERROR:", imageLoadError);
                        if (active) setImagePreview(null);
                    }
                } else if (active) {
                    setImagePreview(null);
                }
            } catch (err) {
                console.error("LOAD PROFILE ERROR:", err);
                if (active) {
                    setError(err.message || "Unable to load your profile.");
                }
            } finally {
                if (active) setLoading(false);
            }
        };

        loadProfile();

        return () => {
            active = false;
            if (temporaryImageUrl) URL.revokeObjectURL(temporaryImageUrl);
        };
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));

        setSaveStatus("idle");
        setError("");
    };

    const handleImageChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            setError("Please select a valid image file.");
            e.target.value = "";
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setError("Your profile image must be smaller than 5 MB.");
            e.target.value = "";
            return;
        }

        const previousImage = imagePreview;
        const temporaryUrl = URL.createObjectURL(file);

        try {
            setError("");
            setImageUploading(true);
            setImagePreview(temporaryUrl);
            setImageError(false);

            await uploadEmployerProfileImage(file);

            const imageUrl = await getEmployerProfileImage();
            setImagePreview(imageUrl);
            setImageError(false);
        } catch (err) {
            console.error("PROFILE IMAGE UPLOAD ERROR:", err);
            setImagePreview(previousImage);
            setError(err.message || "Failed to upload your profile image.");
        } finally {
            URL.revokeObjectURL(temporaryUrl);
            setImageUploading(false);
            e.target.value = "";
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (saveStatus === "saving") return;

        try {
            setSaveStatus("saving");
            setError("");

            const payload = {
                name: formData.name,
                phone: formData.phone,
                designation: formData.designation,
                location: formData.location,
                bio: formData.bio
            };

            const response = await updateEmployerProfile(payload);

            setFormData({
                name: response.name || "",
                email: response.email || formData.email,
                phone: response.phone || "",
                designation: response.designation || "",
                location: response.location || "",
                bio: response.bio || ""
            });

            if (response.profileImage) {
                try {
                    const imageUrl = await getEmployerProfileImage();
                    setImagePreview(imageUrl);
                    setImageError(false);
                } catch (imgErr) {
                    console.error("PROFILE IMAGE RELOAD ERROR:", imgErr);
                }
            }

            setSaveStatus("saved");
        } catch (err) {
            console.error("UPDATE PROFILE ERROR:", err);
            setSaveStatus("idle");
            setError(err.message || "Unable to update your profile.");
        }
    };

    const initials = formData.name
        ? formData.name
              .trim()
              .split(/\s+/)
              .slice(0, 2)
              .map((part) => part[0])
              .join("")
              .toUpperCase()
        : "EM";

    if (loading) {
        return (
            <div className="!min-h-screen !bg-[#f7f5ff] lg:!grid lg:!grid-cols-[250px_minmax(0,1fr)]">
                <aside className="!sticky !top-0 !z-30 !hidden !h-screen lg:!block">
                    <Sidebar />
                </aside>

                <main className="!flex !min-h-screen !min-w-0 !flex-col">
                    <EmployerNavbar />
                    <div className="!flex !flex-1 !items-center !justify-center !p-6">
                        <div className="!flex !items-center !gap-3 !rounded-2xl !border !border-purple-100 !bg-white !px-6 !py-5 !text-sm !font-semibold !text-purple-700 !shadow-lg !shadow-purple-100/50">
                            <Loader2 size={21} className="!animate-spin" />
                            Preparing your profile...
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="!min-h-screen !bg-[#f7f5ff] lg:!grid lg:!grid-cols-[250px_minmax(0,1fr)]">
            {/* STICKY EMPLOYER SIDEBAR */}
            <aside className="!sticky !top-0 !z-30 !hidden !h-screen lg:!block">
                <Sidebar />
            </aside>

            {/* MAIN CONTENT */}
            <main className="!min-w-0">
                {/* EMPLOYER NAVBAR */}
                <div className="!sticky !top-0 !z-20">
                    <EmployerNavbar />
                </div>

                <div className="!mx-auto !max-w-[1500px] !px-4 !py-5 sm:!px-6 sm:!py-7 xl:!px-9">
                    {/* HERO */}
                    <section className="!relative !mb-7 !overflow-hidden !rounded-[28px] !bg-gradient-to-br !from-[#291052] via-[#5125a4] !to-[#8a5cf6] !p-6 !text-white !shadow-xl !shadow-purple-200/60 sm:!p-8 lg:!p-9">
                        <div className="!pointer-events-none !absolute !-right-12 !-top-24 !h-72 !w-72 !rounded-full !border-[35px] !border-white/[0.07]" />
                        <div className="!pointer-events-none !absolute !-bottom-24 !right-1/4 !h-48 !w-48 !rounded-full !bg-fuchsia-300/10 !blur-2xl" />

                        <div className="!relative !flex !flex-col !justify-between !gap-6 md:!flex-row md:!items-center">
                            <div className="!max-w-2xl">
                                <div className="!mb-4 !inline-flex !items-center !gap-2 !rounded-full !border !border-white/15 !bg-white/10 !px-3.5 !py-2 !text-xs !font-bold !tracking-wide !text-purple-100 backdrop-blur">
                                    <Sparkles size={14} />
                                    CAREERTRACK · EMPLOYER SPACE
                                </div>

                                <h1 className="!text-3xl !font-black !tracking-tight sm:!text-4xl">
                                    Your professional
                                    <span className="!block !text-purple-200">identity, refined.</span>
                                </h1>

                                <p className="!mt-3 !max-w-xl !text-sm !leading-6 !text-purple-100 sm:!text-base">
                                    Keep your employer profile polished, build trust with candidates,
                                    and make every interaction count.
                                </p>
                            </div>

                            <div className="!flex !items-center !gap-3 !self-start !rounded-2xl !border !border-white/15 !bg-white/10 !p-4 backdrop-blur-md md:!self-auto">
                                <div className="!flex !h-11 !w-11 !items-center !justify-center !rounded-xl !bg-white/15">
                                    <ShieldCheck size={23} />
                                </div>
                                <div>
                                    <p className="!text-sm !font-extrabold">Profile settings</p>
                                    <p className="!mt-1 !text-xs !text-purple-100">Your details, your control</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* PAGE INTRO */}
                    <div className="!mb-6 !flex !flex-col !gap-3 sm:!flex-row sm:!items-end sm:!justify-between">
                        <div>
                            <p className="!mb-1 !text-xs !font-extrabold !uppercase !tracking-[0.18em] !text-purple-600">
                                Account settings
                            </p>
                            <h2 className="!text-2xl !font-black !tracking-tight !text-gray-900">
                                Employer Profile
                            </h2>
                            <p className="!mt-1.5 !text-sm !text-gray-500">
                                Manage your personal and professional details.
                            </p>
                        </div>

                        <div className="!inline-flex !w-fit !items-center !gap-2 !rounded-full !border !border-emerald-100 !bg-emerald-50 !px-3.5 !py-2 !text-xs !font-bold !text-emerald-700">
                            <BadgeCheck size={15} />
                            Personal account
                        </div>
                    </div>

                    {/* ERROR */}
                    {error && (
                        <div
                            role="alert"
                            className="!mb-6 !flex !items-start !gap-3 !rounded-2xl !border !border-rose-200 !bg-rose-50 !p-4 !text-sm !text-rose-700"
                        >
                            <CircleAlert size={19} className="!mt-0.5 !shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="!grid !grid-cols-1 !items-start !gap-6 xl:!grid-cols-[330px_minmax(0,1fr)]">
                        {/* PROFILE IDENTITY CARD */}
                        <section className="!overflow-hidden !rounded-[26px] !border !border-purple-100 !bg-white !shadow-lg !shadow-purple-100/40">
                            <div className="!relative !h-28 !overflow-hidden !bg-gradient-to-r !from-[#482080] !via-[#7042c6] !to-[#a78bfa]">
                                <div className="!absolute !-right-6 !-top-12 !h-40 !w-40 !rounded-full !border-[20px] !border-white/10" />
                                <div className="!absolute !-bottom-16 !left-6 !h-28 !w-28 !rounded-full !bg-white/10 !blur-xl" />
                            </div>

                            <div className="!px-6 !pb-6">
                                <div className="!relative !-mt-14 !mb-4 !flex !justify-center">
                                    <div className="!relative !h-28 !w-28 !rounded-[30px] !border-4 !border-white !bg-gradient-to-br !from-purple-100 !to-fuchsia-100 !p-1 !shadow-xl !shadow-purple-200/60">
                                        <div className="!flex !h-full !w-full !items-center !justify-center !overflow-hidden !rounded-[24px] !bg-white">
                                            {imagePreview && !imageError ? (
                                                <img
                                                    src={imagePreview}
                                                    alt="Employer profile"
                                                    className="!h-full !w-full !object-cover"
                                                    onError={() => setImageError(true)}
                                                />
                                            ) : (
                                                <div className="!flex !h-full !w-full !items-center !justify-center !bg-gradient-to-br !from-purple-100 !to-violet-50 !text-3xl !font-black !text-purple-700">
                                                    {initials}
                                                </div>
                                            )}
                                        </div>

                                        <label
                                            title="Upload profile photo"
                                            className="!absolute !-bottom-2 !-right-2 !flex !h-10 !w-10 !cursor-pointer !items-center !justify-center !rounded-xl !border-[3px] !border-white !bg-purple-700 !text-white !shadow-lg !transition hover:!scale-105 hover:!bg-purple-800"
                                        >
                                            {imageUploading ? (
                                                <Loader2 size={17} className="!animate-spin" />
                                            ) : (
                                                <Camera size={17} />
                                            )}

                                            <input
                                                type="file"
                                                accept="image/jpeg,image/png,image/webp"
                                                onChange={handleImageChange}
                                                className="!hidden"
                                                disabled={imageUploading}
                                            />
                                        </label>
                                    </div>
                                </div>

                                <div className="!text-center">
                                    <h3 className="!break-words !text-xl !font-black !text-gray-900">
                                        {formData.name || "Your name"}
                                    </h3>
                                    <p className="!mt-1 !text-sm !font-medium !text-purple-600">
                                        {formData.designation || "Employer"}
                                    </p>

                                    {formData.location && (
                                        <p className="!mt-2 !inline-flex !items-center !justify-center !gap-1.5 !text-xs !text-gray-500">
                                            <MapPin size={13} />
                                            {formData.location}
                                        </p>
                                    )}
                                </div>

                                <div className="!my-6 !h-px !bg-gradient-to-r !from-transparent !via-purple-100 !to-transparent" />

                                <div className="!space-y-4">
                                    <ProfileDetail icon={<Mail size={16} />} label="Email address" value={formData.email || "Not provided"} />
                                    <ProfileDetail icon={<BriefcaseBusiness size={16} />} label="Current designation" value={formData.designation || "Not provided"} />
                                    <ProfileDetail icon={<MapPin size={16} />} label="Location" value={formData.location || "Not provided"} />
                                </div>

                                <div className="!mt-6 !rounded-2xl !border !border-purple-100 !bg-gradient-to-br !from-purple-50 !to-fuchsia-50 !p-4">
                                    <div className="!mb-2 !flex !items-center !gap-2 !text-purple-700">
                                        <ImagePlus size={16} />
                                        <p className="!text-sm !font-extrabold">Profile photo</p>
                                    </div>
                                    <p className="!text-xs !leading-5 !text-gray-500">
                                        Use a clear professional image. JPG, PNG, or WEBP up to 5 MB.
                                    </p>
                                    {imageUploading && (
                                        <div className="!mt-3 !h-1.5 !overflow-hidden !rounded-full !bg-purple-100">
                                            <div className="!h-full !w-2/3 !animate-pulse !rounded-full !bg-purple-600" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </section>

                        {/* PERSONAL INFORMATION */}
                        <section className="!overflow-hidden !rounded-[26px] !border !border-gray-100 !bg-white !shadow-lg !shadow-purple-100/40">
                            <div className="!border-b !border-gray-100 !px-5 !py-5 sm:!px-7">
                                <div className="!flex !items-center !gap-3">
                                    <div className="!flex !h-12 !w-12 !shrink-0 !items-center !justify-center !rounded-2xl !bg-gradient-to-br !from-purple-100 !to-fuchsia-100 !text-purple-700">
                                        <User size={22} />
                                    </div>
                                    <div>
                                        <h3 className="!text-lg !font-black !text-gray-900">Personal information</h3>
                                        <p className="!mt-1 !text-xs !text-gray-500">Update the details associated with your account.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="!p-5 sm:!p-7">
                                <div className="!grid !grid-cols-1 !gap-x-5 !gap-y-5 md:!grid-cols-2">
                                    <FormField label="Full name" icon={<User size={17} />} required>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="Enter your full name"
                                            required
                                            className={inputClass}
                                        />
                                    </FormField>

                                    <FormField label="Email address" icon={<Mail size={17} />} hint="Your email cannot be changed here.">
                                        <input
                                            type="email"
                                            value={formData.email}
                                            disabled
                                            className={`${inputClass} !cursor-not-allowed !bg-gray-100 !text-gray-500`}
                                        />
                                    </FormField>

                                    <FormField label="Phone number" icon={<Phone size={17} />}>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            placeholder="Enter your phone number"
                                            className={inputClass}
                                        />
                                    </FormField>

                                    <FormField label="Designation" icon={<BriefcaseBusiness size={17} />}>
                                        <input
                                            type="text"
                                            name="designation"
                                            value={formData.designation}
                                            onChange={handleChange}
                                            placeholder="e.g. Talent Acquisition Manager"
                                            className={inputClass}
                                        />
                                    </FormField>

                                    <div className="md:!col-span-2">
                                        <FormField label="Location" icon={<MapPin size={17} />}>
                                            <input
                                                type="text"
                                                name="location"
                                                value={formData.location}
                                                onChange={handleChange}
                                                placeholder="e.g. Pune, Maharashtra"
                                                className={inputClass}
                                            />
                                        </FormField>
                                    </div>

                                    <div className="md:!col-span-2">
                                        <label htmlFor="employer-bio" className="!mb-2 !block !text-sm !font-bold !text-gray-700">
                                            Professional bio
                                        </label>
                                        <textarea
                                            id="employer-bio"
                                            name="bio"
                                            value={formData.bio}
                                            onChange={handleChange}
                                            rows={5}
                                            maxLength={1000}
                                            placeholder="Introduce yourself, describe your role, and share what you enjoy about building great teams..."
                                            className="!w-full !resize-y !rounded-xl !border !border-gray-200 !bg-gray-50/70 !px-4 !py-3 !text-sm !leading-6 !text-gray-800 !outline-none !transition placeholder:!text-gray-400 focus:!border-purple-400 focus:!bg-white focus:!ring-4 focus:!ring-purple-100"
                                        />
                                        <div className="!mt-1.5 !flex !justify-between !gap-3">
                                            <p className="!text-xs !text-gray-400">Make it personal and professional.</p>
                                            <p className="!text-xs !tabular-nums !text-gray-400">{formData.bio.length}/1000</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* SAVE FOOTER */}
                            <div className="!flex !flex-col !gap-4 !border-t !border-gray-100 !bg-gray-50/70 !px-5 !py-5 sm:!flex-row sm:!items-center sm:!justify-between sm:!px-7">
                                <div className="!flex !items-center !gap-2 !text-xs !text-gray-500">
                                    {saveStatus === "saved" ? (
                                        <>
                                            <CheckCircle2 size={16} className="!text-emerald-600" />
                                            <span className="!font-bold !text-emerald-700">Your changes have been saved.</span>
                                        </>
                                    ) : (
                                        <>
                                            <ShieldCheck size={16} className="!text-purple-600" />
                                            Your profile details are securely managed.
                                        </>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    disabled={saveStatus === "saving" || imageUploading}
                                    className="!inline-flex !items-center !justify-center !gap-2 !rounded-xl !bg-gradient-to-r !from-purple-700 !to-violet-600 !px-6 !py-3 !text-sm !font-extrabold !text-white !shadow-lg !shadow-purple-200 !transition hover:!-translate-y-0.5 hover:!shadow-xl disabled:!cursor-not-allowed disabled:!opacity-60"
                                >
                                    {saveStatus === "saving" ? (
                                        <>
                                            <Loader2 size={17} className="!animate-spin" />
                                            Saving changes...
                                        </>
                                    ) : saveStatus === "saved" ? (
                                        <>
                                            <CheckCircle2 size={17} />
                                            Saved successfully
                                        </>
                                    ) : (
                                        <>
                                            <Save size={17} />
                                            Save changes
                                            <ArrowUpRight size={15} />
                                        </>
                                    )}
                                </button>
                            </div>
                        </section>
                    </form>

                    <p className="!mt-6 !pb-3 !text-center !text-xs !text-gray-400">
                        CareerTrack · Employer workspace
                    </p>
                </div>
            </main>
        </div>
    );
};

const inputClass =
    "!w-full !rounded-xl !border !border-gray-200 !bg-gray-50/70 !py-3 !pl-3 !pr-4 !text-sm !text-gray-800 !outline-none !transition placeholder:!text-gray-400 focus:!border-purple-400 focus:!bg-white focus:!ring-4 focus:!ring-purple-100";

const ProfileDetail = ({ icon, label, value }) => (
    <div className="!flex !min-w-0 !items-start !gap-3">
        <div className="!flex !h-9 !w-9 !shrink-0 !items-center !justify-center !rounded-xl !bg-purple-50 !text-purple-600">
            {icon}
        </div>
        <div className="!min-w-0">
            <p className="!text-[11px] !font-bold !uppercase !tracking-wider !text-gray-400">{label}</p>
            <p className="!mt-1 !break-words !text-sm !font-semibold !text-gray-700">{value}</p>
        </div>
    </div>
);

const FormField = ({ label, icon, required = false, hint, children }) => (
    <div className="!min-w-0">
        <label className="!mb-2 !flex !items-center !gap-2 !text-sm !font-bold !text-gray-700">
            <span className="!text-purple-500">{icon}</span>
            {label}
            {required && <span className="!text-rose-500">*</span>}
        </label>
        {children}
        {hint && <p className="!mt-1.5 !text-xs !text-gray-400">{hint}</p>}
    </div>
);

export default EmployerProfile;
