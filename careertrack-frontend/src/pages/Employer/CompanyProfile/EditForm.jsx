
import { useEffect, useState } from "react";
import {
    Save, X, Loader2, Building2, Sparkles, CircleAlert
} from "lucide-react";
import Logo from "./Logo";

const EditForm = ({
    company,
    saving,
    logoUploading,
    onSave,
    onCancel,
    onLogoUpload
}) => {
    const [formData, setFormData] = useState({
        name: "",
        tagline: "",
        website: "",
        industry: "",
        founded: "",
        headquarters: "",
        about: ""
    });

    const [formError, setFormError] = useState("");

    useEffect(() => {
        if (!company) return;

        setFormData({
            name: company.name || "",
            tagline: company.tagline || "",
            website: company.website || "",
            industry: company.industry || "",
            founded: company.founded || "",
            headquarters: company.headquarters || "",
            about: company.about || ""
        });
    }, [company]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(previous => ({ ...previous, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError("");

        try {
            await onSave(formData);
        } catch (err) {
            setFormError(err?.message || "Unable to save company changes.");
        }
    };

    const fields = [
        { name: "name", label: "Company name", required: true, placeholder: "Enter company name" },
        { name: "tagline", label: "Tagline", placeholder: "Your company in one sentence" },
        { name: "website", label: "Company website", required: true, placeholder: "https://company.com", type: "url" },
        { name: "industry", label: "Industry", placeholder: "Information Technology" },
        { name: "founded", label: "Founded year", type: "number", placeholder: "2020" },
        { name: "headquarters", label: "Headquarters", placeholder: "Pune, Maharashtra" }
    ];

    return (
        <form
            onSubmit={handleSubmit}
            className="!overflow-hidden !rounded-[26px] !border !border-purple-100 !bg-white !shadow-xl !shadow-purple-100/50"
        >
            <div className="!relative !overflow-hidden !bg-gradient-to-r !from-[#3c167b] !to-[#8050df] !px-6 !py-6 !text-white sm:!px-8">
                <div className="!absolute !-right-8 !-top-16 !h-40 !w-40 !rounded-full !border-[22px] !border-white/10" />
                <div className="!relative !flex !items-center !justify-between !gap-4">
                    <div className="!flex !items-center !gap-3">
                        <div className="!flex !h-12 !w-12 !shrink-0 !items-center !justify-center !rounded-xl !bg-white/15 !backdrop-blur">
                            <Building2 size={23} />
                        </div>
                        <div>
                            <h2 className="!text-xl !font-black">Edit company profile</h2>
                            <p className="!mt-1 !text-sm !text-purple-100">Keep your company information up to date.</p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={saving}
                        aria-label="Cancel editing"
                        className="!flex !h-10 !w-10 !shrink-0 !items-center !justify-center !rounded-xl !border !border-white/20 !bg-white/10 !text-white !transition hover:!bg-white/20 disabled:!opacity-50"
                    >
                        <X size={20} />
                    </button>
                </div>
            </div>

            <div className="!space-y-8 !p-5 sm:!p-8">
                <section className="!rounded-2xl !border !border-purple-100 !bg-gradient-to-r !from-purple-50/80 !to-fuchsia-50/50 !p-5">
                    <div className="!mb-4 !flex !items-center !gap-2">
                        <Sparkles size={17} className="!text-purple-600" />
                        <h3 className="!font-extrabold !text-gray-800">Brand identity</h3>
                    </div>
                    <Logo
                        logo={company?.logo}
                        companyName={company?.name}
                        editMode={true}
                        uploading={logoUploading}
                        onUpload={onLogoUpload}
                    />
                </section>

                {formError && (
                    <div role="alert" className="!flex !items-start !gap-2 !rounded-xl !border !border-red-200 !bg-red-50 !p-3 !text-sm !text-red-700">
                        <CircleAlert size={18} className="!mt-0.5 !shrink-0" />
                        {formError}
                    </div>
                )}

                <section>
                    <h3 className="!mb-1 !text-base !font-extrabold !text-gray-900">Company details</h3>
                    <p className="!mb-5 !text-sm !text-gray-500">Update the information candidates see about your company.</p>

                    <div className="!grid !grid-cols-1 !gap-5 md:!grid-cols-2">
                        {fields.map(field => (
                            <div key={field.name}>
                                <label htmlFor={`edit-${field.name}`} className="!mb-2 !block !text-sm !font-bold !text-gray-700">
                                    {field.label} {field.required && <span className="!text-rose-500">*</span>}
                                </label>
                                <input
                                    id={`edit-${field.name}`}
                                    type={field.type || "text"}
                                    name={field.name}
                                    value={formData[field.name]}
                                    onChange={handleChange}
                                    placeholder={field.placeholder}
                                    required={field.required}
                                    min={field.type === "number" ? 1800 : undefined}
                                    max={field.type === "number" ? 2100 : undefined}
                                    className="!w-full !rounded-xl !border !border-gray-200 !bg-gray-50/70 !px-4 !py-3 !text-sm !text-gray-800 !outline-none !transition placeholder:!text-gray-400 focus:!border-purple-400 focus:!bg-white focus:!ring-4 focus:!ring-purple-100"
                                />
                            </div>
                        ))}
                    </div>

                    <div className="!mt-5">
                        <label htmlFor="edit-about" className="!mb-2 !block !text-sm !font-bold !text-gray-700">
                            About your company
                        </label>
                        <textarea
                            id="edit-about"
                            name="about"
                            value={formData.about}
                            onChange={handleChange}
                            rows={5}
                            placeholder="Tell candidates about your mission, products, team, and culture..."
                            className="!w-full !resize-y !rounded-xl !border !border-gray-200 !bg-gray-50/70 !px-4 !py-3 !text-sm !leading-6 !text-gray-800 !outline-none !transition placeholder:!text-gray-400 focus:!border-purple-400 focus:!bg-white focus:!ring-4 focus:!ring-purple-100"
                        />
                    </div>
                </section>
            </div>

            <div className="!flex !flex-col-reverse !gap-3 !border-t !border-gray-100 !bg-gray-50/80 !px-5 !py-5 sm:!flex-row sm:!justify-end sm:!px-8">
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={saving}
                    className="!rounded-xl !border !border-gray-200 !bg-white !px-5 !py-3 !text-sm !font-bold !text-gray-600 !transition hover:!bg-gray-100 disabled:!opacity-50"
                >
                    Cancel
                </button>

                <button
                    type="submit"
                    disabled={saving || logoUploading}
                    className="!inline-flex !items-center !justify-center !gap-2 !rounded-xl !bg-gradient-to-r !from-purple-700 !to-violet-600 !px-6 !py-3 !text-sm !font-bold !text-white !shadow-lg !shadow-purple-200 !transition hover:!-translate-y-0.5 disabled:!cursor-not-allowed disabled:!opacity-60"
                >
                    {saving ? (
                        <><Loader2 size={17} className="!animate-spin" /> Saving changes...</>
                    ) : (
                        <><Save size={17} /> Save changes</>
                    )}
                </button>
            </div>
        </form>
    );
};

export default EditForm;
