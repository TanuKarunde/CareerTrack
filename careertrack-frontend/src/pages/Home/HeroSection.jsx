import { ArrowRight, PlayCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import heroImage from '../../assets/hero-image.png'

function HeroSection() {
  return (
    <section className="overflow-hidden bg-[#FAF7FF] !p-5">
      <div className="!mx-23 grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 md:py-20 lg:grid-cols-2 lg:px-8 lg:py-24 outline-none focus:outline-none">

        {/* Left Content */}
        <div>

          <h1 className="max-w-xl text-5xl font-bold leading-tight tracking-tight text-[#0B1B4D] sm:text-6xl">
            Build Your Career
            <br />

            <span className="text-[#0B1B4D]">
              With 
            </span>

            <span className='text-violet-700'> Confidence</span>
            
          </h1>

          <p className="mt-6 max-w-lg text-lg leading-8 text-gray-800">
            Find the right job. Build your future.
          </p>

          <p className="mt-6 max-w-lg text-lg leading-8 text-slate-700">
            Career Track connects students with right opportunities and help employers discover the right candidates.
          </p>

          {/* Buttons */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">

            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-2 w-48 h-10 rounded-lg bg-violet-600 px-6 py-3 font-semibold text-white shadow-lg shadow-violet-200 transition hover:bg-violet-700"
            >
              Get Started
              <ArrowRight size={18} />
            </Link>

            <a
              href="#features"
              className="inline-flex items-center justify-center gap-2 w-48 h-10 rounded-lg border border-slate-200 bg-white px-6 py-3 font-semibold text-slate-700 transition hover:border-violet-200 hover:bg-violet-50"
            >
              <PlayCircle size={18} />
              Learn More
            </a>

          </div>
        </div>

        {/* Right Illustration */}
        <div className="relative flex justify-center lg:justify-end">
            <img
    src={heroImage}
    alt="Student preparing for career"
    className="w-full max-w-xl object-contain"
  />
        </div>

      </div>
    </section>
  )
}

export default HeroSection