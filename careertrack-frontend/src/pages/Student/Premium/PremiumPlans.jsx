
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Check,
    Crown,
    ShieldCheck,
    Sparkles,
    Zap,
    Star,
    ArrowRight,
    Gem,
    CircleCheck,
    Rocket,
    Heart,
    LockKeyhole,
} from "lucide-react";
import { toast } from "react-toastify";
import {
    createPaymentOrder,
    verifyPayment,
} from "../../../services/paymentService";

const PremiumPlans = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const loadRazorpay = () =>
        new Promise((resolve) => {
            if (window.Razorpay) {
                resolve(true);
                return;
            }

            const script = document.createElement("script");
            script.src =
                "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });

    const handleUpgrade = async () => {
        if (loading) return;

        setLoading(true);

        try {
            const loaded = await loadRazorpay();

            if (!loaded) {
                toast.error("Unable to load Razorpay Checkout.");
                return;
            }

            const response = await createPaymentOrder("MONTHLY");
            const order = response.order;

            if (!order?.id || !response.keyId) {
                throw new Error(
                    "Invalid order response from server."
                );
            }

            const options = {
                key: response.keyId,
                amount: order.amount,
                currency: order.currency || "INR",
                name: "CareerTrack",
                description: "Premium Monthly Subscription",
                order_id: order.id,

                handler: async (paymentResponse) => {
                    try {
                        const result =
                            await verifyPayment(paymentResponse);

                        toast.success(
                            result.message ||
                                "Premium activated successfully!"
                        );

                        navigate("/student/dashboard");
                    } catch (error) {
                        toast.error(
                            error.message ||
                                "Payment verification failed. Please contact support."
                        );
                    }
                },

                modal: {
                    ondismiss: () => {
                        toast.info("Checkout closed.");
                    },
                },

                theme: {
                    color: "#7c3aed",
                },
            };

            const checkout = new window.Razorpay(options);

            checkout.on("payment.failed", () => {
                toast.error(
                    "Payment failed. You can try again."
                );
            });

            checkout.open();
        } catch (error) {
            toast.error(
                error.message || "Unable to start payment."
            );
        } finally {
            setLoading(false);
        }
    };

    const freeFeatures = [
        "Student profile",
        "Browse job listings",
        "Track job applications",
        "Basic interview preparation",
    ];

    const premiumFeatures = [
        "Advanced job readiness insights",
        "AI-powered resume analysis",
        "Smart candidate matching insights",
        "Personalized career preparation",
        "Premium career progress tracking",
    ];

    return (
        <div className="relative isolate flex min-h-screen w-full min-w-0 flex-col items-center overflow-hidden bg-[#faf8ff] text-slate-900">

            {/* Animated background */}
            <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute -left-40 -top-32 h-[420px] w-[420px] animate-pulse rounded-full bg-violet-300/40 blur-[110px]" />

                <div className="absolute -right-32 top-[20%] h-[450px] w-[450px] animate-pulse rounded-full bg-fuchsia-300/30 blur-[120px]" />

                <div className="absolute bottom-[-140px] left-[25%] h-[400px] w-[400px] animate-pulse rounded-full bg-indigo-300/30 blur-[110px]" />

                <div className="absolute inset-0 bg-[radial-gradient(#a78bfa25_1px,transparent_1px)] [background-size:25px_25px]" />
            </div>

            {/* Top header */}
            <header className="relative z-10 w-full border-b border-violet-100/80 bg-white/70 backdrop-blur-xl">
                <div className="mx-auto flex w-full max-w-[1600px] items-center justify-between gap-4 !px-4 !py-4 sm:!px-8 lg:!px-12">

                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 text-white shadow-lg shadow-violet-300/50 transition duration-300 hover:rotate-6 hover:scale-110">
                            <Gem size={23} />
                        </div>

                        <div>
                            <p className="text-lg font-black tracking-tight text-slate-900">
                                CareerTrack
                            </p>

                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-violet-600">
                                Your career, elevated
                            </p>
                        </div>
                    </div>

                    <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 !px-3 !py-2 text-[11px] font-bold text-emerald-700 sm:!px-4 sm:text-xs">
                        <LockKeyhole size={15} />
                        <span>Secure Checkout</span>
                    </div>
                </div>
            </header>

            {/* Main content: centered in the available page area */}
            <main className="relative mx-auto flex w-full max-w-[1600px] flex-1 flex-col items-center !px-4 !py-10 sm:!px-8 sm:!py-14 lg:!px-12 lg:!py-16">

                {/* Hero section */}
                <section className="mx-auto mb-12 w-full max-w-4xl text-center sm:mb-16">

                    <div className="mb-6 inline-flex animate-[bounce_3s_ease-in-out_infinite] items-center gap-2 rounded-full border border-violet-200 bg-white/90 !px-4 !py-2 shadow-lg shadow-violet-100/60">
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-amber-300 to-orange-500 text-white shadow-sm">
                            <Sparkles size={15} />
                        </span>

                        <span className="text-[10px] font-extrabold tracking-[0.13em] text-violet-700 sm:text-xs">
                            YOUR NEXT CAREER ADVANTAGE
                        </span>
                    </div>

                    <h1 className="text-4xl font-black leading-[1.12] tracking-tight text-slate-950 sm:text-5xl md:text-6xl lg:text-7xl">
                        Your potential.
                        <br />

                        <span className="bg-gradient-to-r from-violet-600 via-fuchsia-600 to-indigo-600 bg-clip-text text-transparent">
                            Without limits.
                        </span>
                    </h1>

                    <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
                        Take your career preparation to the next
                        level. Unlock smarter resume insights,
                        personalized preparation, and powerful
                        tools built to help you move closer to
                        your dream job.
                    </p>

                    <div className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-xs font-semibold text-slate-600 sm:text-sm">
                        <span className="inline-flex items-center gap-2">
                            <CircleCheck
                                size={17}
                                className="text-emerald-500"
                            />
                            Career-focused tools
                        </span>

                        <span className="inline-flex items-center gap-2">
                            <CircleCheck
                                size={17}
                                className="text-emerald-500"
                            />
                            Secure payment verification
                        </span>
                    </div>
                </section>

                {/* Pricing cards */}
                <section className="mx-auto grid w-full max-w-5xl grid-cols-1 items-stretch gap-7 md:grid-cols-2 md:gap-8 lg:gap-10">

                    {/* Free plan */}
                    <article className="group relative flex min-w-0 flex-col overflow-hidden rounded-[30px] border border-slate-200/80 bg-white/90 !p-6 shadow-[0_15px_50px_rgba(30,41,59,0.06)] backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:border-violet-300 hover:shadow-[0_25px_60px_rgba(124,58,237,0.13)] sm:!p-8 lg:!p-9">

                        <div className="pointer-events-none absolute -right-14 -top-14 h-44 w-44 rounded-full bg-gradient-to-br from-slate-100 to-violet-100/70 transition-transform duration-700 group-hover:scale-150" />

                        <div className="relative flex items-start justify-between gap-3">
                            <div>
                                <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 !px-3 !py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-600">
                                    <Star size={13} />
                                    Starter
                                </span>

                                <h2 className="mt-5 text-2xl font-black text-slate-900 sm:text-3xl">
                                    Free Plan
                                </h2>

                                <p className="mt-2 text-sm leading-6 text-slate-500">
                                    Build a strong career foundation.
                                </p>
                            </div>

                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-500 shadow-sm transition duration-300 group-hover:rotate-6 group-hover:scale-110 sm:h-14 sm:w-14">
                                <ShieldCheck size={25} />
                            </div>
                        </div>

                        <div className="relative mt-8 flex items-baseline gap-2">
                            <span className="text-5xl font-black tracking-tight text-slate-950">
                                ₹0
                            </span>

                            <span className="text-sm font-medium text-slate-500">
                                / forever
                            </span>
                        </div>

                        <p className="mt-2 text-xs font-medium text-slate-400">
                            No subscription payment required
                        </p>

                        <div className="my-7 h-px bg-gradient-to-r from-slate-200 via-slate-100 to-transparent" />

                        <p className="mb-5 text-xs font-extrabold uppercase tracking-[0.16em] text-slate-500">
                            What&apos;s included
                        </p>

                        <div className="space-y-5">
                            {freeFeatures.map((feature) => (
                                <div
                                    key={feature}
                                    className="flex items-center gap-3 text-sm text-slate-600 transition-transform duration-300 hover:translate-x-1"
                                >
                                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                                        <Check
                                            size={14}
                                            strokeWidth={3}
                                        />
                                    </span>

                                    <span>{feature}</span>
                                </div>
                            ))}
                        </div>

                        <div className="mt-auto pt-9">
                            <button
                                type="button"
                                onClick={() =>
                                    navigate("/student/dashboard")
                                }
                                className="group/button flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white !px-5 !py-4 text-sm font-extrabold text-slate-700 transition-all duration-300 hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700 active:scale-[0.98]"
                            >
                                Continue with Free

                                <ArrowRight
                                    size={17}
                                    className="transition-transform duration-300 group-hover/button:translate-x-1"
                                />
                            </button>

                            <p className="mt-4 text-center text-xs text-slate-400">
                                A simple way to get started
                            </p>
                        </div>
                    </article>

                    {/* Premium plan */}
                    <article className="group relative flex min-w-0 flex-col overflow-hidden rounded-[30px] border-2 border-violet-400 bg-white !p-6 shadow-[0_20px_70px_rgba(124,58,237,0.17)] transition-all duration-500 hover:-translate-y-2 hover:border-fuchsia-400 hover:shadow-[0_30px_85px_rgba(124,58,237,0.28)] sm:!p-8 lg:!p-9">

                        {/* Animated premium border */}
                        <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-indigo-500" />

                        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gradient-to-br from-violet-200/70 to-fuchsia-200/50 blur-2xl transition-transform duration-700 group-hover:scale-125" />

                        <div className="pointer-events-none absolute -bottom-20 -left-20 h-48 w-48 rounded-full bg-fuchsia-200/30 blur-3xl transition-transform duration-700 group-hover:scale-125" />

                        <div className="absolute right-4 top-5 z-10 flex items-center gap-1.5 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 !px-3 !py-2 text-[9px] font-black tracking-[0.1em] text-white shadow-lg shadow-violet-200 sm:right-6 sm:top-6 sm:!px-4 sm:text-[10px]">
                            <Sparkles size={12} />
                            MOST POWERFUL
                        </div>

                        <div className="relative flex items-start justify-between gap-3">
                            <div className="min-w-0">
                                <span className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 !px-3 !py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-violet-700">
                                    <Zap size={13} />
                                    Career accelerator
                                </span>

                                <h2 className="mt-5 text-2xl font-black text-slate-950 sm:text-3xl">
                                    Premium
                                </h2>

                                <p className="mt-2 max-w-xs text-sm leading-6 text-slate-500">
                                    Turn your preparation into
                                    career-ready progress.
                                </p>
                            </div>

                            <div className="mt-12 flex h-12 w-12 shrink-0 animate-[pulse_3s_ease-in-out_infinite] items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 text-white shadow-xl shadow-violet-300/50 sm:h-14 sm:w-14">
                                <Crown size={26} />
                            </div>
                        </div>

                        <div className="relative mt-7 flex flex-wrap items-baseline gap-x-2 gap-y-1">
                            <span className="text-5xl font-black tracking-tight text-slate-950 sm:text-6xl">
                                ₹499
                            </span>

                            <span className="text-sm font-semibold text-slate-500">
                                / month
                            </span>
                        </div>

                        <p className="mt-2 text-xs font-semibold text-violet-700">
                            More insights. More preparation.
                            More possibilities.
                        </p>

                        <div className="my-7 h-px bg-gradient-to-r from-violet-200 via-fuchsia-100 to-transparent" />

                        <p className="mb-5 text-xs font-extrabold uppercase tracking-[0.13em] text-violet-700">
                            Everything you need to level up
                        </p>

                        <div className="space-y-5">
                            {premiumFeatures.map((feature) => (
                                <div
                                    key={feature}
                                    className="flex items-center gap-3 text-sm font-medium text-slate-700 transition-all duration-300 hover:translate-x-1 hover:text-violet-700"
                                >
                                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-100 to-fuchsia-100 text-violet-700">
                                        <Check
                                            size={14}
                                            strokeWidth={3}
                                        />
                                    </span>

                                    <span>{feature}</span>
                                </div>
                            ))}
                        </div>

                        <div className="relative mt-auto pt-9">
                            <button
                                type="button"
                                onClick={handleUpgrade}
                                disabled={loading}
                                className="group/button relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 !px-5 !py-4 text-sm font-extrabold text-white shadow-[0_12px_30px_rgba(124,58,237,0.30)] transition-all duration-300 hover:-translate-y-0.5 hover:from-violet-700 hover:via-purple-700 hover:to-fuchsia-700 hover:shadow-[0_18px_38px_rgba(124,58,237,0.42)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover/button:translate-x-full" />

                                <Rocket
                                    size={18}
                                    className="relative"
                                />

                                <span className="relative">
                                    {loading
                                        ? "Preparing checkout..."
                                        : "Unlock Premium"}
                                </span>

                                {!loading && (
                                    <ArrowRight
                                        size={17}
                                        className="relative transition-transform duration-300 group-hover/button:translate-x-1"
                                    />
                                )}
                            </button>

                            <div className="mt-4 flex items-center justify-center gap-2 text-center text-xs text-slate-500">
                                <ShieldCheck
                                    size={14}
                                    className="shrink-0 text-emerald-600"
                                />
                                Secure Razorpay checkout
                            </div>

                            <p className="mt-2 text-center text-[11px] text-slate-400">
                                Razorpay test mode · No real charge in test mode
                            </p>
                        </div>
                    </article>
                </section>

                {/* Trust section */}
                <section className="mx-auto mt-12 w-full max-w-5xl rounded-3xl border border-violet-100 bg-white/70 !px-5 !py-7 text-center shadow-[0_10px_40px_rgba(124,58,237,0.06)] backdrop-blur-xl sm:mt-16 sm:!px-8 sm:!py-9">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-100 to-fuchsia-100 text-violet-700 shadow-sm">
                        <Heart size={22} />
                    </div>

                    <h3 className="mt-4 text-base font-extrabold text-slate-900 sm:text-xl">
                        Your next opportunity starts with preparation.
                    </h3>

                    <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-500">
                        Choose the plan that fits your journey
                        and keep building the skills that move
                        your career forward.
                    </p>

                    <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                        <span className="rounded-full border border-violet-100 bg-violet-50 !px-3 !py-2 text-xs font-semibold text-violet-700">
                            <Sparkles
                                size={13}
                                className="mr-1 inline"
                            />
                            Smarter preparation
                        </span>

                        <span className="rounded-full border border-emerald-100 bg-emerald-50 !px-3 !py-2 text-xs font-semibold text-emerald-700">
                            <ShieldCheck
                                size={13}
                                className="mr-1 inline"
                            />
                            Secure payments
                        </span>
                    </div>
                </section>

                {/* Footer */}
                <footer className="mt-8 w-full text-center text-xs text-slate-400">
                    © CareerTrack · Your journey, your growth, your future.
                </footer>
            </main>
        </div>
    );
};

export default PremiumPlans;
