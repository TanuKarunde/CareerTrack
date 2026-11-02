import { BriefcaseBusiness } from "lucide-react";

function Logo(){

    return(
        <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg text-purple-900">
                <BriefcaseBusiness size={50} />
                
            </div>

            <span className="text-3xl font-bold text-violet-900">
                CareerTrack
            </span>
        </div>
    )
}

export default Logo