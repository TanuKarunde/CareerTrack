
import { useState } from "react";
import {
    Building2, ArrowLeft, ArrowRight, Loader2, Globe,
    MapPin, CalendarDays, Sparkles, CircleAlert
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../../../components/Sidebar/Sidebar";
import EmployerNavbar from "../ENavbar/EmployerNavbar";

const CreateCompany = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        tagline: "",
        website: "",
        industry: "",
        founded: "",
        headquarters: "",
        about: ""
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(previous => ({ ...previous, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("You are not logged in.");

            const payload = {
                ...formData,
                founded: formData.founded ? Number(formData.founded) : null
            };

            const response = await fetch("http://localhost:8080/api/company", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                throw new Error(data?.message || "Failed to create company.");
            }

            navigate("/employer/dashboard");
        } catch (err) {
            setError(err?.message || "Unable to create company.");
        } finally {
            setLoading(false);
        }
    };

    const fields = [
        {
            name: "name",
            label: "Company name",
            placeholder: "e.g. CareerTrack Technologies",
            required: true,
            icon: <Building2 size={17} />
        },
        {
            name: "tagline",
            label: "Company tagline",
            placeholder: "Building the future with technology",
            icon: <Sparkles size={17} />
        },
        {
            name: "website",
            label: "Company website",
            placeholder: "https://company.com",
            required: true,
            type: "url",
            icon: <Globe size={17} />,
            hint: "Your employer email domain must match this website."
        },
        {
            name: "industry",
            label: "Industry",
            placeholder: "Information Technology",
            required: true,
            icon: <Building2 size={17} />
        },
        {
            name: "founded",
            label: "Founded year",
            placeholder: "2020",
            type: "number",
            min: 1800,
            max: 2100,
            icon: <CalendarDays size={17} />
        },
        {
            name: "headquarters",
            label: "Headquarters",
            placeholder: "Pune, Maharashtra",
            required: true,
            icon: <MapPin size={17} />
        }
    ];

    return (
        <div className="min-h-screen !bg-[#f7f5ff] lg:!grid lg:!grid-cols-[250px_minmax(0,1fr)]">
            <aside className="!sticky !top-0 !z-30 !hidden !h-screen lg:!block">
                <Sidebar />
            </aside>

            <main className="!min-w-0">
                <div className="!sticky !top-0 !z-20">
                    <EmployerNavbar />
                </div>

                <div className="!mx-auto !max-w-[1400px] !px-4 !py-6 sm:!px-6 lg:!px-8">
                    <button
                        type="button"
                        onClick={() => navigate("/employer/dashboard")}
                        className="!mb-5 !inline-flex !items-center !gap-2 !rounded-xl !border !border-purple-100 !bg-white !px-4 !py-2.5 !text-sm !font-semibold !text-gray-600 !shadow-sm !transition hover:!border-purple-300 hover:!bg-purple-50 hover:!text-purple-700"
                    >
                        <ArrowLeft size={17} />
                        Back to dashboard
                    </button>

                    <section className="!relative !mb-7 !overflow-hidden !rounded-[28px] !bg-gradient-to-br !from-[#32106d] !via-[#682bd5] !to-[#a78bfa] !p-6 !text-white !shadow-xl !shadow-purple-200/70 sm:!p-9">
                        <div className="!pointer-events-none !absolute !-right-8 !-top-16 !h-56 !w-56 !rounded-full !border-[30px] !border-white/10" />
                        <div className="!relative !z-10 !flex !items-center !gap-4">
                            <div className="!flex !h-16 !w-16 !shrink-0 !items-center !justify-center !rounded-2xl !border !border-white/20 !bg-white/15 !shadow-lg !backdrop-blur-md">
                                <Building2 size={30} />
                            </div>
                            <div>
                                <div className="!mb-1 !flex !items-center !gap-2 !text-xs !font-bold !uppercase !tracking-[0.18em] !text-purple-100">
                                    <Sparkles size={14} /> Company setup
                                </div>
                                <h1 className="!text-2xl !font-black !tracking-tight sm:!text-3xl">
                                    Create your company
                                </h1>
                                <p className="!mt-2 !max-w-2xl !text-sm !leading-6 !text-purple-100">
                                    Build your company presence on CareerTrack and get ready to connect with promising candidates.
                                </p>
                            </div>
                        </div>
                    </section>

                    <div className="!grid !grid-cols-1 !items-start !gap-6 xl:!grid-cols-[minmax(0,1fr)_300px]">
                        <section className="!overflow-hidden !rounded-[26px] !border !border-purple-100 !bg-white !shadow-lg !shadow-purple-100/50">
                            <div className="!border-b !border-gray-100 !px-6 !py-5 sm:!px-8">
                                <h2 className="!text-lg !font-extrabold !text-gray-900">Company details</h2>
                                <p className="!mt-1 !text-sm !text-gray-500">
                                    Fields marked with * are required.
                                </p>
                            </div>

                            {error && (
                                <div role="alert" className="!mx-6 !mt-5 !flex !gap-3 !rounded-xl !border !border-red-200 !bg-red-50 !p-4 !text-sm !text-red-700 sm:!mx-8">
                                    <CircleAlert size={19} className="!shrink-0" />
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="!space-y-6 !p-6 sm:!p-8">
                                <div className="!grid !grid-cols-1 !gap-x-5 !gap-y-5 md:!grid-cols-2">
                                    {fields.map(field => (
                                        <div key={field.name} className={field.name === "website" ? "md:!col-span-2" : ""}>
                                            <label htmlFor={field.name} className="!mb-2 !flex !items-center !gap-2 !text-sm !font-bold !text-gray-700">
                                                <span className="!text-purple-600">{field.icon}</span>
                                                {field.label}
                                                {field.required && <span className="!text-rose-500">*</span>}
                                            </label>
                                            <input
                                                id={field.name}
                                                type={field.type || "text"}
                                                name={field.name}
                                                value={formData[field.name]}
                                                onChange={handleChange}
                                                placeholder={field.placeholder}
                                                required={field.required}
                                                min={field.min}
                                                max={field.max}
                                                className="!w-full !rounded-xl !border !border-gray-200 !bg-gray-50/70 !px-4 !py-3 !text-sm !text-gray-800 !outline-none !transition placeholder:!text-gray-400 focus:!border-purple-400 focus:!bg-white focus:!ring-4 focus:!ring-purple-100"
                                            />
                                            {field.hint && (
                                                <p className="!mt-2 !text-xs !leading-5 !text-gray-400">{field.hint}</p>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                <div>
                                    <label htmlFor="about" className="!mb-2 !block !text-sm !font-bold !text-gray-700">
                                        About your company <span className="!text-rose-500">*</span>
                                    </label>
                                    <textarea
                                        id="about"
                                        name="about"
                                        value={formData.about}
                                        onChange={handleChange}
                                        placeholder="Share your mission, company culture, products, and what makes your team special..."
                                        rows={5}
                                        required
                                        className="!w-full !resize-y !rounded-xl !border !border-gray-200 !bg-gray-50/70 !px-4 !py-3 !text-sm !leading-6 !text-gray-800 !outline-none !transition placeholder:!text-gray-400 focus:!border-purple-400 focus:!bg-white focus:!ring-4 focus:!ring-purple-100"
                                    />
                                </div>

                                <div className="!flex !flex-col-reverse !gap-3 !border-t !border-gray-100 !pt-5 sm:!flex-row sm:!justify-end">
                                    <button
                                        type="button"
                                        onClick={() => navigate("/employer/dashboard")}
                                        className="!rounded-xl !border !border-gray-200 !bg-white !px-5 !py-3 !text-sm !font-bold !text-gray-600 !transition hover:!bg-gray-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="!inline-flex !items-center !justify-center !gap-2 !rounded-xl !bg-gradient-to-r !from-purple-700 !to-violet-600 !px-6 !py-3 !text-sm !font-bold !text-white !shadow-lg !shadow-purple-200 !transition hover:!-translate-y-0.5 hover:!from-purple-800 disabled:!cursor-not-allowed disabled:!opacity-60"
                                    >
                                        {loading ? (
                                            <><Loader2 size={18} className="!animate-spin" /> Creating company...</>
                                        ) : (
                                            <>Create company <ArrowRight size={17} /></>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </section>

                        <aside className="!space-y-4">
                            <div className="!rounded-[24px] !border !border-purple-100 !bg-white !p-6 !shadow-md !shadow-purple-100/50">
                                <div className="!mb-4 !flex !h-12 !w-12 !items-center !justify-center !rounded-2xl !bg-gradient-to-br !from-purple-600 !to-fuchsia-500 !text-white">
                                    <Sparkles size={22} />
                                </div>
                                <h3 className="!text-lg !font-extrabold !text-gray-900">Make it stand out</h3>
                                <p className="!mt-2 !text-sm !leading-6 !text-gray-500">
                                    A clear company description helps candidates understand who you are and why they should join your team.
                                </p>
                                <div className="!mt-5 !space-y-3">
                                    {["Use your official website", "Choose the correct industry", "Describe your culture and mission"].map((tip, index) => (
                                        <div key={tip} className="!flex !items-start !gap-3 !text-sm !text-gray-600">
                                            <span className="!flex !h-6 !w-6 !shrink-0 !items-center !justify-center !rounded-full !bg-purple-100 !text-xs !font-extrabold !text-purple-700">{index + 1}</span>
                                            <span className="!pt-0.5">{tip}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="!rounded-[24px] !bg-gradient-to-br !from-[#3c167b] !to-[#7950dc] !p-6 !text-white !shadow-lg !shadow-purple-200/70">
                                <Globe size={24} className="!mb-4 !text-purple-200" />
                                <h3 className="!font-extrabold">One company profile</h3>
                                <p className="!mt-2 !text-sm !leading-6 !text-purple-100">
                                    If your company already exists on CareerTrack, use the Company Profile page to join it instead of creating a duplicate.
                                </p>
                            </div>
                        </aside>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default CreateCompany;
