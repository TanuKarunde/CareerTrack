import {
  Briefcase,
  Link,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#F7F6FF] text-[#29205F]">

      {/* Footer Main */}
      <div className="max-w-full mx-auto !px-8 !py-10 !ml-40">

        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Logo / About */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-md bg-[#6A0DAD] flex items-center justify-center">
                <Briefcase
                  className="w-4 h-4 text-white"
                  strokeWidth={2}
                />
              </div>

              <h2 className="text-lg font-bold text-[#29205F]">
                CareerTrack
              </h2>
            </div>

            <p className="text-sm text-[#77718F] leading-6">
              Your career journey starts here.
            </p>

            {/* Social Icons */}
            <div className="flex gap-3 mt-5">
              <a
                className="text-[#51458A] hover:text-[#6A0DAD]"
              >
                <Link className="w-4 h-4" />
              </a>

              <a
                className="text-[#51458A] hover:text-[#6A0DAD]"
              >
                <Link className="w-4 h-4" />
              </a>

              <a
                className="text-[#51458A] hover:text-[#6A0DAD]"
              >
                <Link className="w-4 h-4" />
              </a>

              <a
                className="text-[#51458A] hover:text-[#6A0DAD]"
              >
                <Link className="w-4 h-4" />
              </a>
            </div>
          </div>


          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-sm mb-4">
              Quick Links
            </h3>

            <ul className="space-y-2 text-sm text-[#77718F]">
              <li>
                <a href="/" className="hover:text-[#6A0DAD]">
                  Home
                </a>
              </li>

              <li>
                <a href="#features" className="hover:text-[#6A0DAD]">
                  Features
                </a>
              </li>

              <li>
                <a href="#works" className="hover:text-[#6A0DAD]">
                  How It Works
                </a>
              </li>

              <li>
                <a href="#jobs" className="hover:text-[#6A0DAD]">
                  Jobs
                </a>
              </li>
            </ul>
          </div>


          {/* Students */}
          <div>
            <h3 className="font-semibold text-sm mb-4">
              For Students
            </h3>

            <ul className="space-y-2 text-sm text-[#77718F]">
              <li>
                <a href="/login" className="hover:text-[#6A0DAD]">
                  Jobs
                </a>
              </li>

              <li>
                <a href="/login" className="hover:text-[#6A0DAD]">
                  Applications
                </a>
              </li>

              <li>
                <a href="/login" className="hover:text-[#6A0DAD]">
                  Profile
                </a>
              </li>

              <li>
                <a href="/login" className="hover:text-[#6A0DAD]">
                  Dashboard
                </a>
              </li>
            </ul>
          </div>


          {/* Employers */}
          <div>
            <h3 className="font-semibold text-sm mb-4">
              For Employers
            </h3>

            <ul className="space-y-2 text-sm text-[#77718F]">
              <li>
                <a href="/login" className="hover:text-[#6A0DAD]">
                  Post Job
                </a>
              </li>

              <li>
                <a href="/login" className="hover:text-[#6A0DAD]">
                  Candidates
                </a>
              </li>

              <li>
                <a href="/login" className="hover:text-[#6A0DAD]">
                  Dashboard
                </a>
              </li>

              <li>
                <a href="/login" className="hover:text-[#6A0DAD]">
                  About Us
                </a>
              </li>
            </ul>
          </div>

        </div>
      </div>


      {/* Bottom Bar */}
      <div className="border-t border-[#E5E1F5]">
        <div className="max-w-7xl mx-auto !px-8 !py-4 flex flex-col md:flex-row justify-between items-center gap-2 !ml-40">

          <p className="text-xs text-[#88839D]">
            © 2026 CareerTrack. All rights reserved.
          </p>

          <div className="flex gap-4 text-xs text-[#88839D]">
            <span>Build</span>
            <span>•</span>
            <span>Connect</span>
            <span>•</span>
            <span>Grow</span>
          </div>

        </div>
      </div>

    </footer>
  );
};

export default Footer;