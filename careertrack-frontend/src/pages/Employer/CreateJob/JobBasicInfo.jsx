
import {
    BriefcaseBusiness,
    Building2,
    MapPin,
    FileText,
    Sparkles
} from "lucide-react";

const inputClass =
    "w-full rounded-xl border border-gray-200 bg-gray-50/70 !py-3 !pr-4 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 hover:border-purple-200 focus:border-purple-500 focus:bg-white focus:ring-4 focus:ring-purple-100";

const FieldIcon = ({ children }) => (
    <span className="absolute left-3.5 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg bg-purple-100/80 text-purple-600">
        {children}
    </span>
);

const JobBasicInfo = ({ formData, handleChange }) => {
    return (
        <div className="!p-5 sm:!p-7 lg:!p-8">
            <div className="mb-7 flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600 to-violet-500 text-white shadow-lg shadow-purple-200">
                    <FileText size={23} />
                </div>

                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-xl font-extrabold tracking-tight text-gray-900 sm:text-2xl">
                            Job basic information
                        </h2>
                        <span className="rounded-full bg-purple-50 !px-2.5 !py-1 text-[10px] font-bold uppercase tracking-wider text-purple-700">
                            Step 01
                        </span>
                    </div>

                    <p className="mt-2 text-sm leading-6 text-gray-500">
                        Start with the essentials. Make the role easy for candidates to understand.
                    </p>
                </div>
            </div>

            <div className="mb-6 rounded-2xl border border-purple-100 bg-gradient-to-r from-purple-50 to-fuchsia-50/60 !p-4">
                <div className="flex items-start gap-3">
                    <Sparkles size={19} className="mt-0.5 shrink-0 text-purple-600" />
                    <div>
                        <p className="text-sm font-bold text-purple-900">
                            Make a strong first impression
                        </p>
                        <p className="mt-1 text-xs leading-5 text-purple-700/80">
                            Use a clear job title, the correct company name and a helpful location so candidates can quickly assess the opportunity.
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                {/* Job Title */}
                <div className="md:col-span-2">
                    <label htmlFor="title" className="mb-2 block text-sm font-bold text-gray-700">
                        Job title <span className="text-red-500">*</span>
                    </label>

                    <div className="relative">
                        <FieldIcon>
                            <BriefcaseBusiness size={16} />
                        </FieldIcon>
                        <input
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="e.g. Java Full Stack Developer"
                            required
                            maxLength={120}
                            className={`${inputClass} !pl-[3.75rem]`}
                        />
                    </div>
                    <p className="mt-2 text-right text-xs text-gray-400">
                        {formData.title.length}/120 characters
                    </p>
                </div>

                {/* Company */}
                <div className="md:col-span-2">
                    <label htmlFor="compony" className="mb-2 block text-sm font-bold text-gray-700">
                        Company name <span className="text-red-500">*</span>
                    </label>

                    <div className="relative">
                        <FieldIcon>
                            <Building2 size={16} />
                        </FieldIcon>
                        <input
                            id="compony"
                            name="compony"
                            value={formData.compony}
                            onChange={handleChange}
                            placeholder="e.g. TechVision Solutions"
                            required
                            className={`${inputClass} !pl-[3.75rem]`}
                        />
                    </div>
                </div>

                {/* Location */}
                <div>
                    <label htmlFor="location" className="mb-2 block text-sm font-bold text-gray-700">
                        Job location <span className="text-red-500">*</span>
                    </label>

                    <div className="relative">
                        <FieldIcon>
                            <MapPin size={16} />
                        </FieldIcon>
                        <input
                            id="location"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            placeholder="e.g. Pune, Maharashtra"
                            required
                            className={`${inputClass} !pl-[3.75rem]`}
                        />
                    </div>
                </div>

                {/* Job Type */}
                <div>
                    <label htmlFor="jobtype" className="mb-2 block text-sm font-bold text-gray-700">
                        Employment type <span className="text-red-500">*</span>
                    </label>

                    <select
                        id="jobtype"
                        name="jobtype"
                        value={formData.jobtype}
                        onChange={handleChange}
                        required
                        className={`${inputClass} !px-4`}
                    >
                        <option value="FULL_TIME">Full Time</option>
                        <option value="PART_TIME">Part Time</option>
                        <option value="INTERNSHIP">Internship</option>
                        <option value="CONTRACT">Contract</option>
                    </select>
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                    <div className="mb-2 flex items-center justify-between gap-3">
                        <label htmlFor="description" className="text-sm font-bold text-gray-700">
                            Job description <span className="text-red-500">*</span>
                        </label>
                        <span className="text-xs text-gray-400">
                            {formData.description.length} characters
                        </span>
                    </div>

                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Describe the role, responsibilities, team and what the candidate will work on..."
                        rows={7}
                        required
                        className={`${inputClass} !px-4 !py-4 leading-6 resize-y`}
                    />

                    <p className="mt-2 text-xs leading-5 text-gray-400">
                        Tip: Explain the role's main responsibilities and what a successful candidate will contribute.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default JobBasicInfo;
