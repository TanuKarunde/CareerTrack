
import { useCallback, useEffect, useState } from "react";
import {
    Globe, MapPin, CalendarDays, BriefcaseBusiness, Users, Star,
    Edit3, Loader2, Building2, ArrowUpRight, Sparkles, RefreshCw,
    ShieldCheck, CircleAlert
} from "lucide-react";

import {
    getCompanyLogo,
    getCompanyProfile,
    updateCompanyProfile,
    uploadCompanyLogo,
    joinCompany
} from "../../../services/companyService";

import EditForm from "./EditForm";
import Logo from "./Logo";
import Sidebar from "../../../components/Sidebar/Sidebar";
import EmployerNavbar from "../ENavbar/EmployerNavbar";

const CompanyProfile = () => {
    const [company, setCompany] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [logoUploading, setLogoUploading] = useState(false);
    const [error, setError] = useState("");
    const [noCompany, setNoCompany] = useState(false);
    const [companyWebsite, setCompanyWebsite] = useState("");
    const [joining, setJoining] = useState(false);

    const loadCompany = useCallback(async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getCompanyProfile();
            let logoUrl = null;

            try {
                logoUrl = await getCompanyLogo();
            } catch {
                // A company can exist without a logo.
            }

            setCompany({ ...data, logo: logoUrl });
            setNoCompany(false);
        } catch (err) {
            if (
                err.message?.toLowerCase().includes(
                    "not associated with any company"
                )
            ) {
                setNoCompany(true);
                setCompany(null);
                setError("");
            } else {
                setError(err.message || "Unable to load company profile.");
            }
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadCompany();
    }, [loadCompany]);

    const handleJoinCompany = async () => {
        if (!companyWebsite.trim()) {
            setError("Please enter your company website.");
            return;
        }

        try {
            setJoining(true);
            setError("");

            const response = await joinCompany(companyWebsite.trim());
            let logoUrl = null;

            try {
                logoUrl = await getCompanyLogo();
            } catch {
                // Joining is still successful if no logo exists.
            }

            setCompany({ ...response, logo: logoUrl });
            setNoCompany(false);
            setCompanyWebsite("");
        } catch (err) {
            setError(err.message || "Unable to join company.");
        } finally {
            setJoining(false);
        }
    };

    const handleUpdate = async (formData) => {
        try {
            setSaving(true);
            setError("");

            const payload = {
                name: formData.name,
                tagline: formData.tagline,
                website: formData.website,
                industry: formData.industry,
                founded: formData.founded ? Number(formData.founded) : null,
                headquarters: formData.headquarters,
                about: formData.about
            };

            const response = await updateCompanyProfile(payload);

            setCompany(previous => ({
                ...previous,
                ...response,
                logo: response.logo || previous?.logo || null
            }));

            setEditMode(false);
        } catch (err) {
            setError(err.message || "Unable to update company profile.");
            throw err;
        } finally {
            setSaving(false);
        }
    };

    const handleLogoUpload = async (file) => {
        try {
            setLogoUploading(true);
            setError("");

            await uploadCompanyLogo(file);
            const logoUrl = await getCompanyLogo();

            setCompany(previous => ({
                ...previous,
                logo: logoUrl
            }));
        } catch (err) {
            setError(err.message || "Logo upload failed.");
        } finally {
            setLogoUploading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen !bg-[#f7f5ff] lg:!grid lg:!grid-cols-[250px_minmax(0,1fr)]">
                <aside className="!sticky !top-0 !hidden !h-screen lg:!block">
                    <Sidebar />
                </aside>
                <main className="!flex !min-h-screen !items-center !justify-center">
                    <div className="!flex !flex-col !items-center !gap-4 !rounded-3xl !border !border-purple-100 !bg-white !px-12 !py-10 !shadow-xl !shadow-purple-100/60">
                        <div className="!flex !h-16 !w-16 !items-center !justify-center !rounded-2xl !bg-purple-100">
                            <Loader2 size={30} className="!animate-spin !text-purple-600" />
                        </div>
                        <p className="!font-semibold !text-gray-700">Loading your company profile...</p>
                        <p className="!text-sm !text-gray-400">Preparing your employer workspace</p>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen !bg-[#f7f5ff] lg:!grid lg:!grid-cols-[250px_minmax(0,1fr)]">
            <aside className="!sticky !top-0 !z-30 !hidden !h-screen lg:!block">
                <Sidebar />
            </aside>

            <main className="!min-w-0">
                <div className="!sticky !top-0 !z-20">
                    <EmployerNavbar />
                </div>

                <div className="!mx-auto !max-w-[1500px] !px-4 !py-6 sm:!px-6 lg:!px-8">
                    {/* Hero */}
                    <section className="!relative !mb-7 !overflow-hidden !rounded-[28px] !bg-gradient-to-br !from-[#31106f] !via-[#652bd3] !to-[#a78bfa] !p-6 !text-white !shadow-xl !shadow-purple-200/70 sm:!p-9">
                        <div className="!pointer-events-none !absolute !-right-12 !-top-20 !h-64 !w-64 !rounded-full !border-[35px] !border-white/10" />
                        <div className="!pointer-events-none !absolute !-bottom-24 !right-1/4 !h-52 !w-52 !rounded-full !bg-fuchsia-300/10 !blur-2xl" />

                        <div className="!relative !z-10 !flex !flex-col !gap-6 md:!flex-row md:!items-end md:!justify-between">
                            <div>
                                <div className="!mb-4 !inline-flex !items-center !gap-2 !rounded-full !border !border-white/20 !bg-white/10 !px-3 !py-1.5 !text-xs !font-semibold !tracking-wide !text-purple-50 !backdrop-blur-md">
                                    <Sparkles size={14} />
                                    EMPLOYER WORKSPACE
                                </div>
                                <h1 className="!text-3xl !font-black !tracking-tight sm:!text-4xl">
                                    Company Profile<span className="!text-purple-200">.</span>
                                </h1>
                                <p className="!mt-3 !max-w-xl !text-sm !leading-6 !text-purple-100 sm:!text-base">
                                    Tell your company’s story, strengthen your brand, and make a great first impression on future teammates.
                                </p>
                            </div>

                            {!noCompany && company && !editMode && (
                                <button
                                    onClick={() => {
                                        setError("");
                                        setEditMode(true);
                                    }}
                                    className="!inline-flex !items-center !justify-center !gap-2 !rounded-xl !border !border-white/25 !bg-white !px-5 !py-3 !text-sm !font-bold !text-purple-800 !shadow-lg !transition hover:!-translate-y-0.5 hover:!bg-purple-50"
                                >
                                    <Edit3 size={16} />
                                    Edit Profile
                                    <ArrowUpRight size={16} />
                                </button>
                            )}
                        </div>
                    </section>

                    {error && (
                        <div role="alert" className="!mb-6 !flex !items-start !gap-3 !rounded-2xl !border !border-red-200 !bg-red-50 !p-4 !text-sm !text-red-700">
                            <CircleAlert size={20} className="!mt-0.5 !shrink-0" />
                            <div className="!flex-1">{error}</div>
                            <button onClick={() => setError("")} className="!rounded-lg !px-2 !font-bold hover:!bg-red-100" aria-label="Dismiss error">×</button>
                        </div>
                    )}

                    {noCompany ? (
                        <section className="!mx-auto !max-w-3xl !overflow-hidden !rounded-[28px] !border !border-purple-100 !bg-white !shadow-xl !shadow-purple-100/50">
                            <div className="!bg-gradient-to-r !from-violet-50 !via-white !to-fuchsia-50 !px-6 !py-8 text-center sm:!px-10">
                                <div className="!mx-auto !mb-5 !flex !h-20 !w-20 !items-center !justify-center !rounded-[26px] !bg-gradient-to-br !from-purple-600 !to-fuchsia-500 !text-white !shadow-lg !shadow-purple-200">
                                    <Building2 size={35} />
                                </div>
                                <span className="!text-xs !font-bold !uppercase !tracking-[0.2em] !text-purple-600">Get connected</span>
                                <h2 className="!mt-2 !text-2xl !font-black !text-gray-900">Join your existing company</h2>
                                <p className="!mx-auto !mt-3 !max-w-lg !text-sm !leading-6 !text-gray-500">
                                    If a colleague has already created your company profile, join it using the same company website instead of creating a duplicate.
                                </p>
                            </div>

                            <div className="!p-6 sm:!p-10">
                                <label htmlFor="companyWebsite" className="!mb-2 !block !text-sm !font-bold !text-gray-700">
                                    Company website
                                </label>
                                <div className="!relative">
                                    <Globe size={19} className="!absolute !left-4 !top-1/2 !-translate-y-1/2 !text-purple-500" />
                                    <input
                                        id="companyWebsite"
                                        type="url"
                                        value={companyWebsite}
                                        onChange={e => setCompanyWebsite(e.target.value)}
                                        onKeyDown={e => {
                                            if (e.key === "Enter") {
                                                e.preventDefault();
                                                handleJoinCompany();
                                            }
                                        }}
                                        placeholder="https://www.example.com"
                                        className="!w-full !rounded-xl !border !border-gray-200 !bg-gray-50 !py-3.5 !pl-12 !pr-4 !text-sm !text-gray-800 !outline-none !transition placeholder:!text-gray-400 focus:!border-purple-400 focus:!bg-white focus:!ring-4 focus:!ring-purple-100"
                                    />
                                </div>
                                <p className="!mt-2 !text-xs !leading-5 !text-gray-400">
                                    Use the same website address associated with the company profile.
                                </p>
                                <button
                                    onClick={handleJoinCompany}
                                    disabled={joining}
                                    className="!mt-6 !flex !w-full !items-center !justify-center !gap-2 !rounded-xl !bg-gradient-to-r !from-purple-700 !to-violet-600 !px-5 !py-3.5 !font-bold !text-white !shadow-lg !shadow-purple-200 !transition hover:!-translate-y-0.5 hover:!from-purple-800 hover:!to-violet-700 disabled:!cursor-not-allowed disabled:!opacity-60"
                                >
                                    {joining ? <><Loader2 size={18} className="!animate-spin" /> Joining company...</> : <><Building2 size={18} /> Join company <ArrowUpRight size={17} /></>}
                                </button>
                            </div>
                        </section>
                    ) : editMode ? (
                        <EditForm
                            company={company}
                            saving={saving}
                            logoUploading={logoUploading}
                            onSave={handleUpdate}
                            onCancel={() => {
                                setEditMode(false);
                                setError("");
                            }}
                            onLogoUpload={handleLogoUpload}
                        />
                    ) : (
                        <>
                            {/* Company identity card */}
                            <section className="!relative !mb-6 !overflow-hidden !rounded-[26px] !border !border-white !bg-white !p-5 !shadow-lg !shadow-purple-100/60 sm:!p-7">
                                <div className="!absolute !right-0 !top-0 !h-32 !w-32 !rounded-bl-full !bg-gradient-to-bl !from-purple-100/80 !to-transparent" />
                                <div className="!relative !flex !flex-col !gap-5 sm:!flex-row sm:!items-center">
                                    <div className="!rounded-[22px] !bg-gradient-to-br !from-purple-100 !to-fuchsia-50 !p-1 !shadow-inner">
                                        <Logo logo={company?.logo} companyName={company?.name} editMode={false} uploading={false} />
                                    </div>

                                    <div className="!min-w-0 !flex-1">
                                        <div className="!mb-2 !flex !flex-wrap !items-center !gap-2">
                                            <span className="!inline-flex !items-center !gap-1 !rounded-full !bg-emerald-50 !px-2.5 !py-1 !text-xs !font-bold !text-emerald-700">
                                                <ShieldCheck size={13} /> Company workspace
                                            </span>
                                            {company?.industry && (
                                                <span className="!rounded-full !bg-purple-50 !px-2.5 !py-1 !text-xs !font-semibold !text-purple-700">
                                                    {company.industry}
                                                </span>
                                            )}
                                        </div>
                                        <h2 className="!break-words !text-2xl !font-black !tracking-tight !text-gray-900 sm:!text-3xl">
                                            {company?.name || "Company Name"}
                                        </h2>
                                        <p className="!mt-2 !max-w-2xl !text-sm !leading-6 !text-gray-500">
                                            {company?.tagline || "Building innovative solutions for a better tomorrow."}
                                        </p>
                                        <div className="!mt-4 !flex !flex-wrap !gap-2">
                                            <Pill>{company?.headquarters || "Headquarters not set"}</Pill>
                                            <Pill>{company?.founded ? `Established ${company.founded}` : "Founded year not set"}</Pill>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Stats */}
                            <section className="!mb-6 !grid !grid-cols-1 !gap-4 sm:!grid-cols-3">
                                <Stat
                                    value={company?.employees ?? "500+"}
                                    label="Employees"
                                    icon={<Users size={20} />}
                                    accent="from-violet-600 to-purple-500"
                                />
                                <Stat
                                    value={company?.openPositions ?? "15+"}
                                    label="Open positions"
                                    icon={<BriefcaseBusiness size={20} />}
                                    accent="from-fuchsia-600 to-pink-500"
                                />
                                <Stat
                                    value={company?.rating ?? "4.5"}
                                    label="Company rating"
                                    icon={<Star size={20} />}
                                    accent="from-amber-500 to-orange-400"
                                />
                            </section>

                            {/* Details */}
                            <section className="!overflow-hidden !rounded-[26px] !border !border-purple-100/80 !bg-white !shadow-lg !shadow-purple-100/50">
                                <div className="!flex !flex-col !gap-3 !border-b !border-gray-100 !px-6 !py-5 sm:!flex-row sm:!items-center sm:!justify-between">
                                    <div className="!flex !items-center !gap-3">
                                        <div className="!flex !h-11 !w-11 !items-center !justify-center !rounded-xl !bg-purple-100 !text-purple-700">
                                            <Building2 size={21} />
                                        </div>
                                        <div>
                                            <h3 className="!text-lg !font-extrabold !text-gray-900">Company information</h3>
                                            <p className="!mt-0.5 !text-xs !text-gray-400">Your public company details at a glance</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={loadCompany}
                                        className="!inline-flex !items-center !gap-2 !self-start !rounded-lg !border !border-gray-200 !px-3 !py-2 !text-xs !font-semibold !text-gray-600 !transition hover:!border-purple-200 hover:!bg-purple-50 hover:!text-purple-700 sm:!self-auto"
                                    >
                                        <RefreshCw size={14} /> Refresh
                                    </button>
                                </div>

                                <div className="!grid !grid-cols-1 !gap-8 !p-6 md:!grid-cols-2 md:!p-8">
                                    <div className="!space-y-6">
                                        <Info icon={<Globe size={18} />} title="Website" value={company?.website || "Not provided"} isLink />
                                        <Info icon={<BriefcaseBusiness size={18} />} title="Industry" value={company?.industry || "Not provided"} />
                                        <Info icon={<CalendarDays size={18} />} title="Founded" value={company?.founded || "Not provided"} />
                                        <Info icon={<MapPin size={18} />} title="Headquarters" value={company?.headquarters || "Not provided"} />
                                    </div>

                                    <div className="!rounded-2xl !border !border-purple-100 !bg-gradient-to-br !from-[#faf7ff] !via-white !to-fuchsia-50/70 !p-5 sm:!p-6">
                                        <div className="!mb-4 !flex !items-center !gap-2">
                                            <span className="!flex !h-9 !w-9 !items-center !justify-center !rounded-xl !bg-white !text-purple-600 !shadow-sm">
                                                <Sparkles size={17} />
                                            </span>
                                            <h4 className="!font-extrabold !text-gray-900">About us</h4>
                                        </div>
                                        <p className="!whitespace-pre-line !text-sm !leading-7 !text-gray-600">
                                            {company?.about || "No company description has been added yet. Add an introduction to help candidates learn about your mission, culture, and team."}
                                        </p>
                                    </div>
                                </div>
                            </section>

                            <p className="!mt-5 !flex !items-center !justify-center !gap-2 !pb-3 !text-center !text-xs !text-gray-400">
                                <ShieldCheck size={14} className="!text-purple-500" />
                                Keep your company details accurate to build trust with candidates.
                            </p>
                        </>
                    )}
                </div>
            </main>
        </div>
    );
};

const Pill = ({ children }) => (
    <span className="!inline-flex !items-center !rounded-lg !border !border-purple-100 !bg-purple-50/80 !px-3 !py-1.5 !text-xs !font-semibold !text-purple-700">
        {children}
    </span>
);

const Info = ({ icon, title, value, isLink = false }) => {
    const website = typeof value === "string" && value !== "Not provided"
        ? (/^https?:\/\//i.test(value) ? value : `https://${value}`)
        : null;

    return (
        <div className="!group !flex !min-w-0 !items-start !gap-4">
            <div className="!flex !h-11 !w-11 !shrink-0 !items-center !justify-center !rounded-xl !bg-purple-50 !text-purple-600 !transition group-hover:!bg-purple-600 group-hover:!text-white">
                {icon}
            </div>
            <div className="!min-w-0 !pt-0.5">
                <p className="!mb-1 !text-xs !font-semibold !uppercase !tracking-wider !text-gray-400">{title}</p>
                {isLink && website ? (
                    <a href={website} target="_blank" rel="noreferrer" className="!break-all !text-sm !font-semibold !text-purple-700 hover:!underline">
                        {value}
                    </a>
                ) : (
                    <p className="!break-words !text-sm !font-semibold !leading-6 !text-gray-700">{value}</p>
                )}
            </div>
        </div>
    );
};

const Stat = ({ value, label, icon, accent }) => (
    <div className="!group !relative !overflow-hidden !rounded-2xl !border !border-white !bg-white !p-5 !shadow-md !shadow-purple-100/60 !transition hover:!-translate-y-1 hover:!shadow-xl hover:!shadow-purple-100">
        <div className={`!absolute !right-0 !top-0 !h-24 !w-24 !rounded-bl-full !bg-gradient-to-br ${accent} !opacity-[0.07]`} />
        <div className="!relative !flex !items-center !justify-between !gap-3">
            <div>
                <p className="!text-sm !font-medium !text-gray-500">{label}</p>
                <p className="!mt-2 !text-3xl !font-black !tracking-tight !text-gray-900">{value}</p>
            </div>
            <div className={`!flex !h-12 !w-12 !shrink-0 !items-center !justify-center !rounded-2xl !bg-gradient-to-br ${accent} !text-white !shadow-lg`}>
                {icon}
            </div>
        </div>
        <div className={`!mt-5 !h-1 !w-12 !rounded-full !bg-gradient-to-r ${accent} !transition-all group-hover:!w-20`} />
    </div>
);

export default CompanyProfile;
