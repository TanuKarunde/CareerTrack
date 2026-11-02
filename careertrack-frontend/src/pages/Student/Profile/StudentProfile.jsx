
import { useEffect, useRef, useState } from "react";
import {
    ArrowDownToLine,
    ArrowLeft,
    ArrowUpRight,
    Award,
    BriefcaseBusiness,
    CalendarDays,
    Camera,
    CheckCircle2,
    Code2,
    Download,
    FileText,
    GraduationCap,
    Mail,
    MapPin,
    Pencil,
    Phone,
    Sparkles,
    UserRound,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { getStudentProfile } from "../../../services/studentProfileService";
import Sidebar from "../../../components/Sidebar/Sidebar";

const API_BASE = "http://localhost:8080/api/student/profile";

const StudentProfile = () => {
    const navigate = useNavigate();

    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const [imageLoading, setImageLoading] = useState(false);
    const [profileImageUrl, setProfileImageUrl] = useState("");

    const imageUrlRef = useRef(null);

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const data = await getStudentProfile();
                setProfile(data);

                if (data?.hasProfileImage) {
                    await loadProfileImage();
                }
            } catch (error) {
                console.error("Unable to load student profile:", error);
                toast.error("Unable to load your profile.");
            } finally {
                setLoading(false);
            }
        };

        loadProfile();

        return () => {
            if (imageUrlRef.current) {
                URL.revokeObjectURL(imageUrlRef.current);
            }
        };
    }, []);

    const loadProfileImage = async () => {
        setImageLoading(true);

        try {
            const token = localStorage.getItem("token");

            const response = await fetch(`${API_BASE}/image`, {
                headers: token
                    ? { Authorization: `Bearer ${token}` }
                    : {},
            });

            if (!response.ok) {
                throw new Error("Profile image could not be loaded.");
            }

            const blob = await response.blob();
            const objectUrl = URL.createObjectURL(blob);

            if (imageUrlRef.current) {
                URL.revokeObjectURL(imageUrlRef.current);
            }

            imageUrlRef.current = objectUrl;
            setProfileImageUrl(objectUrl);
        } catch (error) {
            console.error("Unable to load profile image:", error);
        } finally {
            setImageLoading(false);
        }
    };

    const downloadResume = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                `${API_BASE}/resume/download`,
                {
                    headers: token
                        ? { Authorization: `Bearer ${token}` }
                        : {},
                }
            );

            if (!response.ok) {
                throw new Error("Resume download failed.");
            }

            const blob = await response.blob();
            const objectUrl = URL.createObjectURL(blob);
            const link = document.createElement("a");

            link.href = objectUrl;
            link.download = profile?.resumeName || "CareerTrack-Resume";
            document.body.appendChild(link);
            link.click();
            link.remove();

            window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
        } catch (error) {
            console.error("Resume download failed:", error);
            toast.error("Unable to download your resume.");
        }
    };

    const getInitials = (name = "") =>
        name
            .trim()
            .split(/\s+/)
            .slice(0, 2)
            .map((part) => part.charAt(0).toUpperCase())
            .join("") || "ST";

    const formatDate = (date) => {
        if (!date) return "Not specified";

        const parsed = new Date(date);

        if (Number.isNaN(parsed.getTime())) return date;

        return parsed.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    };

    const formatValue = (value) =>
        value === null || value === undefined || value === ""
            ? "Not added yet"
            : value;

    const getSkills = () => {
        if (Array.isArray(profile?.skills)) return profile.skills;
        if (typeof profile?.skills === "string") {
            return profile.skills
                .split(",")
                .map((skill) => skill.trim())
                .filter(Boolean);
        }
        return [];
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#faf8ff] lg:grid lg:grid-cols-[250px_minmax(0,1fr)]">
                <div className="hidden lg:block">
                    <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
                </div>

                <div className="flex min-h-screen items-center justify-center">
                    <div className="flex flex-col items-center gap-3">
                        <div className="h-12 w-12 animate-spin rounded-full border-4 border-purple-100 border-t-[#7047e8]" />
                        <p className="text-sm font-medium text-slate-500">
                            Preparing your profile...
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="min-h-screen bg-[#faf8ff] lg:grid lg:grid-cols-[250px_minmax(0,1fr)]">
                <div className="hidden lg:block">
                    <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
                </div>

                <main className="flex min-h-screen items-center justify-center !p-6">
                    <div className="max-w-sm rounded-3xl border border-purple-100 bg-white p-8 text-center shadow-sm">
                        <UserRound className="mx-auto mb-4 h-10 w-10 text-purple-500" />
                        <h2 className="text-xl font-bold text-slate-800">
                            Profile unavailable
                        </h2>
                        <p className="mt-2 text-sm text-slate-500">
                            We couldn't load your profile. Please try again.
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-5 rounded-xl bg-[#7047e8] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#5c35cc]"
                        >
                            Try again
                        </button>
                    </div>
                </main>
            </div>
        );
    }

    const skills = getSkills();
    const experiences = Array.isArray(profile.experiences)
        ? profile.experiences
        : [];
    const certifications = Array.isArray(profile.certifications)
        ? profile.certifications
        : [];
    const educationDetails = [
        profile.degree,
        profile.branch,
    ].filter(Boolean);

    return (
        <div className="min-h-screen bg-[#faf8ff] text-[#202941] lg:grid lg:grid-cols-[250px_minmax(0,1fr)]">
            <div className="hidden lg:block">
                <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
            </div>

            <main className="min-w-0">
                <div className="mx-auto max-w-[1500px] !px-4 !py-5 sm:!px-6 lg:!px-8 lg:!py-7">
                    {/* Page heading */}
                    <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                        <div>

                            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#7047e8]">
                                <Sparkles size={14} />
                                Your professional identity
                            </p>
                            <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-[#202941] sm:text-3xl">
                                My Profile
                            </h1>
                            <p className="mt-1 text-sm text-slate-500">
                                Present your skills, education, and experience with confidence.
                            </p>
                        </div>

                        <button
                            onClick={() => navigate("/student/profile/edit")}
                            className="inline-flex items-center gap-2 rounded-xl bg-[#7047e8] !px-4 !py-3 text-sm font-bold text-white shadow-lg shadow-purple-200 transition hover:-translate-y-0.5 hover:bg-[#5e37d0]"
                        >
                            <Pencil size={16} />
                            Edit profile
                        </button>
                    </div>

                    {/* Profile hero */}
                    <section className="relative isolate overflow-hidden rounded-[28px] bg-[#20133f] p-5 text-white shadow-xl shadow-purple-100 sm:p-7 lg:!p-8">
                        <div className="pointer-events-none absolute -right-12 -top-24 -z-10 h-64 w-64 rounded-full bg-purple-500/30 blur-3xl" />
                        <div className="pointer-events-none absolute -bottom-28 left-1/3 -z-10 h-64 w-64 rounded-full bg-fuchsia-500/20 blur-3xl" />

                        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center">
                            <div className="relative shrink-0">
                                <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-[28px] border-4 border-white/20 bg-gradient-to-br from-violet-400 to-fuchsia-500 text-3xl font-extrabold text-white shadow-xl sm:h-28 sm:w-28">
                                    {profileImageUrl ? (
                                        <img
                                            src={profileImageUrl}
                                            alt="Student profile"
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        getInitials(profile.name || profile.fullName)
                                    )}
                                </div>

                                <button
                                    title="Change profile photo"
                                    onClick={() => navigate("/student/profile/edit")}
                                    className="absolute -bottom-2 -right-2 flex h-9 w-9 items-center justify-center rounded-xl border-2 border-[#20133f] bg-white text-[#7047e8] shadow-md transition hover:scale-105"
                                >
                                    <Camera size={16} />
                                </button>
                            </div>

                            <div className="min-w-0 flex-1">
                                <div className="mb-2 flex flex-wrap items-center gap-2">
                                    <span className="rounded-full border border-white/15 bg-white/10 !px-3 !py-1 text-[11px] font-bold uppercase tracking-wider text-purple-100">
                                        Student profile
                                    </span>
                                    {profile.hasResume && (
                                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-400/15 !px-3 !py-1 text-[11px] font-semibold text-emerald-200">
                                            <CheckCircle2 size={13} />
                                            Resume added
                                        </span>
                                    )}
                                </div>

                                <h2 className="break-words text-2xl font-extrabold tracking-tight sm:text-3xl">
                                    {profile.name || profile.fullName || "Your Name"}
                                </h2>

                                <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-purple-100/80">
                                    <span className="inline-flex items-center gap-1.5">
                                        <GraduationCap size={16} />
                                        {educationDetails.join(" · ") || "Add your education"}
                                    </span>
                                    {profile.location && (
                                        <span className="inline-flex items-center gap-1.5">
                                            <MapPin size={15} />
                                            {profile.location}
                                        </span>
                                    )}
                                </p>

                                {profile.bio && (
                                    <p className="mt-4 max-w-3xl text-sm leading-6 text-white/75">
                                        {profile.bio}
                                    </p>
                                )}

                                <div className="mt-5 flex flex-wrap gap-2">
                                    {profile.preferredJobRole && (
                                        <span className="rounded-lg border border-white/15 bg-white/10 !px-3 !py-1.5 text-xs font-semibold">
                                            Target: {profile.preferredJobRole}
                                        </span>
                                    )}
                                    {profile.graduationYear && (
                                        <span className="rounded-lg border border-white/15 bg-white/10 !px-3 !py-1.5 text-xs font-semibold">
                                            Class of {profile.graduationYear}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="mt-7 grid grid-cols-2 gap-3 border-t border-white/10 !pt-5 sm:grid-cols-3">
                            <HeroStat
                                icon={<Code2 size={17} />}
                                value={skills.length}
                                label="Skills listed"
                            />
                            <HeroStat
                                icon={<BriefcaseBusiness size={17} />}
                                value={experiences.length}
                                label="Experiences"
                            />
                            <HeroStat
                                icon={<Award size={17} />}
                                value={certifications.length}
                                label="Certifications"
                                className="col-span-2 sm:col-span-1"
                            />
                        </div>
                    </section>

                    {/* Main profile layout */}
                    <div className="mt-5 grid grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(0,1.5fr)_minmax(300px,0.85fr)]">
                        <div className="space-y-5">
                            {/* Contact */}
                            <SectionCard
                                icon={<UserRound size={19} />}
                                title="Personal information"
                                subtitle="Your contact details"
                                action={
                                    <EditButton
                                        onClick={() => navigate("/student/profile/edit")}
                                    />
                                }
                            >
                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                    <InfoTile
                                        icon={<Mail size={17} />}
                                        label="Email address"
                                        value={profile.email}
                                    />
                                    <InfoTile
                                        icon={<Phone size={17} />}
                                        label="Phone number"
                                        value={profile.phone}
                                    />
                                    <InfoTile
                                        icon={<CalendarDays size={17} />}
                                        label="Date of birth"
                                        value={formatDate(profile.dateOfBirth)}
                                    />
                                    <InfoTile
                                        icon={<UserRound size={17} />}
                                        label="Gender"
                                        value={profile.gender}
                                    />
                                </div>
                            </SectionCard>

                            {/* Education */}
                            <SectionCard
                                icon={<GraduationCap size={19} />}
                                title="Education"
                                subtitle="Your academic background"
                                action={
                                    <EditButton
                                        onClick={() => navigate("/student/profile/edit")}
                                    />
                                }
                            >
                                <div className="relative ml-2 border-l-2 border-purple-100 !pl-6">
                                    <div className="absolute -left-[7px] top-1 h-3 w-3 rounded-full border-2 border-white bg-[#7047e8] ring-4 ring-purple-50" />
                                    <h3 className="text-base font-bold text-slate-800">
                                        {formatValue(profile.degree)}
                                        {profile.branch ? ` — ${profile.branch}` : ""}
                                    </h3>
                                    <p className="mt-1 text-sm text-slate-500">
                                        {formatValue(profile.college)}
                                    </p>

                                    <div className="mt-3 flex flex-wrap gap-2">
                                        {profile.graduationYear && (
                                            <MetaPill>
                                                <CalendarDays size={13} />
                                                Graduated {profile.graduationYear}
                                            </MetaPill>
                                        )}
                                        {profile.cgpa !== null &&
                                            profile.cgpa !== undefined &&
                                            profile.cgpa !== "" && (
                                                <MetaPill>
                                                    <Award size={13} />
                                                    CGPA: {profile.cgpa}
                                                </MetaPill>
                                            )}
                                    </div>
                                </div>
                            </SectionCard>

                            {/* Experience */}
                            <SectionCard
                                icon={<BriefcaseBusiness size={19} />}
                                title="Work experience"
                                subtitle="Your professional journey"
                                action={
                                    <EditButton
                                        onClick={() => navigate("/student/profile/edit")}
                                    />
                                }
                            >
                                {experiences.length ? (
                                    <div className="space-y-5">
                                        {experiences.map((experience, index) => (
                                            <div
                                                key={`${experience.jobTitle}-${index}`}
                                                className="relative border-l-2 border-purple-100 !pl-5"
                                            >
                                                <div className="absolute -left-[7px] top-1 h-3 w-3 rounded-full border-2 border-white bg-[#7047e8] ring-4 ring-purple-50" />

                                                <div className="flex flex-wrap items-start justify-between gap-2">
                                                    <div>
                                                        <h3 className="font-bold text-slate-800">
                                                            {experience.jobTitle || "Position"}
                                                        </h3>
                                                        <p className="mt-1 text-sm font-medium text-[#7047e8]">
                                                            {experience.companyName || "Company not specified"}
                                                        </p>
                                                    </div>

                                                    {experience.employmentType && (
                                                        <span className="rounded-lg bg-purple-50 !px-2.5 !py-1 text-[11px] font-bold text-purple-700">
                                                            {experience.employmentType.replaceAll("_", " ")}
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                                                    {(experience.startDate || experience.endDate || experience.currentlyWorking) && (
                                                        <span className="inline-flex items-center gap-1">
                                                            <CalendarDays size={13} />
                                                            {experience.startDate || "Start date not set"} –{" "}
                                                            {experience.currentlyWorking
                                                                ? "Present"
                                                                : experience.endDate || "End date not set"}
                                                        </span>
                                                    )}
                                                    {experience.location && (
                                                        <span className="inline-flex items-center gap-1">
                                                            <MapPin size={13} />
                                                            {experience.location}
                                                        </span>
                                                    )}
                                                </div>

                                                {experience.description && (
                                                    <p className="mt-3 whitespace-pre-line text-sm leading-6 text-slate-600">
                                                        {experience.description}
                                                    </p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <EmptyState
                                        icon={<BriefcaseBusiness size={22} />}
                                        title="Your journey starts here"
                                        description="Add internships, projects at work, or professional experience to strengthen your profile."
                                        action={() => navigate("/student/profile/edit")}
                                    />
                                )}
                            </SectionCard>

                            {/* Certifications */}
                            <SectionCard
                                icon={<Award size={19} />}
                                title="Certifications"
                                subtitle="Courses and credentials"
                                action={
                                    <EditButton
                                        onClick={() => navigate("/student/profile/edit")}
                                    />
                                }
                            >
                                {certifications.length ? (
                                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                        {certifications.map((certificate, index) => (
                                            <div
                                                key={`${certificate.certificationName}-${index}`}
                                                className="rounded-2xl border border-purple-100 bg-gradient-to-br from-white to-purple-50/60 !p-4"
                                            >
                                                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-purple-100 text-[#7047e8]">
                                                    <Award size={18} />
                                                </div>
                                                <h3 className="font-bold text-slate-800">
                                                    {certificate.certificationName || "Certification"}
                                                </h3>
                                                <p className="mt-1 text-sm text-slate-500">
                                                    {certificate.issuingOrganization || "Issuer not specified"}
                                                </p>
                                                {certificate.issueDate && (
                                                    <p className="mt-2 text-xs text-slate-400">
                                                        Issued {formatDate(certificate.issueDate)}
                                                    </p>
                                                )}
                                                {certificate.credentialUrl && (
                                                    <a
                                                        href={certificate.credentialUrl}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-[#7047e8] hover:underline"
                                                    >
                                                        View credential <ArrowUpRight size={13} />
                                                    </a>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <EmptyState
                                        icon={<Award size={22} />}
                                        title="Show what you've learned"
                                        description="Add certifications and completed courses to highlight your learning."
                                        action={() => navigate("/student/profile/edit")}
                                    />
                                )}
                            </SectionCard>
                        </div>

                        {/* Right column */}
                        <div className="space-y-5">
                            <SectionCard
                                icon={<Code2 size={19} />}
                                title="Skills & strengths"
                                subtitle="Your technical toolkit"
                                action={
                                    <EditButton
                                        onClick={() => navigate("/student/profile/edit")}
                                    />
                                }
                            >
                                {skills.length ? (
                                    <>
                                        <div className="flex flex-wrap gap-2">
                                            {skills.map((skill, index) => (
                                                <span
                                                    key={`${skill}-${index}`}
                                                    className="inline-flex items-center gap-2 rounded-xl border border-purple-100 bg-white !px-3 !py-2 text-xs font-bold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-purple-300 hover:bg-purple-50"
                                                >
                                                    <span className="h-1.5 w-1.5 rounded-full bg-[#7047e8]" />
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                        <div className="mt-5 rounded-xl bg-purple-50/80 !p-3">
                                            <p className="flex items-start gap-2 text-xs leading-5 text-purple-800">
                                                <Sparkles size={15} className="mt-0.5 shrink-0" />
                                                Keep your skills aligned with the roles you want to pursue.
                                            </p>
                                        </div>
                                    </>
                                ) : (
                                    <EmptyState
                                        icon={<Code2 size={22} />}
                                        title="Add your skill set"
                                        description="List your programming languages, tools, and strengths."
                                        action={() => navigate("/student/profile/edit")}
                                    />
                                )}
                            </SectionCard>

                            <SectionCard
                                icon={<FileText size={19} />}
                                title="Resume"
                                subtitle="Your application document"
                            >
                                {profile.hasResume ? (
                                    <div className="rounded-2xl border border-purple-100 bg-gradient-to-br from-purple-50 to-white !p-4">
                                        <div className="flex items-start gap-3">
                                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-[#7047e8] shadow-sm">
                                                <FileText size={23} />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="break-words text-sm font-bold text-slate-800">
                                                    {profile.resumeName || "My Resume"}
                                                </p>
                                                <p className="mt-1 text-xs text-slate-500">
                                                    {profile.resumeUpdatedAt
                                                        ? `Updated ${formatDate(profile.resumeUpdatedAt)}`
                                                        : "Available for your applications"}
                                                </p>
                                                <span className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                                                    <CheckCircle2 size={13} />
                                                    Resume uploaded
                                                </span>
                                            </div>
                                        </div>

                                        <button
                                            onClick={downloadResume}
                                            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#7047e8] !px-4 !py-3 text-sm font-bold text-white transition hover:bg-[#5d36ce]"
                                        >
                                            <Download size={16} />
                                            Download resume
                                        </button>
                                    </div>
                                ) : (
                                    <EmptyState
                                        icon={<FileText size={22} />}
                                        title="Your resume belongs here"
                                        description="Upload a PDF or Word resume to keep your application details ready."
                                        action={() => navigate("/student/profile/edit")}
                                    />
                                )}

                                <button
                                    onClick={() => navigate("/student/profile/edit")}
                                    className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-purple-200 bg-white !px-4 !py-3 text-sm font-bold text-[#7047e8] transition hover:bg-purple-50"
                                >
                                    <Pencil size={15} />
                                    {profile.hasResume ? "Replace resume" : "Upload resume"}
                                </button>
                            </SectionCard>

                            <SectionCard
                                icon={<Sparkles size={19} />}
                                title="Career preferences"
                                subtitle="What you're looking for"
                            >
                                <PreferenceRow
                                    label="Preferred job role"
                                    value={profile.preferredJobRole}
                                />
                                <div className="my-3 border-t border-slate-100" />
                                <PreferenceRow
                                    label="Preferred location"
                                    value={profile.preferredLocation}
                                />
                                <button
                                    onClick={() => navigate("/student/profile/edit")}
                                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-purple-100 bg-purple-50/70 !px-4 !py-2.5 text-sm font-bold text-[#7047e8] transition hover:bg-purple-100"
                                >
                                    <Pencil size={14} />
                                    Update preferences
                                </button>
                            </SectionCard>

                            <SectionCard
                                icon={<ArrowUpRight size={19} />}
                                title="Online presence"
                                subtitle="Let recruiters explore your work"
                            >
                                <SocialLink label="GitHub" url={profile.githubUrl} />
                                <SocialLink label="LinkedIn" url={profile.linkedinUrl} />
                                <SocialLink label="Portfolio" url={profile.portfolioUrl} />
                                <button
                                    onClick={() => navigate("/student/profile/edit")}
                                    className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-purple-100 !px-4 !py-2.5 text-sm font-bold text-[#7047e8] transition hover:bg-purple-50"
                                >
                                    <Pencil size={14} />
                                    Edit links
                                </button>
                            </SectionCard>
                        </div>
                    </div>

                    <p className="!py-6 text-center text-xs text-slate-400">
                        CareerTrack · Build your future, one step at a time.
                    </p>
                </div>
            </main>
        </div>
    );
};

const HeroStat = ({ icon, value, label, className = "" }) => (
    <div className={`flex items-center gap-3 ${className}`}>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10 text-purple-200">
            {icon}
        </div>
        <div>
            <p className="text-lg font-extrabold leading-5">{value}</p>
            <p className="mt-1 text-xs text-purple-100/65">{label}</p>
        </div>
    </div>
);

const SectionCard = ({ icon, title, subtitle, action, children }) => (
    <section className="min-w-0 rounded-[22px] border border-[#ebe7f6] bg-white !p-4 shadow-[0_4px_22px_rgba(49,29,92,0.035)] transition-shadow hover:shadow-[0_8px_28px_rgba(49,29,92,0.065)] sm:p-5">
        <div className="mb-5 flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-[#7047e8]">
                    {icon}
                </div>
                <div className="min-w-0">
                    <h2 className="font-extrabold tracking-tight text-slate-800">
                        {title}
                    </h2>
                    <p className="mt-0.5 text-xs text-slate-400">{subtitle}</p>
                </div>
            </div>
            {action}
        </div>
        {children}
    </section>
);

const EditButton = ({ onClick }) => (
    <button
        onClick={onClick}
        title="Edit section"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-purple-100 text-[#7047e8] transition hover:border-purple-200 hover:bg-purple-50"
    >
        <Pencil size={15} />
    </button>
);

const InfoTile = ({ icon, label, value }) => (
    <div className="flex min-w-0 items-start gap-3 rounded-xl border border-slate-100 bg-[#fcfbff] !p-3.5">
        <div className="mt-0.5 text-[#8b6be8]">{icon}</div>
        <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                {label}
            </p>
            <p className="mt-1 break-words text-sm font-semibold text-slate-700">
                {value || "Not added yet"}
            </p>
        </div>
    </div>
);

const MetaPill = ({ children }) => (
    <span className="inline-flex items-center gap-1.5 rounded-lg bg-purple-50 !px-2.5 !py-1.5 text-xs font-semibold text-purple-700">
        {children}
    </span>
);

const EmptyState = ({ icon, title, description, action }) => (
    <div className="rounded-2xl border border-dashed border-purple-200 bg-purple-50/40 !px-4 !py-6 text-center">
        <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-[#7047e8] shadow-sm">
            {icon}
        </div>
        <h3 className="mt-3 text-sm font-bold text-slate-800">{title}</h3>
        <p className="mx-auto mt-1 max-w-xs text-xs leading-5 text-slate-500">
            {description}
        </p>
        <button
            onClick={action}
            className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-[#7047e8] hover:underline"
        >
            Add details <ArrowUpRight size={13} />
        </button>
    </div>
);

const PreferenceRow = ({ label, value }) => (
    <div>
        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            {label}
        </p>
        <p className="mt-1 break-words text-sm font-bold text-slate-700">
            {value || "Not specified"}
        </p>
    </div>
);

const SocialLink = ({ label, url }) => (
    <div className="flex items-center justify-between gap-3 !py-2">
        <span className="text-sm font-semibold text-slate-600">{label}</span>
        {url ? (
            <a
                href={/^https?:\/\//i.test(url) ? url : `https://${url}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex max-w-[65%] items-center gap-1 break-all text-right text-xs font-bold text-[#7047e8] hover:underline"
            >
                Open link <ArrowUpRight size={13} className="shrink-0" />
            </a>
        ) : (
            <span className="text-xs text-slate-400">Not added</span>
        )}
    </div>
);

export default StudentProfile;
