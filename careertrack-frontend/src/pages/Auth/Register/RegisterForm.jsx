import { Lock, Mail, User } from 'lucide-react'
import { useState } from 'react'


import { Link, useNavigate } from 'react-router-dom'
import { registerUser } from '../../../services/authServices'

const RegisterForm = () => {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "STUDENT"
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
    const { name, value } = e.target;

    console.log(name, value);

    setFormData((prev) => ({
        ...prev,
        [name]: value,
    }));
};

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");
        setSuccess("");
        setLoading(true);

        try {
            await registerUser(formData);

            setSuccess("Register successful! please login");

            setTimeout(() => {
                navigate("/login");
            }, 1000);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (

        <div className="h-170 w-full max-w-lg bg-white rounded-2xl shadow-lg !p-2">
            <div className="!m-9">
                <div className="text-center mb-8 mt-8">
                    <h2 className="text-3xl font-bold">Create Account</h2>
                    <p className="text-sm text-gray-500 mb-10 mt-2">Join careerTrack and start your career journey</p>
                </div>
                <form onSubmit={handleSubmit} className="mt-7 space-y-5">

                    {error && (<p className='text-red-500'>{error}</p>)}
                    {success && (<p className='text-green-500'>{success}</p>)}

                    {/* Name */}
                    <div>
                        <label
                            htmlFor="name"
                            className="mb-2 block text-sm font-medium text-slate-700"
                        >
                            Full Name
                        </label>
                        <div className='relative'>
                            <User
                                size={18}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                            />

                            <input
                                id="name"
                                type="text"
                                name="name"
                                placeholder="Enter your full name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="h-10 w-full rounded-lg border border-slate-200 py-3 !pl-10 pr-4 text-sm text-blackoutline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-200 hover:border-violet-500 hover:ring-2 hover:ring-violet-200"
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div>
                        <label
                            htmlFor="register-email"
                            className="mb-2 block text-sm font-medium text-slate-700"
                        >
                            Email
                        </label>

                        <div className="relative">
                            <Mail
                                size={18}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                            />

                            <input
                                id="register-email"
                                type="email"
                                name='email'
                                placeholder="Enter your email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-full h-10 rounded-lg border border-slate-200 py-3 !pl-10 pr-4 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 hover:border-violet-500 hover:ring-2 hover:ring-violet-200"
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div>
                        <label
                            htmlFor="register-password"
                            className="mb-2 block text-sm font-medium text-slate-700"
                        >
                            Password
                        </label>

                        <div className="relative">
                            <Lock
                                size={18}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                            />

                            <input
                                id="register-password"
                                type="password"
                                name="password"
                                placeholder="Create a password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="w-full h-10 rounded-lg border border-slate-200 py-3 !pl-10 pr-4 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 hover:border-violet-500 hover:ring-2 hover:ring-violet-200"
                            />
                        </div>
                    </div>
                    <select name="role"
                            value={formData.role}
                            onChange={handleChange}
                            >
                                <option value="STUDENT">
                                    Student
                                </option>

                                <option value="EMPLOYER">
                                    Employer
                                </option>
                            </select>

                    {/* Button */}
                    <button
                        type="submit"
                        disabled = {loading}
                        className="w-full mt-5 h-10 rounded-lg bg-violet-600 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-100 transition hover:bg-violet-700 hover:border-violet-500 hover:ring-2 hover:ring-violet-200"
                    >
                        {loading ? "Creating Account" : "Create Account"}
                    </button>

                    <p className="mt-6 text-center text-sm text-slate-500">
                        Already have an account?{' '}

                        <Link to="/login"
                            className="font-semibold text-violet-600 hover:text-violet-700">
                            Login
                        </Link>
                    </p>

                </form>
            </div>
        </div>
    )
}

export default RegisterForm