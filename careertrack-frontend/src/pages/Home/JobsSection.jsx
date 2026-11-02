import { useEffect, useState } from "react";
import {
  Search,
  MapPin,
  BriefcaseBusiness,
  ArrowRight,
} from "lucide-react";

import {
  getJobs,
  searchJobs,
} from "../../services/jobService";
import { useNavigate } from "react-router-dom";

const popularSearches = [
  "Software Developer",
  "Java Developer",
  "Frontend Developer",
  "Full Stack Developer",
  "Data Analyst",
];

const JobsSection = () => {

    const navigate = useNavigate();

const handleViewJob = (job) => {
    navigate(`/jobs/${job.id}`);
};


  const [jobs, setJobs] = useState([]);
const [keyword, setKeyword] = useState("");
const [location, setLocation] = useState("");
const [searching, setSearching] = useState(false);
const [hasSearched, setHasSearched] = useState(false);

  // =====================================================
  // SEARCH REAL JOBS
  // =====================================================

  const handleSearch = () => {
  const trimmedKeyword = keyword.trim();
  const trimmedLocation = location.trim();

  // Don't navigate if both are empty
  if (!trimmedKeyword && !trimmedLocation) {
    return;
  }

  const params = new URLSearchParams();

  if (trimmedKeyword) {
    params.set("keyword", trimmedKeyword);
  }

  if (trimmedLocation) {
    params.set("location", trimmedLocation);
  }

  navigate(`/search-jobs?${params.toString()}`);
};

  // =====================================================
  // POPULAR SEARCH
  // =====================================================

  const handlePopularSearch = async (search) => {
    setKeyword(search);

    try {
        setSearching(true);

        const data = await searchJobs(search);

        let results = Array.isArray(data)
            ? data
            : [];

        if (location.trim()) {
            const locationText =
                location.trim().toLowerCase();

            results = results.filter(
                (job) =>
                    (job?.location || "")
                        .toLowerCase()
                        .includes(locationText)
            );
        }

        setJobs(results);
        setHasSearched(true);

    } catch (error) {
        console.error(
            "Popular search error:",
            error
        );

        setJobs([]);
        setHasSearched(true);

    } finally {
        setSearching(false);
    }
};

  // =====================================================
  // VIEW JOB
  // =====================================================

  const handleViewAllJobs = () => {

    const params = new URLSearchParams();

    if (keyword.trim()) {
        params.set("keyword", keyword.trim());
    }

    if (location.trim()) {
        params.set("location", location.trim());
    }

    navigate(`/search-jobs?${params.toString()}`);
};

  return (

    <section
      id="jobs"
      className="bg-white !py-14"
    >

      <div
        className="
          !mx-auto
          max-w-7xl
          px-4
          sm:px-6
          lg:px-8
        "
      >

        {/* =================================================
            HEADING
        ================================================= */}

        <div
          className="
            mx-auto
            max-w-auto
            text-center
          "
        >

          <h2
            className="
              text-2xl
              font-bold
              text-[#17205c]
              sm:text-3xl
            "
          >
            Find Your Next Job
          </h2>

          <p
            className="
              mt-2
              text-sm
              text-slate-500
            "
          >
            Search from thousands of jobs
            and take the next step in your career.
          </p>

        </div>


        {/* =================================================
            SEARCH BAR
        ================================================= */}

        <div
  className="
    !mx-auto
    !mt-6
    grid
    max-w-5xl
    grid-cols-[7fr_1fr]
    gap-4
    mb-7
  "
>
  {/* Column 1: Keyword + Location */}
  <div
    className="
      flex
      h-12
      overflow-hidden
      rounded-xl
      border
      border-slate-200
      bg-white
      shadow-sm
    "
  >
    {/* Keyword */}
    <div
      className="
        flex
        flex-1
        items-center
        border-r
        border-slate-200
        !px-4
      "
    >
      <Search
        size={18}
        className="!mr-3 flex-shrink-0 text-slate-400"
      />

      <input
        type="text"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSearch();
          }
        }}
        placeholder="Job title, skills or company"
        className="
          w-full
          bg-transparent
          text-sm
          text-slate-700
          outline-none
          placeholder:text-slate-400
        "
      />
    </div>

    {/* Location */}
    <div
      className="
        flex
        flex-1
        items-center
        !px-4
      "
    >
      <MapPin
        size={18}
        className="!mr-3 flex-shrink-0 text-slate-400"
      />

      <input
        type="text"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSearch();
          }
        }}
        placeholder="Location"
        className="
          w-full
          bg-transparent
          text-sm
          text-slate-700
          outline-none
          placeholder:text-slate-400
        "
      />
    </div>
  </div>

  {/* Column 2: Search Button */}
  <div className="flex items-center">
    <button
      onClick={handleSearch}
      disabled={searching}
      className="
        h-12
        w-full
        rounded-xl
        bg-purple-600
        px-7
        text-sm
        font-semibold
        text-white
        transition
        hover:bg-purple-700
        disabled:cursor-not-allowed
        disabled:opacity-60
      "
    >
      {searching ? "Searching..." : "Search Jobs"}
    </button>
  </div>
</div>


        {/* =================================================
            POPULAR SEARCHES
        ================================================= */}

        <div
          className="
            !mx-25
            !mt-4
            max-w-3xl
          "
        >

          <div
            className="
              flex
              flex-wrap
              items-center
              justify-center
              gap-2
            "
          >

            <span
              className="
                !mr-1
                text-[11px]
                font-semibold
                text-slate-500
              "
            >
              Popular Searches:
            </span>

            {popularSearches.map(
              (search) => (

                <button
                  key={search}
                  onClick={() =>
                    handlePopularSearch(
                      search
                    )
                  }
                  className="
                    rounded-full
                    bg-purple-100
                    !px-3
                    !py-1.5
                    text-[11px]
                    font-medium
                    text-purple-600
                    transition
                    hover:bg-purple-200
                  "
                >
                  {search}
                </button>

              )
            )}

          </div>

        </div>


      </div>

    </section>
  );
}

export default JobsSection;