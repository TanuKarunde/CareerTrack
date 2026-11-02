
import { useEffect, useRef, useState } from "react";
import {
    ArrowDownToLine,
    ArrowLeft,
    Award,
    BriefcaseBusiness,
    Camera,
    Check,
    CheckCircle2,
    Code2,
    FileText,
    Globe,
    GraduationCap,
    Loader2,
    MapPin,
    Plus,
    Save,
    Sparkles,
    Trash2,
    Upload,
    UserRound,
    X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import {
    getStudentProfile,
    updateStudentProfile,
    uploadStudentProfileImage,
    uploadStudentResume,
} from "../../../services/studentProfileService";

const API_BASE = "http://localhost:8080/api/student/profile";

const emptyCertificate = {
    certificationName: "",
    issuingOrganization: "",
    issueDate: "",
    credentialId: "",
    credentialUrl: "",
};

const emptyExperience = {
    jobTitle: "",
    companyName: "",
    employmentType: "",
    location: "",
    startDate: "",
    endDate: "",
    currentlyWorking: false,
    description: "",
};

const initialProfile = {
    name: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    location: "",
    bio: "",
    degree: "",
    college: "",
    branch: "",
    graduationYear: "",
    cgpa: "",
    skills: [],
    experiences: [],
    preferredJobRole: "",
    preferredLocation: "",
    githubUrl: "",
    linkedinUrl: "",
    portfolioUrl: "",
    projects: [],
    certifications: [],
    hasResume: false,
    resumeName: "",
    resumeType: "",
};

const EditStudentProfile = () => {
    const navigate = useNavigate();

    const profileImageInputRef = useRef(null);
    const resumeInputRef = useRef(null);
    const imageUrlRef = useRef(null);

    const [profile, setProfile] = useState(initialProfile);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [skillInput, setSkillInput] = useState("");
    const [profileImage, setProfileImage] = useState(null);
    const [profileImagePreview, setProfileImagePreview] = useState("");
    const [resumeFile, setResumeFile] = useState(null);
    const [isFresher, setIsFresher] = useState(true);

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const data = await getStudentProfile();

                setProfile({
                    ...initialProfile,
                    ...data,
                    name: data?.name || data?.fullName || "",
                    skills: Array.isArray(data?.skills)
                        ? data.skills
                        : typeof data?.skills === "string"
                            ? data.skills
                                .split(",")
                                .map((skill) => skill.trim())
                                .filter(Boolean)
                            : [],
                    experiences: Array.isArray(data?.experiences)
                        ? data.experiences.map((experience) => ({
                            ...emptyExperience,
                            ...experience,
                        }))
                        : [],
                    certifications: Array.isArray(data?.certifications)
                        ? data.certifications.map((certificate) => ({
                            ...emptyCertificate,
                            ...certificate,
                        }))
                        : [],
                    projects: Array.isArray(data?.projects)
                        ? data.projects
                        : [],
                    hasResume: Boolean(data?.hasResume),
                });

                setIsFresher(!data?.experiences?.length);

                if (data?.hasProfileImage) {
                    await loadProfileImage();
                }
            } catch (error) {
                console.error("Unable to load profile:", error);
                toast.error("Unable to load profile details.");
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
        try {
            const token = localStorage.getItem("token");

            const response = await fetch(`${API_BASE}/image`, {
                headers: token
                    ? { Authorization: `Bearer ${token}` }
                    : {},
            });

            if (!response.ok) return;

            const blob = await response.blob();
            const objectUrl = URL.createObjectURL(blob);

            if (imageUrlRef.current) {
                URL.revokeObjectURL(imageUrlRef.current);
            }

            imageUrlRef.current = objectUrl;
            setProfileImagePreview(objectUrl);
        } catch (error) {
            console.error("Unable to load profile image:", error);
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;

        setProfile((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const handleProfileImageChange = (event) => {
        const file = event.target.files?.[0];

        if (!file) return;

        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/jpg",
        ];

        if (!allowedTypes.includes(file.type)) {
            toast.warning("Please select a JPG or PNG image.");
            event.target.value = "";
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            toast.warning("Profile image must be smaller than 2MB.");
            event.target.value = "";
            return;
        }

        setProfileImage(file);

        const objectUrl = URL.createObjectURL(file);

        if (imageUrlRef.current) {
            URL.revokeObjectURL(imageUrlRef.current);
        }

        imageUrlRef.current = objectUrl;
        setProfileImagePreview(objectUrl);
    };

    const addSkill = () => {
        const skill = skillInput.trim();

        if (!skill) return;

        if (
            profile.skills.some(
                (item) => item.toLowerCase() === skill.toLowerCase()
            )
        ) {
            toast.info("This skill has already been added.");
            return;
        }

        if (profile.skills.length >= 10) {
            toast.warning("You can add up to 10 skills.");
            return;
        }

        setProfile((previous) => ({
            ...previous,
            skills: [...previous.skills, skill],
        }));

        setSkillInput("");
    };

    const removeSkill = (skillToRemove) => {
        setProfile((previous) => ({
            ...previous,
            skills: previous.skills.filter(
                (skill) => skill !== skillToRemove
            ),
        }));
    };

    const handleSkillKeyDown = (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            addSkill();
        }
    };

    const handleResumeChange = (event) => {
        const file = event.target.files?.[0];

        if (!file) return;

        const allowedTypes = [
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ];

        const allowedExtensions = /\.(pdf|doc|docx)$/i;

        if (
            !allowedTypes.includes(file.type) &&
            !allowedExtensions.test(file.name)
        ) {
            toast.warning("Please select a PDF, DOC, or DOCX resume.");
            event.target.value = "";
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.warning("Resume must be smaller than 5MB.");
            event.target.value = "";
            return;
        }

        setResumeFile(file);
    };

    const handleViewResume = async () => {
        let objectUrl;

        try {
            const token = localStorage.getItem("token");

            const response = await fetch(`${API_BASE}/resume`, {
                headers: token
                    ? { Authorization: `Bearer ${token}` }
                    : {},
            });

            if (!response.ok) {
                throw new Error("Unable to open resume.");
            }

            const blob = await response.blob();
            objectUrl = URL.createObjectURL(blob);

            const openedWindow = window.open(
                objectUrl,
                "_blank",
                "noopener,noreferrer"
            );

            if (!openedWindow) {
                URL.revokeObjectURL(objectUrl);
                toast.info("Allow pop-ups to preview your resume.");
                return;
            }

            window.setTimeout(() => {
                URL.revokeObjectURL(objectUrl);
            }, 60000);
        } catch (error) {
            console.error("Unable to view resume:", error);

            if (objectUrl) {
                URL.revokeObjectURL(objectUrl);
            }

            toast.error("Unable to open your resume.");
        }
    };

    const handleDownloadResume = async () => {
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
                throw new Error("Unable to download resume.");
            }

            const blob = await response.blob();
            const objectUrl = URL.createObjectURL(blob);
            const link = document.createElement("a");

            link.href = objectUrl;
            link.download = profile.resumeName || "CareerTrack-Resume";

            document.body.appendChild(link);
            link.click();
            link.remove();

            window.setTimeout(() => {
                URL.revokeObjectURL(objectUrl);
            }, 1000);
        } catch (error) {
            console.error("Unable to download resume:", error);
            toast.error("Unable to download your resume.");
        }
    };

    const updateExperience = (index, field, value) => {
        setProfile((previous) => ({
            ...previous,
            experiences: previous.experiences.map(
                (experience, itemIndex) =>
                    itemIndex === index
                        ? {
                            ...experience,
                            [field]: value,
                            ...(field === "currentlyWorking" && value
                                ? { endDate: "" }
                                : {}),
                        }
                        : experience
            ),
        }));
    };

    const addExperience = () => {
        setProfile((previous) => ({
            ...previous,
            experiences: [
                ...previous.experiences,
                { ...emptyExperience },
            ],
        }));
    };

    const removeExperience = (index) => {
        setProfile((previous) => ({
            ...previous,
            experiences: previous.experiences.filter(
                (_, itemIndex) => itemIndex !== index
            ),
        }));
    };

    const updateCertificate = (index, field, value) => {
        setProfile((previous) => ({
            ...previous,
            certifications: previous.certifications.map(
                (certificate, itemIndex) =>
                    itemIndex === index
                        ? { ...certificate, [field]: value }
                        : certificate
            ),
        }));
    };

    const addCertificate = () => {
        setProfile((previous) => ({
            ...previous,
            certifications: [
                ...previous.certifications,
                { ...emptyCertificate },
            ],
        }));
    };

    const removeCertificate = (index) => {
        setProfile((previous) => ({
            ...previous,
            certifications: previous.certifications.filter(
                (_, itemIndex) => itemIndex !== index
            ),
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!profile.phone.trim()) {
            toast.warning("Please enter your phone number.");
            return;
        }

        if (!profile.dateOfBirth) {
            toast.warning("Please select your date of birth.");
            return;
        }

        if (!profile.gender) {
            toast.warning("Please select your gender.");
            return;
        }

        if (!profile.location.trim()) {
            toast.warning("Please enter your location.");
            return;
        }

        if (!profile.bio.trim()) {
            toast.warning("Please write a short introduction about yourself.");
            return;
        }

        if (!profile.skills.length) {
            toast.warning("Please add at least one skill.");
            return;
        }

        if (!profile.hasResume && !resumeFile) {
            toast.warning("Please upload your resume.");
            return;
        }

        if (
            profile.cgpa !== "" &&
            (Number(profile.cgpa) < 0 || Number(profile.cgpa) > 10)
        ) {
            toast.warning("CGPA must be between 0 and 10.");
            return;
        }

        setSaving(true);

        try {
            const certifications = profile.certifications.filter(
                (certificate) =>
                    Object.values(certificate).some(
                        (value) => String(value ?? "").trim() !== ""
                    )
            );

            const experiences = isFresher
                ? []
                : profile.experiences
                    .filter((experience) => experience.jobTitle.trim())
                    .map((experience) => ({
                        ...experience,
                        endDate: experience.currentlyWorking
                            ? null
                            : experience.endDate || null,
                    }));

            const requestData = {
                phone: profile.phone,
                dateOfBirth: profile.dateOfBirth,
                gender: profile.gender,
                location: profile.location,
                bio: profile.bio,
                degree: profile.degree,
                college: profile.college,
                branch: profile.branch,
                graduationYear: profile.graduationYear,
                cgpa: profile.cgpa === ""
                    ? null
                    : Number(profile.cgpa),
                skills: profile.skills,
                experiences,
                preferredJobRole: profile.preferredJobRole,
                preferredLocation: profile.preferredLocation,
                githubUrl: profile.githubUrl,
                linkedinUrl: profile.linkedinUrl,
                portfolioUrl: profile.portfolioUrl,
                projects: profile.projects,
                certifications,
            };

            await updateStudentProfile(requestData);

            if (profileImage) {
                await uploadStudentProfileImage(profileImage);
            }

            if (resumeFile) {
                await uploadStudentResume(resumeFile);
            }

            toast.success("Your profile has been updated!");

            window.setTimeout(() => {
                navigate("/student/profile");
            }, 800);
        } catch (error) {
            console.error("Profile update failed:", error);
            toast.error(
                error?.message ||
                "Unable to update profile. Please try again."
            );
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#faf8ff]">
                <div className="flex flex-col items-center gap-3">
                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-purple-100 border-t-[#7047e8]" />
                    <p className="text-sm font-medium text-slate-500">
                        Loading your details...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full bg-[#faf8ff] text-[#202941]">
            <main className="w-full min-w-0 !px-4 !py-5 sm:!px-6 lg:!px-10 xl:!px-12 lg:!py-8">
                {/* Page heading */}
                <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <button
                            type="button"
                            onClick={() => navigate("/student/profile")}
                            className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-[#7047e8]"
                        >
                            <ArrowLeft size={16} />
                            Back to profile
                        </button>

                        <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#7047e8]">
                            <Sparkles size={14} />
                            Profile studio
                        </p>

                        <h1 className="mt-1 text-2xl font-extrabold tracking-tight sm:text-3xl lg:text-4xl">
                            Edit your profile
                        </h1>

                        <p className="mt-2 text-sm text-slate-500">
                            Keep your professional story clear, complete, and up to date.
                        </p>
                    </div>

                    <div className="hidden items-center gap-2 rounded-xl border border-purple-100 bg-white !px-4 !py-3 text-xs font-semibold text-purple-700 shadow-sm sm:flex">
                        <CheckCircle2 size={16} />
                        Your career, your story
                    </div>
                </div>

                {/* Profile banner */}
                <div className="relative mb-6 overflow-hidden rounded-[26px] bg-[#20133f] !p-5 text-white shadow-xl shadow-purple-100 sm:p-7">
                    <div className="pointer-events-none absolute -right-10 -top-20 h-56 w-56 rounded-full bg-purple-500/30 blur-3xl" />
                    <div className="pointer-events-none absolute -bottom-24 left-1/3 h-48 w-48 rounded-full bg-fuchsia-500/20 blur-3xl" />

                    <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center">
                        <button
                            type="button"
                            onClick={() => profileImageInputRef.current?.click()}
                            title="Change profile photo"
                            className="group relative h-20 w-20 shrink-0 rounded-[23px] border-2 border-white/25 bg-gradient-to-br from-violet-400 to-fuchsia-500 !p-0.5 shadow-lg transition hover:scale-[1.03] sm:h-24 sm:w-24"
                        >
                            <span className="flex h-full w-full items-center justify-center overflow-hidden rounded-[20px] bg-white/10 text-2xl font-extrabold">
                                {profileImagePreview ? (
                                    <img
                                        src={profileImagePreview}
                                        alt="Profile preview"
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    (profile.name || "S")
                                        .split(/\s+/)
                                        .slice(0, 2)
                                        .map((part) => part[0]?.toUpperCase())
                                        .join("")
                                )}
                            </span>

                            <span className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-xl border-2 border-[#20133f] bg-white text-[#7047e8] transition group-hover:scale-110">
                                <Camera size={15} />
                            </span>
                        </button>

                        <div className="min-w-0 flex-1">
                            <p className="text-xs font-bold uppercase tracking-wider text-purple-200">
                                Make a strong first impression
                            </p>

                            <h2 className="mt-1 break-words text-xl font-extrabold sm:text-2xl">
                                {profile.name || "Your professional profile"}
                            </h2>

                            <p className="mt-1 break-words text-sm text-white/65">
                                {profile.email}
                            </p>

                            <button
                                type="button"
                                onClick={() => profileImageInputRef.current?.click()}
                                className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-purple-200 transition hover:text-white"
                            >
                                <Camera size={14} />
                                Change profile photo
                            </button>
                        </div>

                        <div className="hidden rounded-2xl border border-white/15 bg-white/10 !p-4 lg:block">
                            <Sparkles size={22} className="text-purple-200" />
                            <p className="mt-2 text-sm font-bold">Stand out</p>
                            <p className="mt-1 max-w-44 text-xs leading-5 text-white/60">
                                Highlight your skills and achievements for recruiters.
                            </p>
                        </div>
                    </div>

                    <input
                        ref={profileImageInputRef}
                        type="file"
                        accept="image/png,image/jpeg,image/jpg"
                        onChange={handleProfileImageChange}
                        className="hidden"
                    />
                </div>

                <form onSubmit={handleSubmit} noValidate className="space-y-5">
                    {/* Basic information */}
                    <SectionCard
                        number="01"
                        icon={<UserRound size={19} />}
                        title="Basic information"
                        subtitle="The essentials recruiters need to know"
                    >
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                            <FormInput
                                label="Full name"
                                name="name"
                                value={profile.name}
                                disabled
                                helper="Managed by your account"
                            />

                            <FormInput
                                label="Email address"
                                name="email"
                                value={profile.email}
                                disabled
                                helper="Managed by your account"
                            />

                            <FormInput
                                label="Phone number"
                                name="phone"
                                value={profile.phone}
                                onChange={handleChange}
                                placeholder="Enter your phone number"
                                required
                            />

                            <FormInput
                                label="Date of birth"
                                name="dateOfBirth"
                                type="date"
                                value={profile.dateOfBirth || ""}
                                onChange={handleChange}
                                required
                            />

                            <FormSelect
                                label="Gender"
                                name="gender"
                                value={profile.gender}
                                onChange={handleChange}
                                required
                                options={[
                                    { value: "", label: "Select gender" },
                                    { value: "Female", label: "Female" },
                                    { value: "Male", label: "Male" },
                                    { value: "Other", label: "Other" },
                                ]}
                            />

                            <FormInput
                                label="Current location"
                                name="location"
                                value={profile.location}
                                onChange={handleChange}
                                placeholder="City, state"
                                icon={<MapPin size={16} />}
                                required
                            />
                        </div>

                        <div className="mt-5">
                            <FormTextarea
                                label="About me"
                                name="bio"
                                value={profile.bio}
                                onChange={handleChange}
                                placeholder="Introduce yourself, your interests, and what you bring to a team..."
                                maxLength={500}
                                required
                                helper={`${profile.bio.length}/500 characters`}
                            />
                        </div>
                    </SectionCard>

                    {/* Education */}
                    <SectionCard
                        number="02"
                        icon={<GraduationCap size={19} />}
                        title="Education"
                        subtitle="Highlight your academic background"
                    >
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                            <FormInput
                                label="Degree"
                                name="degree"
                                value={profile.degree}
                                onChange={handleChange}
                                placeholder="e.g. B.Tech"
                            />

                            <FormInput
                                label="Branch / specialization"
                                name="branch"
                                value={profile.branch}
                                onChange={handleChange}
                                placeholder="e.g. Information Technology"
                            />

                            <FormInput
                                label="College / university"
                                name="college"
                                value={profile.college}
                                onChange={handleChange}
                                placeholder="Enter institution name"
                            />

                            <FormSelect
                                label="Graduation year"
                                name="graduationYear"
                                value={profile.graduationYear || ""}
                                onChange={handleChange}
                                options={[
                                    { value: "", label: "Select passing year" },
                                    ...Array.from({ length: 10 }, (_, index) => {
                                        const year = 2024 + index;

                                        return {
                                            value: String(year),
                                            label: String(year),
                                        };
                                    }),
                                ]}
                            />

                            <FormInput
                                label="CGPA"
                                name="cgpa"
                                type="number"
                                value={profile.cgpa ?? ""}
                                onChange={handleChange}
                                placeholder="e.g. 8.2"
                                min="0"
                                max="10"
                                step="0.01"
                                helper="Enter a value between 0 and 10"
                            />
                        </div>
                    </SectionCard>

                    {/* Skills */}
                    <SectionCard
                        number="03"
                        icon={<Code2 size={19} />}
                        title="Skills & strengths"
                        subtitle="Add up to 10 skills relevant to your target role"
                        badge={`${profile.skills.length}/10`}
                    >
                        <div className="flex flex-col gap-2 sm:flex-row">
                            <input
                                value={skillInput}
                                onChange={(event) => setSkillInput(event.target.value)}
                                onKeyDown={handleSkillKeyDown}
                                placeholder="e.g. Java, Spring Boot, SQL"
                                className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-[#fcfbff] !px-4 !py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-purple-400 focus:ring-4 focus:ring-purple-100"
                            />

                            <button
                                type="button"
                                onClick={addSkill}
                                disabled={!skillInput.trim() || profile.skills.length >= 10}
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#7047e8] !px-5 !py-3 text-sm font-bold text-white transition hover:bg-[#5c35cc] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <Plus size={16} />
                                Add skill
                            </button>
                        </div>

                        <div className="mt-4 flex flex-wrap gap-2">
                            {profile.skills.map((skill, index) => (
                                <span
                                    key={`${skill}-${index}`}
                                    className="inline-flex items-center gap-2 rounded-xl border border-purple-100 bg-purple-50 !px-3 !py-2 text-xs font-bold text-purple-800 transition hover:border-purple-200"
                                >
                                    <span className="h-1.5 w-1.5 rounded-full bg-[#7047e8]" />
                                    {skill}

                                    <button
                                        type="button"
                                        title={`Remove ${skill}`}
                                        onClick={() => removeSkill(skill)}
                                        className="ml-1 rounded-md !p-0.5 text-purple-500 transition hover:bg-purple-200 hover:text-purple-900"
                                    >
                                        <X size={13} />
                                    </button>
                                </span>
                            ))}

                            {!profile.skills.length && (
                                <p className="text-sm text-slate-400">
                                    Your added skills will appear here.
                                </p>
                            )}
                        </div>

                        <p className="mt-3 text-xs text-slate-400">
                            Press Enter or select Add skill to add each skill.
                        </p>
                    </SectionCard>

                    {/* Experience */}
                    <SectionCard
                        number="04"
                        icon={<BriefcaseBusiness size={19} />}
                        title="Work experience"
                        subtitle="Internships and previous roles count, too"
                        action={
                            !isFresher && (
                                <button
                                    type="button"
                                    onClick={addExperience}
                                    className="inline-flex items-center gap-1.5 rounded-xl border border-purple-200 bg-purple-50 !px-3 !py-2 text-xs font-bold text-[#7047e8] transition hover:bg-purple-100"
                                >
                                    <Plus size={14} />
                                    Add role
                                </button>
                            )
                        }
                    >
                        <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-purple-100 bg-purple-50/60 !p-3.5 transition hover:bg-purple-50">
                            <input
                                type="checkbox"
                                checked={isFresher}
                                onChange={(event) => {
                                    const checked = event.target.checked;

                                    setIsFresher(checked);

                                    if (checked) {
                                        setProfile((previous) => ({
                                            ...previous,
                                            experiences: [],
                                        }));
                                    } else if (!profile.experiences.length) {
                                        setProfile((previous) => ({
                                            ...previous,
                                            experiences: [
                                                { ...emptyExperience },
                                            ],
                                        }));
                                    }
                                }}
                                className="mt-0.5 h-4 w-4 accent-[#7047e8]"
                            />

                            <span>
                                <span className="block text-sm font-bold text-slate-800">
                                    I'm a fresher
                                </span>
                                <span className="mt-0.5 block text-xs leading-5 text-slate-500">
                                    I don't have previous employment or internship experience yet.
                                </span>
                            </span>
                        </label>

                        {!isFresher && (
                            <div className="mt-4 space-y-4">
                                {profile.experiences.map((experience, index) => (
                                    <div
                                        key={index}
                                        className="rounded-2xl border border-slate-200 bg-[#fdfcff] !p-4 sm:p-5"
                                    >
                                        <div className="mb-4 flex items-center justify-between gap-3">
                                            <div className="flex items-center gap-2">
                                                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-100 text-[#7047e8]">
                                                    <BriefcaseBusiness size={15} />
                                                </span>

                                                <div>
                                                    <h3 className="text-sm font-bold text-slate-800">
                                                        Experience {index + 1}
                                                    </h3>
                                                    <p className="text-[11px] text-slate-400">
                                                        Role and employment details
                                                    </p>
                                                </div>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={() => removeExperience(index)}
                                                title="Remove experience"
                                                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-500"
                                            >
                                                <Trash2 size={15} />
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                                            <FormInput
                                                label="Job title"
                                                value={experience.jobTitle}
                                                onChange={(event) =>
                                                    updateExperience(index, "jobTitle", event.target.value)
                                                }
                                                placeholder="e.g. Java Developer Intern"
                                            />

                                            <FormInput
                                                label="Company name"
                                                value={experience.companyName}
                                                onChange={(event) =>
                                                    updateExperience(index, "companyName", event.target.value)
                                                }
                                                placeholder="Company"
                                            />

                                            <FormSelect
                                                label="Employment type"
                                                value={experience.employmentType}
                                                onChange={(event) =>
                                                    updateExperience(index, "employmentType", event.target.value)
                                                }
                                                options={[
                                                    { value: "", label: "Select type" },
                                                    { value: "FULL_TIME", label: "Full-time" },
                                                    { value: "PART_TIME", label: "Part-time" },
                                                    { value: "INTERNSHIP", label: "Internship" },
                                                    { value: "CONTRACT", label: "Contract" },
                                                    { value: "FREELANCE", label: "Freelance" },
                                                ]}
                                            />

                                            <FormInput
                                                label="Location"
                                                value={experience.location}
                                                onChange={(event) =>
                                                    updateExperience(index, "location", event.target.value)
                                                }
                                                placeholder="City or remote"
                                            />

                                            <FormInput
                                                label="Start date"
                                                type="date"
                                                value={experience.startDate || ""}
                                                onChange={(event) =>
                                                    updateExperience(index, "startDate", event.target.value)
                                                }
                                            />

                                            <FormInput
                                                label="End date"
                                                type="date"
                                                value={experience.endDate || ""}
                                                disabled={experience.currentlyWorking}
                                                onChange={(event) =>
                                                    updateExperience(index, "endDate", event.target.value)
                                                }
                                            />
                                        </div>

                                        <label className="mt-3 inline-flex cursor-pointer items-center gap-2 text-xs font-semibold text-slate-600">
                                            <input
                                                type="checkbox"
                                                checked={Boolean(experience.currentlyWorking)}
                                                onChange={(event) =>
                                                    updateExperience(
                                                        index,
                                                        "currentlyWorking",
                                                        event.target.checked
                                                    )
                                                }
                                                className="h-4 w-4 accent-[#7047e8]"
                                            />
                                            I currently work here
                                        </label>

                                        <div className="mt-4">
                                            <FormTextarea
                                                label="Description"
                                                value={experience.description || ""}
                                                onChange={(event) =>
                                                    updateExperience(
                                                        index,
                                                        "description",
                                                        event.target.value
                                                    )
                                                }
                                                placeholder="Describe your responsibilities, achievements, and impact..."
                                                rows={3}
                                            />
                                        </div>
                                    </div>
                                ))}

                                {!profile.experiences.length && (
                                    <button
                                        type="button"
                                        onClick={addExperience}
                                        className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-purple-300 bg-purple-50/40 !py-4 text-sm font-bold text-[#7047e8] transition hover:bg-purple-50"
                                    >
                                        <Plus size={16} />
                                        Add your first experience
                                    </button>
                                )}
                            </div>
                        )}
                    </SectionCard>

                    {/* Resume */}
                    <SectionCard
                        number="05"
                        icon={<FileText size={19} />}
                        title="Resume"
                        subtitle="Upload a recruiter-ready document"
                        badge="Max 5MB"
                    >
                        <div className="rounded-2xl border border-dashed border-purple-200 bg-gradient-to-br from-purple-50/80 to-white !p-4 sm:p-5">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-[#7047e8] shadow-sm">
                                    <FileText size={24} />
                                </div>

                                <div className="min-w-0 flex-1">
                                    <p className="break-words text-sm font-bold text-slate-800">
                                        {resumeFile?.name ||
                                            profile.resumeName ||
                                            "No resume selected"}
                                    </p>

                                    <p className="mt-1 text-xs leading-5 text-slate-500">
                                        PDF, DOC, or DOCX · Maximum file size 5MB
                                    </p>

                                    {resumeFile && (
                                        <p className="mt-1 text-xs font-semibold text-emerald-700">
                                            New resume selected
                                        </p>
                                    )}
                                </div>

                                <button
                                    type="button"
                                    onClick={() => resumeInputRef.current?.click()}
                                    className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#7047e8] !px-4 !py-2.5 text-sm font-bold text-white transition hover:bg-[#5c35cc]"
                                >
                                    <Upload size={15} />
                                    {profile.hasResume || resumeFile
                                        ? "Replace file"
                                        : "Upload resume"}
                                </button>
                            </div>

                            <input
                                ref={resumeInputRef}
                                type="file"
                                accept=".pdf,.doc,.docx"
                                onChange={handleResumeChange}
                                className="hidden"
                            />

                            {profile.hasResume && !resumeFile && (
                                <div className="mt-4 flex flex-wrap gap-2 border-t border-purple-100 !pt-4">
                                    <button
                                        type="button"
                                        onClick={handleViewResume}
                                        className="inline-flex items-center gap-2 rounded-lg border border-purple-200 bg-white !px-3 !py-2 text-xs font-bold text-[#7047e8] transition hover:bg-purple-50"
                                    >
                                        <FileText size={14} />
                                        View current resume
                                    </button>

                                    <button
                                        type="button"
                                        onClick={handleDownloadResume}
                                        className="inline-flex items-center gap-2 rounded-lg border border-purple-200 bg-white !px-3 !py-2 text-xs font-bold text-[#7047e8] transition hover:bg-purple-50"
                                    >
                                        <ArrowDownToLine size={14} />
                                        Download
                                    </button>
                                </div>
                            )}
                        </div>
                    </SectionCard>

                    {/* Certifications */}
                    <SectionCard
                        number="06"
                        icon={<Award size={19} />}
                        title="Certifications"
                        subtitle="Add courses, credentials, and completed learning"
                        action={
                            <button
                                type="button"
                                onClick={addCertificate}
                                className="inline-flex items-center gap-1.5 rounded-xl border border-purple-200 bg-purple-50 !px-3 !py-2 text-xs font-bold text-[#7047e8] transition hover:bg-purple-100"
                            >
                                <Plus size={14} />
                                Add certificate
                            </button>
                        }
                    >
                        {profile.certifications.length ? (
                            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                                {profile.certifications.map((certificate, index) => (
                                    <div
                                        key={index}
                                        className="rounded-2xl border border-slate-200 bg-[#fdfcff] !p-4 sm:p-5"
                                    >
                                        <div className="mb-4 flex items-center justify-between gap-3">
                                            <div className="flex items-center gap-2">
                                                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-100 text-[#7047e8]">
                                                    <Award size={15} />
                                                </span>

                                                <h3 className="text-sm font-bold text-slate-800">
                                                    Certificate {index + 1}
                                                </h3>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={() => removeCertificate(index)}
                                                title="Remove certificate"
                                                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-500"
                                            >
                                                <Trash2 size={15} />
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                            <FormInput
                                                label="Certification name"
                                                value={certificate.certificationName}
                                                onChange={(event) =>
                                                    updateCertificate(
                                                        index,
                                                        "certificationName",
                                                        event.target.value
                                                    )
                                                }
                                                placeholder="e.g. Java Programming"
                                            />

                                            <FormInput
                                                label="Issuing organization"
                                                value={certificate.issuingOrganization}
                                                onChange={(event) =>
                                                    updateCertificate(
                                                        index,
                                                        "issuingOrganization",
                                                        event.target.value
                                                    )
                                                }
                                                placeholder="e.g. Oracle"
                                            />

                                            <FormInput
                                                label="Issue date"
                                                type="date"
                                                value={certificate.issueDate || ""}
                                                onChange={(event) =>
                                                    updateCertificate(
                                                        index,
                                                        "issueDate",
                                                        event.target.value
                                                    )
                                                }
                                            />

                                            <FormInput
                                                label="Credential ID"
                                                value={certificate.credentialId}
                                                onChange={(event) =>
                                                    updateCertificate(
                                                        index,
                                                        "credentialId",
                                                        event.target.value
                                                    )
                                                }
                                                placeholder="Optional"
                                            />

                                            <div className="md:col-span-2">
                                                <FormInput
                                                    label="Credential URL"
                                                    value={certificate.credentialUrl}
                                                    onChange={(event) =>
                                                        updateCertificate(
                                                            index,
                                                            "credentialUrl",
                                                            event.target.value
                                                        )
                                                    }
                                                    placeholder="https://..."
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="rounded-2xl border border-dashed border-purple-200 bg-purple-50/40 !px-4 !py-6 text-center">
                                <Award className="mx-auto h-8 w-8 text-purple-400" />

                                <p className="mt-2 text-sm font-bold text-slate-700">
                                    Nothing added yet
                                </p>

                                <p className="mt-1 text-xs text-slate-500">
                                    Showcase your learning and achievements here.
                                </p>

                                <button
                                    type="button"
                                    onClick={addCertificate}
                                    className="mt-3 text-xs font-bold text-[#7047e8] hover:underline"
                                >
                                    + Add a certificate
                                </button>
                            </div>
                        )}
                    </SectionCard>

                    {/* Career preferences */}
                    <SectionCard
                        number="07"
                        icon={<Sparkles size={19} />}
                        title="Career preferences"
                        subtitle="Tell us about the opportunities you want"
                    >
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                            <FormInput
                                label="Preferred job role"
                                name="preferredJobRole"
                                value={profile.preferredJobRole}
                                onChange={handleChange}
                                placeholder="e.g. Java Developer"
                            />

                            <FormInput
                                label="Preferred location"
                                name="preferredLocation"
                                value={profile.preferredLocation}
                                onChange={handleChange}
                                placeholder="e.g. Pune, Hybrid, Remote"
                                icon={<MapPin size={16} />}
                            />
                        </div>
                    </SectionCard>

                    {/* Online presence */}
                    <SectionCard
                        number="08"
                        icon={<Globe size={19} />}
                        title="Online presence"
                        subtitle="Help recruiters discover your work and professional profiles"
                    >
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                            <FormInput
                                label="GitHub profile"
                                name="githubUrl"
                                value={profile.githubUrl}
                                onChange={handleChange}
                                placeholder="https://github.com/username"
                                icon={<FileText size={18} />}
                            />

                            <FormInput
                                label="LinkedIn profile"
                                name="linkedinUrl"
                                value={profile.linkedinUrl}
                                onChange={handleChange}
                                placeholder="https://linkedin.com/in/username"
                                icon={<FileText size={18} />}
                            />

                            <FormInput
                                label="Portfolio website"
                                name="portfolioUrl"
                                value={profile.portfolioUrl}
                                onChange={handleChange}
                                placeholder="https://yourportfolio.com"
                                icon={<Globe size={18} />}
                            />
                        </div>

                        <div className="mt-4 flex items-start gap-2 rounded-xl border border-purple-100 bg-purple-50/60 !p-3">
                            <Sparkles
                                size={16}
                                className="mt-0.5 shrink-0 text-[#7047e8]"
                            />

                            <p className="text-xs leading-5 text-slate-600">
                                Add your professional links so recruiters can explore
                                your projects, experience, and achievements.
                            </p>
                        </div>
                    </SectionCard>

                    {/* Save actions */}
                    <div className="sticky bottom-3 z-20 rounded-2xl border border-purple-100 bg-white/95 !p-3 shadow-[0_8px_32px_rgba(49,29,92,0.12)] backdrop-blur-xl sm:p-4">
                        <div className="flex flex-col-reverse justify-between gap-3 sm:flex-row sm:items-center">
                            <p className="hidden text-xs text-slate-500 md:block">
                                Your updates will be saved to your CareerTrack profile.
                            </p>

                            <div className="flex flex-col-reverse gap-2 sm:ml-auto sm:flex-row">
                                <button
                                    type="button"
                                    onClick={() => navigate("/student/profile")}
                                    disabled={saving}
                                    className="rounded-xl border border-slate-200 bg-white !px-5 !py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#7047e8] !px-6 !py-3 text-sm font-bold text-white shadow-lg shadow-purple-200 transition hover:-translate-y-0.5 hover:bg-[#5c35cc] disabled:cursor-not-allowed disabled:opacity-70"
                                >
                                    {saving ? (
                                        <>
                                            <Loader2
                                                size={17}
                                                className="animate-spin"
                                            />
                                            Saving profile...
                                        </>
                                    ) : (
                                        <>
                                            <Save size={17} />
                                            Save changes
                                            <Check size={15} />
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </form>

                <p className="py-6 text-center text-xs text-slate-400">
                    CareerTrack · Your next opportunity starts with your story.
                </p>
            </main>
        </div>
    );
};

const SectionCard = ({
    number,
    icon,
    title,
    subtitle,
    badge,
    action,
    children,
}) => (
    <section className="min-w-0 rounded-[22px] border border-[#ebe7f6] bg-white !p-4 shadow-[0_4px_22px_rgba(49,29,92,0.035)] transition-shadow hover:shadow-[0_8px_28px_rgba(49,29,92,0.055)] sm:p-5 lg:p-6">
        <div className="mb-5 flex items-start justify-between gap-3">
            <div className="flex min-w-0 items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-[#7047e8]">
                    {icon}
                </div>

                <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-base font-extrabold tracking-tight text-slate-800">
                            {title}
                        </h2>

                        {badge && (
                            <span className="rounded-full bg-purple-50 !px-2 !py-0.5 text-[10px] font-bold text-purple-700">
                                {badge}
                            </span>
                        )}
                    </div>

                    <p className="mt-1 text-xs leading-5 text-slate-400">
                        {subtitle}
                    </p>
                </div>
            </div>

            {number && (
                <span className="hidden shrink-0 rounded-lg bg-[#faf8ff] !px-2 !py-1 text-[10px] font-extrabold tracking-wider text-purple-400 sm:block">
                    {number}
                </span>
            )}

            {action}
        </div>

        {children}
    </section>
);

const FormInput = ({
    label,
    name,
    value,
    onChange,
    type = "text",
    placeholder = "",
    disabled = false,
    required = false,
    helper,
    icon,
    min,
    max,
    step,
}) => (
    <div className="min-w-0">
        <label className="mb-1.5 block text-xs font-bold text-slate-600">
            {label}
            {required && <span className="ml-1 text-red-500">*</span>}
        </label>

        <div className="relative">
            {icon && (
                <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8b6be8]">
                    {icon}
                </span>
            )}

            <input
                name={name}
                type={type}
                value={value ?? ""}
                onChange={onChange}
                placeholder={placeholder}
                disabled={disabled}
                required={required}
                min={min}
                max={max}
                step={step}
                className={`w-full rounded-xl border border-slate-200 bg-[#fcfbff] !px-3.5 !py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 hover:border-purple-200 focus:border-purple-400 focus:ring-4 focus:ring-purple-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400 ${icon ? "!pl-11" : ""}`}
            />
        </div>

        {helper && (
            <p className="mt-1.5 text-[11px] leading-4 text-slate-400">
                {helper}
            </p>
        )}
    </div>
);

const FormSelect = ({
    label,
    name,
    value,
    onChange,
    options,
    required = false,
}) => (
    <div className="min-w-0">
        <label className="mb-1.5 block text-xs font-bold text-slate-600">
            {label}
            {required && <span className="ml-1 text-red-500">*</span>}
        </label>

        <select
            name={name}
            value={value ?? ""}
            onChange={onChange}
            required={required}
            className="w-full rounded-xl border border-slate-200 bg-[#fcfbff] !px-3.5 !py-3 text-sm text-slate-700 outline-none transition hover:border-purple-200 focus:border-purple-400 focus:ring-4 focus:ring-purple-100"
        >
            {options.map((option) => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    </div>
);

const FormTextarea = ({
    label,
    name,
    value,
    onChange,
    placeholder = "",
    rows = 4,
    maxLength,
    required = false,
    helper,
}) => (
    <div className="min-w-0">
        <label className="mb-1.5 block text-xs font-bold text-slate-600">
            {label}
            {required && <span className="ml-1 text-red-500">*</span>}
        </label>

        <textarea
            name={name}
            value={value ?? ""}
            onChange={onChange}
            placeholder={placeholder}
            rows={rows}
            maxLength={maxLength}
            required={required}
            className="w-full resize-y rounded-xl border border-slate-200 bg-[#fcfbff] !px-3.5 !py-3 text-sm leading-6 text-slate-700 outline-none transition placeholder:text-slate-400 hover:border-purple-200 focus:border-purple-400 focus:ring-4 focus:ring-purple-100"
        />

        {helper && (
            <p className="mt-1.5 text-[11px] text-slate-400">
                {helper}
            </p>
        )}
    </div>
);

export default EditStudentProfile;
