import { Link } from "react-router-dom";

function UserMenu(){

    return(
        <div className="hidden items-center gap-3 md:flex">

            <Link
            to="/login"
            className="rounded-lg !px-4 !py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 border border-purple-600">
                Login
            </Link>

            <Link
            to="/register"
            className="inline-flex items-center justify-center w-40 h-10 rounded-lg bg-purple-700 !px-6 !py-3 font-semibold text-white transition hover:bg-violet-900">
                Get Started
            </Link>
        </div>
    )
}

export default UserMenu