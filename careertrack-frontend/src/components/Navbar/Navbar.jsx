import Logo from "./Logo";
import NavLinks from "./NavLinks";
import UserMenu from "./UserMenu";
import { Menu } from "lucide-react";

function Navbar(){

    return(
        <header className="border-b border-slate-200 bg-white">
            <div className="mx-auto !ml-24 flex !h-16 max-w-7xl items-center justify-between !px-4 sm:px-6 lg:px-8">
                
                <Logo />
                <NavLinks/>
                <UserMenu />

                <button
                className="rounded-lg p-2 text-slate-700 hover:bg-slate-100 md:hidden"
                aria-label="Open menu">
                    <Menu size={24} />
                </button>
            </div>
        </header>
    )
}

export default Navbar