import { Eye, EyeOff, Mail, Search } from "lucide-react"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../../../context/authContext";
import { loginUser } from "../../../services/authServices";

const LoginForm = () => {

    const navigate = useNavigate();

    const { login } = useAuth();

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {

        setFormData({
            ...formData, [e.target.name]: e.target.value
        });
    };

    
const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
        const data = await loginUser({
            email: formData.email,
            password: formData.password
        });

        const role = data.role?.toString().toUpperCase();

        if (!data.token || !role) {
            setError("Invalid login response. Please try again.");
            return;
        }

        const userData = {
            token: data.token,
            id: data.id,
            name: data.name,
            email: data.email,
            role: role
        };

        // Save login data using your existing authentication context.
        login(userData);

        // Redirect according to the authenticated user's role.
        switch (role) {
            case "STUDENT":
                navigate("/student/dashboard");
                break;

            case "EMPLOYER":
                navigate("/employer/dashboard");
                break;

            case "ADMIN":
                navigate("/admin/dashboard");
                break;

            default:
                setError("Invalid user role.");
                break;
        }
    } catch (error) {
        setError(error.message || "Login failed. Please check your credentials.");
    } finally {
        setLoading(false);
    }
};


    return (

        <div className="h-150 w-full max-w-lg bg-white rounded-2xl shadow-lg !p-5">
            <div className="!m-9">
                <div className="text-center mb-8 mt-8">
                    <h2 className="text-3xl font-bold">Welcome Back!</h2>
                    <p className="text-sm text-gray-500 mb-15 mt-2">Login to your account</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-5 ">


                    <div className="relative">

                        <label htmlFor="email"
                            className="mb-2 block text-sm font-medium text-size-700 text-gray-700">
                            Email
                        </label>
                        <Search size={18} className="absolute left-2 top-10 text-gray-400" />
                        <input type="email"
                        name="email"
                            id="email" placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            className="h-10 w-full px-4 py-3 !pl-10 rounded-sm border border-slate-300 text-sm outline-none transition hover:placeholder:text-slate-700 hover:border-purple-500 hover:border-2 transition-shadow duration-200 hover:shadow-lg focus:ring-2 focus:ring-violet-400"
                        />
                    </div>
                    <div>
                        <div className="relative">
                            <label htmlFor="password"
                                className="mb-2 mt-10 block text-sm font-medium text-gray-700">
                                Password
                            </label>

                            <Search size={18} className="absolute left-2 top-10 text-gray-400" />
                            <input type={showPassword ? 'text' : 'password'}
                            name="password"
                                id="password" placeholder="Enter your password"
                                value={formData.password}
                                onChange={handleChange}
                                className="h-10 w-full px-4 py-3 !pl-10 rounded-sm border border-slate-300 text-sm outline-none transition hover:placeholder:text-slate-700 hover:border-purple-500 hover:border-2 transition-shadow duration-200 hover:shadow-lg focus:ring-2 focus:ring-violet-400"

                            />

                            <button type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-2 top-10 text-slate-400 hover:text-slate-600"
                                aria-label="Toggle password visibility"
                            >
                                {showPassword ? (
                                    <EyeOff size={18} />
                                ) : (
                                    <Eye size={18} />
                                )}
                            </button>


                        </div>

                        <div className="text-right mt-2">
                            <Link to="/forgot-password"
                                className="text-xs font-medium text-violet-600 hover:text-violet-700"
                            >
                                Forgot Password?
                            </Link>
                        </div>
                    </div>

                    {error && (
    <div
        role="alert"
        className="rounded-lg border border-red-200 bg-red-50 !px-4 !py-3 text-sm text-red-600"
    >
        {error}
    </div>
)}

                    {/* Login Butto0n */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="mb-2 mt-5 h-10 w-full !py-3 rounded-md bg-violet-600 text-sm font-semibolt text-white shadow-lg shadow-violet-100 transition hover:bg-violet-800"
                    >
                        {loading ? "Logging in...." : "Login"}
                    </button>

                </form>

                {/* Register */}
                <p className="mt-5 text-center text-sm text-slate-500">
                    Don't have account?{' '}

                    <Link
                        to="/register"
                        className="font-semibold text-violet-600 hover:text-violet-800"
                    >Register here</Link>
                </p>
            </div>
        </div>
    )
}

export default LoginForm