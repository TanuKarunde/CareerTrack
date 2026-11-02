function RoleSelector({role, setRole}){

    return(
        <div>
            <p className="mb-3 text-sm font-medium text-slate-700">
                I am a 
            </p>

            <div className="grid grid-cols-2 gap-3">

                {/* Student */}
                <button type="button"
                onClick={() => setRole('Student')}
                className={`rounded-xl border p-4 text-left transition ${role == 'STUDENT' ? "border-violet-500 bg-violet-50 ring-2 ring-violet-100" : "border-slate-200 hover:border-violet-200" }`}
                >
                    <p className="mt-2 !pl-4 text-sm font-semibold text-slate-800">Student</p>
                    <p className="mt-1 !pl-4 text-xs text-slate-500">Find and apply for jobs</p>
                </button>

                {/* Employer */}
                <button type="button"
                onClick={() => setRole('EMPLOYER')}
                className={`rounded-xl border p-4 text-left transition ${role == 'EMPLOYER' ? 'border-violet-500 bg-violet-50 ring-2 ring-violet-100' : 'border-slate-200 hover:border-violet-200' }`}
                >
                    <p className="mt-2 !pl-4 text-sm font-semibold text-slate-800">Employer</p>
                    <p className="mt-1 !pl-4 text-xs text-slate-500">Post jobs and hire talent</p>
                </button>
            </div>
        </div>
    )
}

export default RoleSelector