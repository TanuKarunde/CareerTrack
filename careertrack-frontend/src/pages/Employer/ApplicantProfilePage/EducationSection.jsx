
import {
    GraduationCap,
    School,
    CalendarDays,
    Award,
    Sparkles,
} from "lucide-react";

const EducationSection = ({ student = {} }) => {
    const hasCgpa = student.cgpa !== null && student.cgpa !== undefined && student.cgpa !== "";

    const hasEducation = Boolean(
        student.degree ||
        student.branch ||
        student.college ||
        student.graduationYear ||
        hasCgpa
    );

    return (
        <section className="relative overflow-hidden rounded-2xl border border-purple-100 bg-white shadow-sm">
            <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-purple-100/60 blur-3xl pointer-events-none" />

            <div className="relative border-b border-gray-100 !p-5 sm:!p-6">
                <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600 to-fuchsia-500 text-white shadow-md shadow-purple-200">
                        <GraduationCap size={21} />
                    </div>

                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-purple-600">
                            Academic background
                        </p>
                        <h2 className="mt-1 text-base font-bold text-gray-900">
                            Education
                        </h2>
                        <p className="mt-1 text-xs text-gray-500">
                            Academic qualifications shared by the candidate.
                        </p>
                    </div>
                </div>
            </div>

            {hasEducation ? (
                <div className="relative !p-5 sm:!p-6">
                    <div className="relative rounded-2xl border border-purple-100 bg-gradient-to-br from-purple-50 via-white to-fuchsia-50 !p-5">
                        <div className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-xl border border-purple-100 bg-white/80 text-purple-600">
                            <School size={17} />
                        </div>

                        <div className="pr-10">
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-white border border-purple-100 !px-2.5 !py-1 text-[9px] font-semibold text-purple-700">
                                <Sparkles size={11} />
                                Qualification
                            </span>

                            <h3 className="mt-4 text-lg font-bold text-gray-900">
                                {student.degree || "Degree not provided"}
                            </h3>

                            <p className="mt-1 text-sm font-medium text-purple-700">
                                {student.branch || "Branch not provided"}
                            </p>

                            <p className="mt-3 text-xs leading-5 text-gray-500">
                                {student.college || "College or institution not provided"}
                            </p>
                        </div>
                    </div>

                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white !p-4">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                <CalendarDays size={17} />
                            </div>

                            <div className="min-w-0">
                                <p className="text-[10px] text-gray-400">
                                    Graduation year
                                </p>
                                <p className="mt-1 text-sm font-bold text-gray-800">
                                    {student.graduationYear || "Not provided"}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white !p-4">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                                <Award size={17} />
                            </div>

                            <div className="min-w-0">
                                <p className="text-[10px] text-gray-400">
                                    Academic score
                                </p>
                                <p className="mt-1 text-sm font-bold text-gray-800">
                                    {hasCgpa ? student.cgpa : "Not provided"}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="!px-6 !py-12 text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-50 text-purple-300">
                        <GraduationCap size={27} />
                    </div>
                    <h3 className="mt-4 text-sm font-semibold text-gray-700">
                        No education details yet
                    </h3>
                    <p className="mx-auto mt-2 max-w-sm text-xs leading-5 text-gray-400">
                        The student has not provided academic information in their profile.
                    </p>
                </div>
            )}
        </section>
    );
};

export default EducationSection;
