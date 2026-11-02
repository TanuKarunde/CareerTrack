
import { useRef, useState } from "react";
import { Building2, Camera, Loader2, ImagePlus } from "lucide-react";

const Logo = ({
    logo,
    companyName,
    editMode = false,
    uploading = false,
    onUpload
}) => {
    const fileInputRef = useRef(null);
    const [imageError, setImageError] = useState(false);

    const handleClick = () => {
        if (editMode && !uploading) {
            fileInputRef.current?.click();
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            window.alert("Please select an image file.");
            e.target.value = "";
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            window.alert("Logo must be smaller than 5 MB.");
            e.target.value = "";
            return;
        }

        setImageError(false);
        onUpload?.(file);

        // Allow selecting the same file again.
        e.target.value = "";
    };

    return (
        <div className="!flex !items-center !gap-4 sm:!gap-5">
            <button
                type="button"
                onClick={handleClick}
                disabled={!editMode || uploading}
                aria-label={editMode ? "Change company logo" : `${companyName || "Company"} logo`}
                className={`!group !relative !h-24 !w-24 !shrink-0 !overflow-hidden !rounded-[22px] !border-2 !border-purple-100 !bg-gradient-to-br !from-purple-50 !to-fuchsia-100 !shadow-md !shadow-purple-100/70 !transition sm:!h-28 sm:!w-28 ${
                    editMode
                        ? "!cursor-pointer hover:!border-purple-400 hover:!shadow-lg"
                        : "!cursor-default"
                }`}
            >
                {logo && !imageError ? (
                    <img
                        src={logo}
                        alt={companyName || "Company logo"}
                        className="!h-full !w-full !object-cover"
                        onLoad={() => setImageError(false)}
                        onError={() => setImageError(true)}
                    />
                ) : (
                    <div className="!flex !h-full !w-full !flex-col !items-center !justify-center !gap-1 !text-purple-500">
                        <Building2 size={36} />
                        <span className="!text-[9px] !font-extrabold !uppercase !tracking-widest">Logo</span>
                    </div>
                )}

                {editMode && (
                    <div className={`!absolute !inset-0 !flex !flex-col !items-center !justify-center !gap-1 !bg-[#32106d]/75 !text-white !transition-opacity ${
                        uploading ? "!opacity-100" : "!opacity-0 group-hover:!opacity-100 group-focus-visible:!opacity-100"
                    }`}>
                        {uploading ? (
                            <Loader2 size={25} className="!animate-spin" />
                        ) : (
                            <>
                                <Camera size={25} />
                                <span className="!text-[10px] !font-bold">Change logo</span>
                            </>
                        )}
                    </div>
                )}
            </button>

            {editMode && (
                <div className="!min-w-0">
                    <div className="!flex !items-center !gap-2">
                        <ImagePlus size={17} className="!text-purple-600" />
                        <p className="!font-extrabold !text-gray-800">Company logo</p>
                    </div>

                    <p className="!mt-1.5 !text-sm !leading-5 !text-gray-500">
                        Upload an image that represents your company.
                    </p>

                    <p className="!mt-2 !text-xs !font-medium !text-gray-400">
                        PNG, JPG, WEBP · Maximum 5 MB
                    </p>

                    <button
                        type="button"
                        onClick={handleClick}
                        disabled={uploading}
                        className="!mt-3 !inline-flex !items-center !gap-1.5 !rounded-lg !bg-purple-50 !px-3 !py-2 !text-xs !font-bold !text-purple-700 !transition hover:!bg-purple-100 disabled:!opacity-50"
                    >
                        {uploading ? (
                            <><Loader2 size={14} className="!animate-spin" /> Uploading...</>
                        ) : (
                            <><Camera size={14} /> Choose image</>
                        )}
                    </button>
                </div>
            )}

            <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp"
                className="!hidden"
                onChange={handleFileChange}
            />
        </div>
    );
};

export default Logo;
