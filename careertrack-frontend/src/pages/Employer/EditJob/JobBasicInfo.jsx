
import {
    BriefcaseBusiness,
    MapPin,
    Clock3,
    Building2,
    CircleDollarSign,
} from "lucide-react";

const inputClass =
    "w-full rounded-xl border border-gray-200 bg-white !px-4 !py-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 hover:border-purple-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-50";

const labelClass =
    "mb-2 block text-sm font-bold text-gray-700";

const JobBasicInfo = ({ formData, handleChange }) => {
    return (
        <div className="min-h-[430px]">
            <div className="mb-7 flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600 to-violet-500 text-white shadow-lg shadow-purple-200">
                    <BriefcaseBusiness size={23} />
                </div>

                <div>
                    <span className="text-xs font-bold uppercase tracking-[0.16em] text-purple-600">
                        Step 01 · Essentials
                    </span>
                    <h2 className="mt-1 text-xl font-extrabold tracking-tight text-gray-900 sm:text-2xl">
                        Tell us about the role
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-gray-500">
                        Give candidates a clear first impression of this opportunity.
                    </p>
                </div>
            </div>

            <div className="space-y-5">
                <div>
                    <label className={labelClass} htmlFor="edit-title">
                        Job title <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <BriefcaseBusiness
                            size={18}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400"
                        />
                        <input
                            id="edit-title"
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="e.g. Java Full Stack Developer"
                            required
                            className={`${inputClass} !pl-11`}
                        />
                    </div>
                </div>

                <div>
                    <label className={labelClass} htmlFor="edit-company">
                        Company name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <Building2
                            size={18}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400"
                        />
                        <input
                            id="edit-company"
                            type="text"
                            name="compony"
                            value={formData.compony}
                            onChange={handleChange}
                            placeholder="Enter company name"
                            required
                            className={`${inputClass} !pl-11`}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div>
                        <label className={labelClass} htmlFor="edit-jobtype">
                            Job type <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <Clock3
                                size={17}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400"
                            />
                            <select
                                id="edit-jobtype"
                                name="jobtype"
                                value={formData.jobtype}
                                onChange={handleChange}
                                required
                                className={`${inputClass} !pl-11`}
                            >
                                <option value="">Select job type</option>
                                <option value="FULL_TIME">Full Time</option>
                                <option value="PART_TIME">Part Time</option>
                                <option value="CONTRACT">Contract</option>
                                <option value="INTERNSHIP">Internship</option>
                                <option value="REMOTE">Remote</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className={labelClass} htmlFor="edit-experience">
                            Experience level
                        </label>
                        <select
                            id="edit-experience"
                            name="experienceLevel"
                            value={formData.experienceLevel}
                            onChange={handleChange}
                            className={inputClass}
                        >
                            <option value="">Select experience</option>
                            <option value="Fresher">Fresher</option>
                            <option value="0-1 Years">0–1 Years</option>
                            <option value="1-3 Years">1–3 Years</option>
                            <option value="3-5 Years">3–5 Years</option>
                            <option value="5+ Years">5+ Years</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className={labelClass} htmlFor="edit-location">
                        Location <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <MapPin
                            size={18}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400"
                        />
                        <input
                            id="edit-location"
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            placeholder="e.g. Pune, Maharashtra"
                            required
                            className={`${inputClass} !pl-11`}
                        />
                    </div>
                </div>

                <div className="rounded-2xl border border-purple-100 bg-gradient-to-br from-purple-50/80 to-white !p-5">
                    <div className="mb-4 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-purple-600 shadow-sm">
                            <CircleDollarSign size={20} />
                        </div>
                        <div>
                            <h3 className="text-sm font-extrabold text-gray-800">
                                Salary range
                            </h3>
                            <p className="mt-1 text-xs text-gray-500">
                                Enter the annual salary in INR.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <label className={labelClass} htmlFor="edit-salary-min">
                                Minimum salary (₹)
                            </label>
                            <input
                                id="edit-salary-min"
                                type="number"
                                name="salaryMin"
                                value={formData.salaryMin}
                                onChange={handleChange}
                                min="0"
                                placeholder="300000"
                                className={inputClass}
                            />
                        </div>

                        <div>
                            <label className={labelClass} htmlFor="edit-salary-max">
                                Maximum salary (₹)
                            </label>
                            <input
                                id="edit-salary-max"
                                type="number"
                                name="salaryMax"
                                value={formData.salaryMax}
                                onChange={handleChange}
                                min="0"
                                placeholder="600000"
                                className={inputClass}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobBasicInfo;
