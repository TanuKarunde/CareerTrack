
import {
    Briefcase,
    IndianRupee,
    TrendingUp,
    Wallet,
    Info
} from "lucide-react";

const inputClass =
    "w-full rounded-xl border border-gray-200 bg-gray-50/70 !py-3 !pr-4 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 hover:border-purple-200 focus:border-purple-500 focus:bg-white focus:ring-4 focus:ring-purple-100";

const JobRequirements = ({ formData, handleChange }) => {
    return (
        <div className="!p-5 sm:!p-7 lg:!p-8">
            <div className="mb-7 flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-500 text-white shadow-lg shadow-purple-200">
                    <TrendingUp size={23} />
                </div>

                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-xl font-extrabold tracking-tight text-gray-900 sm:text-2xl">
                            Job requirements
                        </h2>
                        <span className="rounded-full bg-purple-50 !px-2.5 !py-1 text-[10px] font-bold uppercase tracking-wider text-purple-700">
                            Step 02
                        </span>
                    </div>

                    <p className="mt-2 text-sm leading-6 text-gray-500">
                        Set expectations for experience and compensation so candidates know what to expect.
                    </p>
                </div>
            </div>

            {/* Experience */}
            <section className="rounded-2xl border border-purple-100 bg-purple-50/50 !p-4 sm:!p-5">
                <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-purple-600 shadow-sm">
                        <Briefcase size={19} />
                    </div>
                    <div>
                        <h3 className="text-sm font-extrabold text-gray-800">
                            Experience level
                        </h3>
                        <p className="mt-1 text-xs text-gray-500">
                            Specify the experience expected for this role.
                        </p>
                    </div>
                </div>

                <label htmlFor="experienceLevel" className="mb-2 block text-sm font-semibold text-gray-700">
                    Required experience
                </label>

                <input
                    id="experienceLevel"
                    name="experienceLevel"
                    value={formData.experienceLevel}
                    onChange={handleChange}
                    placeholder="e.g. Fresher, 0–2 years, 3+ years"
                    className={`${inputClass} !bg-white !px-4`}
                />
            </section>

            {/* Salary */}
            <section className="mt-5 rounded-2xl border border-gray-200 !p-4 sm:!p-5">
                <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                            <Wallet size={19} />
                        </div>
                        <div>
                            <h3 className="text-sm font-extrabold text-gray-800">
                                Salary range
                            </h3>
                            <p className="mt-1 text-xs text-gray-500">
                                Annual salary in Indian rupees
                            </p>
                        </div>
                    </div>

                    <span className="rounded-full bg-emerald-50 !px-3 !py-1.5 text-xs font-bold text-emerald-700">
                        Optional
                    </span>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                        <label htmlFor="salaryMin" className="mb-2 block text-sm font-semibold text-gray-700">
                            Minimum salary
                        </label>

                        <div className="relative">
                            <IndianRupee
                                size={17}
                                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                            />
                            <input
                                id="salaryMin"
                                type="number"
                                name="salaryMin"
                                value={formData.salaryMin}
                                onChange={handleChange}
                                placeholder="300000"
                                min="0"
                                step="1"
                                className={`${inputClass} !pl-10`}
                            />
                        </div>
                        <p className="mt-2 text-xs text-gray-400">
                            Example: ₹3,00,000
                        </p>
                    </div>

                    <div>
                        <label htmlFor="salaryMax" className="mb-2 block text-sm font-semibold text-gray-700">
                            Maximum salary
                        </label>

                        <div className="relative">
                            <IndianRupee
                                size={17}
                                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                            />
                            <input
                                id="salaryMax"
                                type="number"
                                name="salaryMax"
                                value={formData.salaryMax}
                                onChange={handleChange}
                                placeholder="600000"
                                min="0"
                                step="1"
                                className={`${inputClass} !pl-10`}
                            />
                        </div>
                        <p className="mt-2 text-xs text-gray-400">
                            Example: ₹6,00,000
                        </p>
                    </div>
                </div>

                {formData.salaryMin !== "" &&
                    formData.salaryMax !== "" &&
                    Number(formData.salaryMin) <= Number(formData.salaryMax) && (
                        <div className="mt-5 flex items-start gap-3 rounded-xl bg-emerald-50 !p-3.5">
                            <IndianRupee size={17} className="mt-0.5 shrink-0 text-emerald-600" />
                            <div>
                                <p className="text-sm font-bold text-emerald-800">
                                    Salary range added
                                </p>
                                <p className="mt-1 text-xs text-emerald-700">
                                    ₹{Number(formData.salaryMin).toLocaleString("en-IN")} – ₹{Number(formData.salaryMax).toLocaleString("en-IN")} per year
                                </p>
                            </div>
                        </div>
                    )}
            </section>

            <div className="mt-5 flex items-start gap-3 rounded-xl border border-amber-100 bg-amber-50 !p-4">
                <Info size={18} className="mt-0.5 shrink-0 text-amber-600" />
                <p className="text-xs leading-5 text-amber-800">
                    Salary is optional. If you provide both values, make sure the maximum is greater than or equal to the minimum.
                </p>
            </div>
        </div>
    );
};

export default JobRequirements;
