import { Link } from "react-router-dom"

function NavLinks() {
    return (
        <nav className="hidden items-center gap-8 md:flex">
            <Link
                to="/"
                className="tect-sm font-medium text-slate-600 transition hover:text-purple-600 hover:underline underline-offset-6"
            >
                Home
            </Link>

            <a
                href="#about"
                className="tect-sm font-medium text-slate-600 transition hover:text-purple-600 hover:underline underline-offset-6"
            >
                About
            </a>

            <a
                href="#features"
                className="tect-sm font-medium text-slate-600 transition hover:text-purple-600 hover:underline underline-offset-6"
            >
                Features
            </a>

            <a
                href="#works"
                className="tect-sm font-medium text-slate-600 transition hover:text-purple-600 hover:underline underline-offset-6"
            >
                Works
            </a>

            <a
                href="#jobs"
                className="tect-sm font-medium text-slate-600 transition hover:text-purple-600 hover:underline underline-offset-6"
            >
                Jobs
            </a>
        </nav>
    )
}

export default NavLinks