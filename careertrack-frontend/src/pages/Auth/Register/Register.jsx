import { Link } from "react-router-dom"
import RegisterForm from "./Registerform"
import RegisterIllustration from "./RegisterIllustration"


function Register() {
    return (
        <div className=" min-h[calc(100vh-128px)] bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">

            <div className="mx-auto grid max-w-8xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm lg:grid-cols-2">

                {/* Form */}
                <div className="relative z-20 flex items-center justify-end p-6 sm:p-10 lg:p-14">

                    <div className="relative z-20 w-full max-w-md" >

                        <RegisterForm />
                    </div>
                </div>
                <div className="relative z-0 flex justify-end pointer-events-none">
                    <RegisterIllustration />
                </div>
            </div>
        </div>
    )
}

export default Register

