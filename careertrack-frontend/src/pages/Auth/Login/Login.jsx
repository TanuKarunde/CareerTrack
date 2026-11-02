import { useNavigate } from "react-router-dom"
import RegisterForm from "../Register/Registerform"
import LoginForm from "./LoginForm"
import LoginIllustration from "./LoginIllustration"
import { useState } from "react";

function Login(){
    return(
        <div className="min-h-[calc(100vh-129px)] bg-slate-50 px-4 py-10 sm:px-6 lg:px-8 ">
            <div className="grid max-w-8xl overflow-hidden rounded-3xl border border-slate-200 bg-violet-50 shadow-sm lg:grid-cols-[1.5fr_2.5fr]">

                <div className="items-end">
                <LoginIllustration />
                </div>
                <div className="flex items-center justify-start sm:p-10 lg:p-14">

                    <div className="w-full max-w-md items">

                        <LoginForm />
                    </div>
                </div>
            </div>
            
        </div>

        
    )
}

export default Login