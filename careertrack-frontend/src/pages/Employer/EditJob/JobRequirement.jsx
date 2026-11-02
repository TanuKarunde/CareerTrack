
import { useState } from "react";
import {
    FileText,
    Building2,
    AlignLeft,
    Lightbulb,
} from "lucide-react";

const JobRequirement = ({ formData, handleChange }) => {
    const [descriptionFocused, setDescriptionFocused] = useState(false);

    return (
        <div className="min-h-[430px]">
            <div className="mb-7 flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-fuchsia-500 to-purple-600 text-white shadow-lg shadow-purple-200">
                    <FileText size={23} />
                </div>

                <div>
                    <span className="text-xs font-bold uppercase tracking-[0.16em] text-purple-600">
                        Step 02 · Role details
                    </span>
                    <h2 className="mt-1 text-xl font-extrabold tracking-tight text-gray-900 sm:text-2xl">
                        Describe the opportunity
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-gray-500">
                        Help applicants understand what they will do and who they will work with.
                    </p>
                </div>
            </div>

            <div className="space-y-6">
                <div>
                    <div className="mb-2 flex items-center justify-between gap-3">
                        <label
                            htmlFor="edit-description"
                            className="text-sm font-bold text-gray-700"
                        >
                            Job description
                            <span className="ml-1 text-red-500">*</span>
                        </label>

                        <span className="text-xs font-medium text-gray-400">
                            {(formData.description || "").length} characters
                        </span>
                    </div>

                    <div
                        className={`overflow-hidden rounded-2xl border bg-white transition ${
                            descriptionFocused
                                ? "border-purple-400 ring-4 ring-purple-50"
                                : "border-gray-200 hover:border-purple-200"
                        }`}
                    >
                        <div className="flex items-center gap-2 border-b border-gray-100 bg-gray-50/70 !px-4 !py-3">
                            <AlignLeft size={17} className="text-purple-500" />
                            <span className="text-xs font-bold text-gray-500">
                                ROLE OVERVIEW
                            </span>
                        </div>

                        <textarea
                            id="edit-description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            onFocus={() => setDescriptionFocused(true)}
                            onBlur={() => setDescriptionFocused(false)}
                            rows={8}
                            required
                            placeholder="Describe the responsibilities, day-to-day work, expectations, team and growth opportunities..."
                            className="w-full resize-y bg-transparent !px-4 !py-4 text-sm leading-7 text-gray-700 outline-none placeholder:text-gray-400"
                        />
                    </div>

                    <div className="mt-3 flex items-start gap-2 rounded-xl bg-amber-50 !p-3 text-amber-800">
                        <Lightbulb size={17} className="mt-0.5 shrink-0" />
                        <p className="text-xs leading-5">
                            Tip: Use clear, specific language and focus on the responsibilities and impact of the role.
                        </p>
                    </div>
                </div>

                <div>
                    <label
                        htmlFor="edit-company-description"
                        className="mb-2 block text-sm font-bold text-gray-700"
                    >
                        Company name
                        <span className="ml-1 text-red-500">*</span>
                    </label>

                    <div className="relative">
                        <Building2
                            size={18}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400"
                        />
                        <input
                            id="edit-company-description"
                            type="text"
                            name="compony"
                            value={formData.compony}
                            onChange={handleChange}
                            required
                            placeholder="Enter the company name"
                            className="w-full rounded-xl border border-gray-200 bg-white !py-3 !pl-11 !pr-4 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 hover:border-purple-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-50"
                        />
                    </div>
                    <p className="mt-2 text-xs text-gray-400">
                        This name will be displayed with your job posting.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default JobRequirement;
