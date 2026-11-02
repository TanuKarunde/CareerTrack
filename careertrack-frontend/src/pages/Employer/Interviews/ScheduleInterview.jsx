
import { useEffect, useState } from "react";
import {
    X,
    CalendarDays,
    Clock3,
    Video,
    FileText,
    UserRound,
    Sparkles,
    BriefcaseBusiness,
    CheckCircle2,
    LoaderCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import {
    getEmployerApplicants,
    scheduleInterview,
} from "../../../services/employerService";

const initialFormData = {
    applicationId: "",
    interviewDate: "",
    interviewTime: "",
    meetingLink: "",
    notes: "",
};

const fieldClass =
    "w-full rounded-xl border border-gray-200 bg-white !px-4 !py-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-purple-400 focus:ring-4 focus:ring-purple-100 disabled:cursor-not-allowed disabled:bg-gray-50";

const FieldLabel = ({ children, required }) => (
    <label className="mb-2 flex items-center gap-1.5 text-xs font-bold text-gray-700">
        {children}
        {required && <span className="text-red-500">*</span>}
    </label>
);

const ScheduleInterview = ({ onClose, onScheduled }) => {
    const [applicants, setApplicants] = useState([]);
    const [loadingApplicants, setLoadingApplicants] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [formData, setFormData] = useState(initialFormData);

    const navigate = useNavigate();

    useEffect(() => {
        let active = true;

        const loadApplicants = async () => {
            try {
                setLoadingApplicants(true);
                setError("");

                const data = await getEmployerApplicants();

                if (!active) return;

                const availableApplicants = Array.isArray(data)
                    ? data.filter((applicant) =>
                          ["SHORTLISTED", "INTERVIEW"].includes(
                              (applicant.status || "").toUpperCase()
                          )
                      )
                    : [];

                setApplicants(availableApplicants);
            } catch (err) {
                if (active) {
                    setError(
                        err.message || "Unable to load shortlisted applicants."
                    );
                }
            } finally {
                if (active) setLoadingApplicants(false);
            }
        };

        loadApplicants();

        return () => {
            active = false;
        };
    }, []);

    const handleClose = () => {
        if (saving) return;

        if (onClose) {
            onClose();
        } else {
            navigate("/employer/interviews");
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));

        if (error) setError("");
    };

    const getLocalToday = () => {
        const now = new Date();

        return [
            now.getFullYear(),
            String(now.getMonth() + 1).padStart(2, "0"),
            String(now.getDate()).padStart(2, "0"),
        ].join("-");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.applicationId) {
            setError("Please select a shortlisted candidate.");
            return;
        }

        if (!formData.interviewDate) {
            setError("Please choose an interview date.");
            return;
        }

        if (formData.interviewDate < getLocalToday()) {
            setError("The interview date cannot be in the past.");
            return;
        }

        if (!formData.interviewTime) {
            setError("Please choose an interview time.");
            return;
        }

        if (formData.meetingLink.trim()) {
            try {
                const url = new URL(formData.meetingLink);

                if (!["http:", "https:"].includes(url.protocol)) {
                    throw new Error("Invalid protocol");
                }
            } catch {
                setError("Please enter a valid meeting URL.");
                return;
            }
        }

        const applicationId = Number(formData.applicationId);

        if (
            !Number.isSafeInteger(applicationId) ||
            applicationId <= 0
        ) {
            setError("Please select a valid applicant.");
            return;
        }

        try {
            setSaving(true);
            setError("");

            const payload = {
                ...formData,
                applicationId,
                meetingLink: formData.meetingLink.trim(),
                notes: formData.notes.trim(),
            };

            const createdInterview = await scheduleInterview(payload);

            if (onScheduled) {
                onScheduled(createdInterview);
            } else if (onClose) {
                onClose();
            } else {
                navigate("/employer/interviews");
            }
        } catch (err) {
            setError(err.message || "Failed to schedule the interview.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-gray-950/55 !p-3 backdrop-blur-sm sm:!p-5"
            onMouseDown={(e) => {
                if (e.target === e.currentTarget) handleClose();
            }}
        >
            <section
                role="dialog"
                aria-modal="true"
                aria-labelledby="schedule-interview-title"
                className="my-auto w-full max-w-2xl overflow-hidden rounded-3xl border border-white/60 bg-white shadow-2xl shadow-purple-950/20"
            >
                {/* Modal header */}
                <div className="relative overflow-hidden bg-gradient-to-br from-[#30206f] via-purple-700 to-fuchsia-600 !px-5 !py-6 sm:!px-7">
                    <div className="pointer-events-none absolute -right-8 -top-12 h-40 w-40 rounded-full border-[24px] border-white/10" />
                    <div className="pointer-events-none absolute bottom-[-45px] left-[35%] h-28 w-28 rounded-full bg-fuchsia-300/20 blur-2xl" />

                    <div className="relative flex items-start justify-between gap-4">
                        <div>
                            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 !px-3 !py-1.5 text-[11px] font-semibold text-purple-100">
                                <Sparkles size={13} />
                                CANDIDATE MANAGEMENT
                            </div>

                            <h2
                                id="schedule-interview-title"
                                className="text-xl font-extrabold text-white sm:text-2xl"
                            >
                                Schedule an interview
                            </h2>

                            <p className="mt-2 max-w-md text-xs leading-5 text-purple-100 sm:text-sm">
                                Set the time, add a meeting link, and prepare
                                your candidate for the next step.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={saving}
                            aria-label="Close schedule form"
                            className="rounded-xl border border-white/20 bg-white/10 !p-2.5 text-white transition hover:bg-white/20 disabled:opacity-50"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    <div className="relative mt-5 flex items-center gap-2 text-xs text-purple-100">
                        <CheckCircle2 size={14} />
                        <span>Shortlisted candidates only</span>
                        <span className="text-white/40">•</span>
                        <CalendarDays size={14} />
                        <span>Choose a future date</span>
                    </div>
                </div>

                {/* Form */}
                <form
                    onSubmit={handleSubmit}
                    className="max-h-[calc(100vh-220px)] space-y-5 overflow-y-auto !p-5 sm:!p-7"
                >
                    {error && (
                        <div
                            role="alert"
                            className="flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 !p-4"
                        >
                            <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-600">
                                <X size={14} />
                            </div>
                            <p className="text-sm leading-5 text-red-700">
                                {error}
                            </p>
                        </div>
                    )}

                    {/* Candidate */}
                    <div>
                        <FieldLabel required>Choose candidate</FieldLabel>

                        <div className="relative">
                            <UserRound
                                size={17}
                                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-500"
                            />

                            <select
                                name="applicationId"
                                value={formData.applicationId}
                                onChange={handleChange}
                                disabled={loadingApplicants || saving}
                                required
                                className={`${fieldClass} !pl-10`}
                            >
                                <option value="">
                                    {loadingApplicants
                                        ? "Loading applicants..."
                                        : "Select a shortlisted candidate"}
                                </option>

                                {applicants.map((applicant) => {
                                    const id =
                                        applicant.applicationId ??
                                        applicant.id;

                                    return (
                                        <option
                                            key={id}
                                            value={id ?? ""}
                                            disabled={id == null}
                                        >
                                            {applicant.studentName ||
                                                applicant.candidateName ||
                                                "Unknown Candidate"}
                                            {" — "}
                                            {applicant.jobTitle || "Job"}
                                        </option>
                                    );
                                })}
                            </select>
                        </div>

                        {!loadingApplicants && applicants.length === 0 && (
                            <p className="mt-2 rounded-xl bg-amber-50 !p-3 text-xs leading-5 text-amber-700">
                                No shortlisted or interview-stage applicants
                                are available yet. Shortlist a candidate first.
                            </p>
                        )}

                        {formData.applicationId && (
                            <p className="mt-2 flex items-center gap-1.5 text-xs text-purple-700">
                                <CheckCircle2 size={13} />
                                Candidate selected
                            </p>
                        )}
                    </div>

                    {/* Date and time */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <FieldLabel required>Interview date</FieldLabel>

                            <div className="relative">
                                <CalendarDays
                                    size={17}
                                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-500"
                                />

                                <input
                                    type="date"
                                    name="interviewDate"
                                    value={formData.interviewDate}
                                    onChange={handleChange}
                                    min={getLocalToday()}
                                    required
                                    disabled={saving}
                                    className={`${fieldClass} !pl-10`}
                                />
                            </div>
                        </div>

                        <div>
                            <FieldLabel required>Interview time</FieldLabel>

                            <div className="relative">
                                <Clock3
                                    size={17}
                                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-500"
                                />

                                <input
                                    type="time"
                                    name="interviewTime"
                                    value={formData.interviewTime}
                                    onChange={handleChange}
                                    required
                                    disabled={saving}
                                    className={`${fieldClass} !pl-10`}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Meeting link */}
                    <div>
                        <FieldLabel>Meeting link</FieldLabel>

                        <div className="relative">
                            <Video
                                size={17}
                                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-500"
                            />

                            <input
                                type="url"
                                name="meetingLink"
                                value={formData.meetingLink}
                                onChange={handleChange}
                                disabled={saving}
                                placeholder="https://meet.google.com/..."
                                className={`${fieldClass} !pl-10`}
                            />
                        </div>

                        <p className="mt-2 text-[11px] text-gray-400">
                            Optional · Add a Google Meet, Zoom, or other HTTPS meeting URL.
                        </p>
                    </div>

                    {/* Notes */}
                    <div>
                        <FieldLabel>Interview notes</FieldLabel>

                        <div className="relative">
                            <FileText
                                size={17}
                                className="pointer-events-none absolute left-3.5 top-4 text-purple-500"
                            />

                            <textarea
                                name="notes"
                                value={formData.notes}
                                onChange={handleChange}
                                disabled={saving}
                                rows={3}
                                placeholder="Add interview instructions, topics, or preparation notes..."
                                className={`${fieldClass} resize-y !pl-10`}
                            />
                        </div>
                    </div>

                    {/* Footer actions */}
                    <div className="flex flex-col-reverse gap-3 border-t border-gray-100 !pt-5 sm:flex-row sm:justify-end">
                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={saving}
                            className="rounded-xl border border-gray-200 !px-5 !py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 disabled:opacity-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={saving || loadingApplicants}
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-700 to-fuchsia-600 !px-6 !py-3 text-sm font-bold text-white shadow-lg shadow-purple-200 transition hover:-translate-y-0.5 hover:shadow-purple-300 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {saving ? (
                                <>
                                    <LoaderCircle size={16} className="animate-spin" />
                                    Scheduling...
                                </>
                            ) : (
                                <>
                                    <CalendarDays size={16} />
                                    Schedule interview
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </section>
        </div>
    );
};

export default ScheduleInterview;
