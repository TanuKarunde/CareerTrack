
import { useNavigate } from "react-router-dom";
import {
    Building2, ExternalLink, MapPin, ArrowRight, CalendarDays, Globe2
} from "lucide-react";

const ComponyInfo = ({ company, job }) => {
    const navigate = useNavigate();
    const employerId = job?.employerId;

    if (!company) {
        return (
            <aside className="rounded-2xl border border-slate-100 bg-white !p-6 shadow-sm">
                <div className="flex items-center gap-3">
                    <span className="rounded-xl bg-purple-50 !p-3 text-purple-600">
                        <Building2 size={22} />
                    </span>
                    <h2 className="font-bold text-[#202044]">About Company</h2>
                </div>
                <p className="mt-5 text-sm text-slate-500">Company information is not available right now.</p>
            </aside>
        );
    }

    const website = company.website
        ? company.website.startsWith("http")
            ? company.website
            : `https://${company.website}`
        : null;

    const facts = [
        company.industry && { label: "Industry", value: company.industry, icon: <Building2 size={16} /> },
        (company.headquarters || company.location) && {
            label: "Headquarters",
            value: company.headquarters || company.location,
            icon: <MapPin size={16} />
        },
        company.founded && {
            label: "Founded",
            value: company.founded,
            icon: <CalendarDays size={16} />
        }
    ].filter(Boolean);

    return (
        <aside className="overflow-hidden rounded-2xl border border-[#EAE6FA] bg-white shadow-[0_8px_28px_rgba(54,37,120,0.06)]">
            <div className="h-2 bg-gradient-to-r from-[#5841D8] via-[#8C6DF0] to-[#D52DA2]" />

            <div className="!p-5 md:!p-6">
                <div className="flex items-center justify-between gap-3">
                    <h2 className="text-lg font-extrabold text-[#202044]">About Company</h2>
                    <span className="rounded-lg bg-purple-50 !p-2 text-purple-600">
                        <Building2 size={18} />
                    </span>
                </div>

                <div className="mt-5 flex items-center gap-3">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-purple-100 bg-gradient-to-br from-purple-50 to-white">
                        {company.logoUrl ? (
                            <img
                                src={`http://localhost:8080${company.logoUrl}`}
                                alt={company.name || "Company"}
                                className="h-full w-full object-contain !p-1.5"
                            />
                        ) : (
                            <span className="text-xl font-black text-purple-700">
                                {company.name?.charAt(0)?.toUpperCase() || "C"}
                            </span>
                        )}
                    </div>
                    <div className="min-w-0">
                        <h3 className="break-words font-bold text-[#202044]">{company.name || "Company"}</h3>
                        <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">
                            {company.tagline || company.industry || "Explore this employer"}
                        </p>
                    </div>
                </div>

                {company.about && (
                    <div className="mt-5">
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">About</p>
                        <p className="mt-2 line-clamp-4 text-sm leading-6 text-slate-600">{company.about}</p>
                    </div>
                )}

                {facts.length > 0 && (
                    <div className="mt-5 divide-y divide-slate-100 rounded-xl border border-slate-100 !px-3">
                        {facts.map((fact) => (
                            <div key={fact.label} className="flex items-start gap-3 !py-3">
                                <span className="mt-0.5 text-purple-600">{fact.icon}</span>
                                <div className="min-w-0">
                                    <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{fact.label}</p>
                                    <p className="mt-1 break-words text-sm font-semibold text-slate-700">{fact.value}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {website && (
                    <a
                        href={website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 flex items-center justify-between gap-2 rounded-xl bg-slate-50 !px-3 !py-3 text-sm font-semibold text-slate-600 transition hover:bg-purple-50 hover:text-purple-700"
                    >
                        <span className="flex items-center gap-2"><Globe2 size={16} /> Visit company website</span>
                        <ExternalLink size={15} />
                    </a>
                )}

                <button
                    type="button"
                    onClick={() => employerId && navigate(`/student/company/${employerId}`)}
                    disabled={!employerId}
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#5841D8] to-[#7963E8] !px-4 !py-3 text-sm font-bold text-white shadow-md shadow-purple-100 transition hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
                >
                    View Company Profile <ArrowRight size={17} />
                </button>
            </div>
        </aside>
    );
};

export default ComponyInfo;
