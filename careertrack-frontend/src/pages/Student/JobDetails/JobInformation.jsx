
import { IndianRupee, MapPin, BriefcaseBusiness, Clock3, Info } from "lucide-react";

const JobInformation = ({ job = {} }) => {
    const salaryMin = Number(job.salaryMin || 0).toLocaleString("en-IN");
    const salaryMax = Number(job.salaryMax || 0).toLocaleString("en-IN");

    const items = [
        {
            label: "Salary Range",
            value: job.salaryMin || job.salaryMax
                ? `₹${salaryMin} – ₹${salaryMax}`
                : "Not specified",
            icon: <IndianRupee size={18} />
        },
        {
            label: "Location",
            value: job.location || "Not specified",
            icon: <MapPin size={18} />
        },
        {
            label: "Employment Type",
            value: job.jobType || job.jobtype || "Not specified",
            icon: <BriefcaseBusiness size={18} />
        },
        {
            label: "Experience",
            value: job.experienceLevel || job.experiencelevel || "Fresher",
            icon: <Clock3 size={18} />
        }
    ];

    return (
        <section className="overflow-hidden rounded-2xl border border-[#EAE6FA] bg-white shadow-sm">
            <div className="flex items-center gap-3 border-b border-slate-100 !px-5 !py-4">
                <span className="rounded-xl bg-purple-100 !p-2.5 text-purple-700"><Info size={19} /></span>
                <div>
                    <h2 className="font-bold text-[#202044]">Job Information</h2>
                    <p className="text-xs text-slate-500">Key details at a glance</p>
                </div>
            </div>

            <div className="divide-y divide-slate-100 !px-5">
                {items.map((item) => (
                    <div key={item.label} className="flex items-start gap-3 !py-4">
                        <span className="rounded-lg bg-[#F7F4FF] !p-2 text-purple-600">{item.icon}</span>
                        <div className="min-w-0">
                            <p className="text-xs font-medium text-slate-500">{item.label}</p>
                            <p className="mt-1 break-words text-sm font-bold text-slate-800">{item.value}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default JobInformation;
