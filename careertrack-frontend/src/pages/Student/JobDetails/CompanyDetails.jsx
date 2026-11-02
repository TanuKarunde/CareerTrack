
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    ArrowLeft, ExternalLink, Building2, Users, MapPin, Target,
    Eye, BarChart3, Heart, GraduationCap, Clock3,
    BriefcaseBusiness, MessageCircle, ChevronRight, Sparkles,
    Globe2, CalendarDays, Image as ImageIcon
} from "lucide-react";

import { getCompanyByEmployer } from "../../../services/jobService";
import Sidebar from "../../../components/Sidebar/Sidebar";
import UserNavbar from "../Navbar/UserNavbar";

const API_BASE = "http://localhost:8080";

const CompanyDetails = () => {
    const { employerId } = useParams();
    const navigate = useNavigate();

    const [company, setCompany] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [activeTab, setActiveTab] = useState("overview");
    const [isOpen, setIsOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token =
            localStorage.getItem("token") ||
            localStorage.getItem("careertrack_token");

        setIsLoggedIn(Boolean(token && token !== "null" && token !== "undefined"));
    }, []);

    useEffect(() => {
        let cancelled = false;

        const fetchCompany = async () => {
            if (!employerId) {
                setError("Company ID is missing");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError("");

                const data = await getCompanyByEmployer(employerId);
                if (!cancelled) setCompany(data);
            } catch (err) {
                console.error("Failed to load company:", err);
                if (!cancelled) {
                    setError(err?.message || "Unable to load company details");
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        fetchCompany();
        return () => { cancelled = true; };
    }, [employerId]);

    const backToJobs = () => navigate(isLoggedIn ? "/student/jobs" : "/");

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#F8F7FF]">
                <div className="text-center">
                    <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-purple-100 border-t-[#5841D8]" />
                    <p className="mt-4 text-sm font-medium text-slate-500">Loading company profile...</p>
                </div>
            </div>
        );
    }

    if (error || !company) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#F8F7FF] !p-5">
                <div className="w-full max-w-md rounded-3xl border border-purple-100 bg-white !p-8 text-center shadow-xl shadow-purple-100/50">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-50 text-purple-600">
                        <Building2 size={30} />
                    </div>
                    <h2 className="mt-5 text-xl font-extrabold text-[#202044]">
                        Company profile unavailable
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-slate-500">
                        {error || "We couldn't find this company."}
                    </p>
                    <button
                        type="button"
                        onClick={backToJobs}
                        className="mt-6 rounded-xl bg-[#5841D8] !px-5 !py-3 text-sm font-bold text-white transition hover:bg-[#4935C0]"
                    >
                        {isLoggedIn ? "Back to Jobs" : "Back to Home"}
                    </button>
                </div>
            </div>
        );
    }

    const companyName = company.name || "Company";
    const tagline = company.tagline || "Building innovative solutions for a better tomorrow.";
    const industry = company.industry || "Industry not specified";
    const location = company.headquarters || company.location || "Location not specified";
    const companySize = company.companySize || company.size || "Not specified";
    const founded = company.founded || "Not specified";
    const website = company.website
        ? company.website.startsWith("http")
            ? company.website
            : `https://${company.website}`
        : null;

    const gallery = Array.isArray(company.gallery)
        ? company.gallery
        : Array.isArray(company.images)
        ? company.images
        : company.imageUrl
        ? [company.imageUrl]
        : [];

    const tabs = [
        { id: "overview", label: "Overview" },
        { id: "about", label: "About Company" },
        { id: "careers", label: "Careers" },
        { id: "reviews", label: "Reviews" }
    ];

    return (
        <div className="min-h-screen bg-[#F8F7FF]">
            {isLoggedIn && (
                <aside className="fixed left-0 top-0 z-40 hidden h-screen w-[250px] lg:block">
                    <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
                </aside>
            )}

            <div className={`min-h-screen min-w-0 ${isLoggedIn ? "lg:!ml-[250px]" : "w-full"}`}>
                {isLoggedIn && (
                    <header className="sticky top-0 z-30 border-b border-purple-100/80 bg-white/90 shadow-sm backdrop-blur-xl">
                        <UserNavbar />
                    </header>
                )}

                <main className="mx-auto w-full max-w-[1600px] !px-4 !py-5 sm:!px-6 lg:!px-8 lg:!py-7">

                    {/* Company hero */}
                    <section className="relative isolate overflow-hidden rounded-3xl border border-[#EAE6FA] bg-white shadow-[0_10px_40px_rgba(55,38,120,0.06)]">
                        <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-[#5841D8] via-[#8B6DF0] to-[#D52DA2]" />
                        <div className="pointer-events-none absolute -right-16 -top-24 -z-10 h-72 w-72 rounded-full bg-purple-100/70 blur-3xl" />
                        <div className="pointer-events-none absolute bottom-[-80px] right-1/3 -z-10 h-48 w-48 rounded-full bg-pink-100/50 blur-3xl" />

                        <div className="relative flex flex-col gap-6 !p-6 md:!p-8 xl:flex-row xl:items-center xl:justify-between">
                            <div className="flex min-w-0 items-start gap-4 md:gap-5">
                                <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-purple-100 bg-white shadow-sm md:h-24 md:w-24">
                                    {company.logoUrl ? (
                                        <img
                                            src={`${API_BASE}${company.logoUrl}`}
                                            alt={companyName}
                                            className="h-full w-full object-contain !p-2"
                                        />
                                    ) : (
                                        <span className="text-4xl font-black text-purple-700">
                                            {companyName.charAt(0).toUpperCase()}
                                        </span>
                                    )}
                                </div>

                                <div className="min-w-0">
                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-50 !px-3 !py-1 text-[11px] font-bold uppercase tracking-wider text-purple-700">
                                        <Sparkles size={13} /> Company Profile
                                    </span>
                                    <h1 className="mt-3 break-words text-2xl font-extrabold tracking-tight text-[#202044] md:text-3xl">
                                        {companyName}
                                    </h1>
                                    <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 md:text-base">
                                        {tagline}
                                    </p>

                                    <div className="mt-4 flex flex-wrap gap-x-5 gap-y-3 text-xs font-medium text-slate-600 md:text-sm">
                                        <span className="inline-flex items-center gap-2">
                                            <Building2 size={16} className="text-purple-600" /> {industry}
                                        </span>
                                        <span className="inline-flex items-center gap-2">
                                            <Users size={16} className="text-purple-600" /> {companySize}
                                        </span>
                                        <span className="inline-flex items-center gap-2">
                                            <MapPin size={16} className="text-purple-600" /> {location}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {website && (
                                <a
                                    href={website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#5841D8] to-[#7963E8] !px-5 !py-3 text-sm font-bold text-white shadow-md shadow-purple-100 transition hover:-translate-y-0.5 hover:shadow-lg"
                                >
                                    <Globe2 size={17} /> Visit Website <ExternalLink size={15} />
                                </a>
                            )}
                        </div>
                    </section>

                    {/* Tabs */}
                    <nav className="mt-6 overflow-x-auto rounded-2xl border border-[#EAE6FA] bg-white !px-3 shadow-sm sm:!px-5">
                        <div className="flex min-w-max gap-2 sm:gap-5">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`relative !px-3 !py-4 text-sm font-bold transition ${
                                        activeTab === tab.id
                                            ? "text-[#5841D8]"
                                            : "text-slate-500 hover:text-purple-700"
                                    }`}
                                >
                                    {tab.label}
                                    {activeTab === tab.id && (
                                        <span className="absolute bottom-0 left-2 right-2 h-[3px] rounded-t-full bg-gradient-to-r from-[#5841D8] to-[#B15AE2]" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </nav>

                    {activeTab === "overview" && (
                        <OverviewSection
                            company={company}
                            companyName={companyName}
                            location={location}
                            companySize={companySize}
                            founded={founded}
                            gallery={gallery}
                        />
                    )}

                    {activeTab === "about" && <AboutSection company={company} />}

                    {activeTab === "careers" && (
                        <CareersSection
                            employerId={employerId}
                            navigate={navigate}
                        />
                    )}

                    {activeTab === "reviews" && <ReviewsSection />}
                </main>
            </div>
        </div>
    );
};

const SectionTitle = ({ icon, title, subtitle }) => (
    <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-700">
            {icon}
        </span>
        <div>
            <h2 className="text-lg font-extrabold text-[#202044]">{title}</h2>
            {subtitle && <p className="mt-1 text-xs text-slate-500">{subtitle}</p>}
        </div>
    </div>
);

const InfoBox = ({ icon, title, text }) => (
    <div className="rounded-2xl border border-purple-100/80 bg-gradient-to-br from-[#F8F6FF] to-white !p-5">
        <div className="flex items-center gap-3">
            <span className="rounded-xl bg-white !p-2.5 text-purple-700 shadow-sm">{icon}</span>
            <h3 className="font-bold text-[#202044]">{title}</h3>
        </div>
        <p className="mt-4 text-sm leading-6 text-slate-600">{text}</p>
    </div>
);

const Stat = ({ icon, value, label }) => (
    <div className="rounded-2xl border border-slate-100 bg-white !p-4">
        <span className="inline-flex rounded-xl bg-purple-50 !p-2.5 text-purple-700">{icon}</span>
        <p className="mt-4 break-words text-lg font-extrabold text-[#202044]">{value}</p>
        <p className="mt-1 text-xs font-medium text-slate-500">{label}</p>
    </div>
);

const OverviewSection = ({ company, companyName, location, companySize, founded, gallery }) => (
    <div className="mt-5 grid grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="min-w-0 space-y-5">
            <section className="rounded-2xl border border-[#EAE6FA] bg-white !p-5 shadow-sm md:!p-6">
                <SectionTitle
                    icon={<Building2 size={21} />}
                    title="About the Company"
                    subtitle="Get to know the team and what they do"
                />
                <p className="mt-5 whitespace-pre-line text-sm leading-7 text-slate-600">
                    {company.about || `${companyName} is a growing company focused on delivering innovative solutions and helping people build their careers.`}
                </p>

                <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                    <InfoBox
                        icon={<Target size={20} />}
                        title="Our Mission"
                        text={company.mission || "To create useful solutions, solve meaningful problems, and help our people grow."}
                    />
                    <InfoBox
                        icon={<Eye size={20} />}
                        title="Our Vision"
                        text={company.vision || "To build a future-focused organization where people and innovation thrive."}
                    />
                </div>
            </section>

            <section className="rounded-2xl border border-[#EAE6FA] bg-white !p-5 shadow-sm md:!p-6">
                <SectionTitle
                    icon={<BarChart3 size={21} />}
                    title="Company at a Glance"
                    subtitle="A quick snapshot of the organization"
                />
                <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
                    <Stat icon={<Users size={18} />} value={companySize} label="Company Size" />
                    <Stat icon={<CalendarDays size={18} />} value={founded} label="Founded" />
                    <Stat icon={<MapPin size={18} />} value={location} label="Headquarters" />
                    <Stat icon={<Building2 size={18} />} value={company.products || "10+"} label="Products & Solutions" />
                </div>
            </section>

            <section className="rounded-2xl border border-[#EAE6FA] bg-white !p-5 shadow-sm md:!p-6">
                <SectionTitle
                    icon={<Heart size={21} />}
                    title="Our Work Culture"
                    subtitle="A place to learn, collaborate, and grow"
                />
                <p className="mt-5 text-sm leading-7 text-slate-600">
                    We believe in a supportive work environment where ideas are valued, people learn from each other, and everyone has opportunities to contribute.
                </p>
                <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
                    {[
                        { icon: <Clock3 size={18} />, title: "Flexible", sub: "Work Hours" },
                        { icon: <Heart size={18} />, title: "Health", sub: "Wellbeing" },
                        { icon: <GraduationCap size={18} />, title: "Learning", sub: "& Development" },
                        { icon: <Users size={18} />, title: "Team", sub: "Collaboration" }
                    ].map((item) => (
                        <div key={item.title} className="rounded-xl bg-[#F8F6FF] !p-3">
                            <span className="inline-flex rounded-lg bg-white !p-2 text-purple-700 shadow-sm">{item.icon}</span>
                            <p className="mt-3 text-sm font-bold text-[#202044]">{item.title}</p>
                            <p className="text-xs text-slate-500">{item.sub}</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>

        <div className="min-w-0 space-y-5">
            <CompanyGallery gallery={gallery} />
            <LocationCard companyName={companyName} location={location} />
        </div>
    </div>
);

const CompanyGallery = ({ gallery }) => (
    <section className="rounded-2xl border border-[#EAE6FA] bg-white !p-4 shadow-sm">
        <SectionTitle icon={<ImageIcon size={20} />} title="Company Gallery" subtitle="A glimpse of the workplace" />
        {gallery.length > 0 ? (
            <div className="mt-4 grid grid-cols-2 gap-2">
                {gallery.slice(0, 4).map((image, index) => {
                    const imageUrl = !image
                        ? ""
                        : image.startsWith("http")
                        ? image
                        : `${API_BASE}${image}`;

                    return (
                        <img
                            key={`${image}-${index}`}
                            src={imageUrl}
                            alt={`Company gallery ${index + 1}`}
                            className={`${index === 0 ? "col-span-2 h-48" : "h-24"} w-full rounded-xl border border-slate-100 object-cover`}
                            loading="lazy"
                        />
                    );
                })}
            </div>
        ) : (
            <div className="mt-4 flex h-48 flex-col items-center justify-center rounded-xl border border-dashed border-purple-200 bg-gradient-to-br from-purple-50 to-white text-purple-600">
                <Building2 size={35} />
                <p className="mt-3 text-sm font-semibold text-slate-700">Gallery coming soon</p>
                <p className="mt-1 text-xs text-slate-500">Company photos will appear here.</p>
            </div>
        )}
    </section>
);

const LocationCard = ({ companyName, location }) => (
    <section className="rounded-2xl border border-[#EAE6FA] bg-white !p-5 shadow-sm">
        <SectionTitle icon={<MapPin size={20} />} title="Location" subtitle="Company headquarters" />
        <p className="mt-4 text-sm font-bold text-[#202044]">{companyName}</p>
        <p className="mt-1 text-sm text-slate-500">{location}</p>
        <div className="relative mt-4 flex h-44 items-center justify-center overflow-hidden rounded-xl border border-purple-100 bg-[#F1EEFF]">
            <div className="absolute inset-0 opacity-60">
                <div className="absolute left-[-15%] top-[25%] h-3 w-[130%] rotate-[-18deg] rounded-full bg-white" />
                <div className="absolute left-[-15%] top-[65%] h-4 w-[130%] rotate-[20deg] rounded-full bg-white" />
                <div className="absolute left-[25%] top-[-20%] h-[150%] w-3 rotate-[18deg] rounded-full bg-white" />
                <div className="absolute left-[72%] top-[-20%] h-[150%] w-4 rotate-[-15deg] rounded-full bg-white" />
            </div>
            <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-[#5841D8] text-white shadow-lg shadow-purple-300">
                <MapPin size={23} />
            </div>
        </div>
        <p className="mt-3 text-xs leading-5 text-slate-400">
            This is a visual location placeholder, not a live interactive map.
        </p>
    </section>
);

const AboutSection = ({ company }) => (
    <section className="mt-5 rounded-2xl border border-[#EAE6FA] bg-white !p-6 shadow-sm md:!p-8">
        <SectionTitle
            icon={<Building2 size={21} />}
            title="About the Company"
            subtitle="Purpose, values, and direction"
        />
        <p className="mt-6 max-w-4xl whitespace-pre-line text-sm leading-8 text-slate-600">
            {company.about || "Company information is not available yet."}
        </p>
        <div className="mt-7 grid grid-cols-1 gap-5 md:grid-cols-2">
            <InfoBox
                icon={<Target size={20} />}
                title="Our Mission"
                text={company.mission || "To create meaningful solutions and provide an environment where people can grow."}
            />
            <InfoBox
                icon={<Eye size={20} />}
                title="Our Vision"
                text={company.vision || "To grow through innovation, collaboration, and a commitment to quality."}
            />
        </div>
    </section>
);

const CareersSection = ({ employerId, navigate }) => (
    <section className="relative mt-5 overflow-hidden rounded-3xl border border-purple-100 bg-white !p-6 shadow-sm md:!p-9">
        <div className="absolute -right-10 -top-10 h-44 w-44 rounded-full bg-purple-100/60 blur-3xl" />
        <div className="relative max-w-2xl">
            <span className="inline-flex rounded-xl bg-purple-50 !p-3 text-purple-700">
                <BriefcaseBusiness size={24} />
            </span>
            <h2 className="mt-5 text-2xl font-extrabold text-[#202044]">Build your next chapter</h2>
            <p className="mt-3 text-sm leading-7 text-slate-500">
                Explore opportunities with this company and find a role that matches your skills, interests, and career goals.
            </p>
            <button
                type="button"
                onClick={() => navigate(`/student/jobs?employerId=${employerId}`)}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#5841D8] to-[#7963E8] !px-5 !py-3 text-sm font-bold text-white shadow-md shadow-purple-100 transition hover:-translate-y-0.5"
            >
                Explore Open Jobs <ChevronRight size={17} />
            </button>
        </div>
    </section>
);

const ReviewsSection = () => (
    <section className="mt-5 rounded-2xl border border-[#EAE6FA] bg-white !p-7 text-center shadow-sm md:!p-10">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-50 text-purple-600">
            <MessageCircle size={30} />
        </div>
        <h2 className="mt-5 text-xl font-extrabold text-[#202044]">Employee & Candidate Reviews</h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
            There are no reviews to display yet. Company reviews can be shown here when review data becomes available.
        </p>
        <span className="mt-5 inline-flex items-center gap-2 rounded-full bg-slate-50 !px-4 !py-2 text-xs font-semibold text-slate-500">
            <MessageCircle size={14} /> No reviews yet
        </span>
    </section>
);

export default CompanyDetails;
