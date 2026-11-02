import { useEffect, useMemo, useState } from "react";
import {
    Check,
    Search,
    X
} from "lucide-react";

import {
    getInterviewPrepSkills
} from "../../services/interviewPrepService";

const InterviewPrepConfigModal = ({
    topic,
    onClose,
    onStart
}) => {

    const [skills, setSkills] = useState([]);

    const [selectedSkillIds, setSelectedSkillIds] =
        useState([]);

    const [experienceLevel, setExperienceLevel] =
        useState("FRESHER");

    const [difficulty, setDifficulty] =
        useState("MEDIUM");

    const [numberOfQuestions, setNumberOfQuestions] =
        useState(10);

    const [search, setSearch] =
        useState("");

    const [loading, setLoading] =
        useState(true);

    const [starting, setStarting] =
        useState(false);

    const [error, setError] =
        useState("");

    useEffect(() => {

        loadSkills();

    }, [topic]);

    const loadSkills = async () => {

        try {

            setLoading(true);
            setError("");

            setSelectedSkillIds([]);

            const data =
                await getInterviewPrepSkills(topic.id);

            setSkills(data);

        } catch (error) {

            console.error(
                "Interview Prep skills error:",
                error
            );

            setError(
                "Unable to load skills."
            );

        } finally {

            setLoading(false);

        }
    };

    const toggleSkill = (skillId) => {

        setSelectedSkillIds((current) => {

            if (current.includes(skillId)) {

                return current.filter(
                    id => id !== skillId
                );

            }

            return [
                ...current,
                skillId
            ];

        });
    };

    const selectAll = () => {

        setSelectedSkillIds(
            skills.map(skill => skill.id)
        );

    };

    const clearAll = () => {

        setSelectedSkillIds([]);

    };

    const filteredSkills = useMemo(() => {

        return skills.filter((skill) =>
            skill.name
                .toLowerCase()
                .includes(
                    search.toLowerCase()
                )
        );

    }, [skills, search]);

    const handleStart = async () => {

        if (selectedSkillIds.length === 0) {

            setError(
                "Please select at least one skill."
            );

            return;
        }

        try {

            setStarting(true);
            setError("");

            await onStart({

                topicId: topic.id,

                skillIds: selectedSkillIds,

                experienceLevel,

                difficulty,

                numberOfQuestions

            });

        } catch (error) {

            console.error(error);

            setError(
                error?.response?.data?.message ||
                "Unable to start Interview Prep."
            );

        } finally {

            setStarting(false);

        }
    };

    return (
        <div
            className="
                fixed
                inset-0
                z-50
                bg-black/50
                flex
                items-center
                justify-center
                !p-4
            "
        >

            <div
                className="
                    bg-white
                    w-full
                    max-w-4xl
                    max-h-[90vh]
                    rounded-2xl
                    shadow-2xl
                    flex
                    flex-col
                "
            >

                {/* Header */}

                <div
                    className="
                        flex
                        items-center
                        justify-between
                        !px-6
                        !py-5
                        border-b
                        border-gray-200
                    "
                >

                    <div>

                        <h2
                            className="
                                text-xl
                                font-bold
                                text-gray-900
                            "
                        >
                            {topic.name} Interview Prep
                        </h2>

                        <p
                            className="
                                text-sm
                                text-gray-500
                                mt-1
                            "
                        >
                            Select the skills you want
                            the AI to test.
                        </p>

                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="
                            !p-2
                            rounded-lg
                            text-gray-500
                            hover:bg-gray-100
                        "
                    >
                        <X size={20} />
                    </button>

                </div>

                {/* Body */}

                <div
                    className="
                        overflow-y-auto
                        !p-6
                    "
                >

                    {error && (

                        <div
                            className="
                                mb-5
                                !p-4
                                rounded-xl
                                bg-red-50
                                border
                                border-red-200
                                text-red-600
                                text-sm
                            "
                        >
                            {error}
                        </div>

                    )}

                    {/* Skills Header */}

                    <div
                        className="
                            flex
                            flex-col
                            md:flex-row
                            md:items-center
                            md:justify-between
                            gap-3
                            mb-4
                        "
                    >

                        <div>

                            <h3
                                className="
                                    font-semibold
                                    text-gray-900
                                "
                            >
                                Select Skills
                            </h3>

                            <p
                                className="
                                    text-xs
                                    text-gray-500
                                    mt-1
                                "
                            >
                                {selectedSkillIds.length}
                                {" "}
                                skill
                                {selectedSkillIds.length !== 1
                                    ? "s"
                                    : ""}
                                {" "}selected
                            </p>

                        </div>

                        <div
                            className="
                                flex
                                items-center
                                gap-3
                            "
                        >

                            <button
                                type="button"
                                onClick={selectAll}
                                className="
                                    text-sm
                                    font-medium
                                    text-purple-600
                                    hover:text-purple-700
                                "
                            >
                                Select All
                            </button>

                            <span className="text-gray-300">
                                |
                            </span>

                            <button
                                type="button"
                                onClick={clearAll}
                                className="
                                    text-sm
                                    font-medium
                                    text-gray-500
                                    hover:text-gray-700
                                "
                            >
                                Clear All
                            </button>

                        </div>

                    </div>

                    {/* Search */}

                    <div
                        className="
                            relative
                            mb-4
                        "
                    >

                        <Search
                            size={18}
                            className="
                                absolute
                                left-3
                                top-1/2
                                -translate-y-1/2
                                text-gray-400
                            "
                        />

                        <input
                            type="text"
                            value={search}
                            onChange={(e) =>
                                setSearch(
                                    e.target.value
                                )
                            }
                            placeholder="Search skills..."
                            className="
                                w-full
                                !pl-10
                                !pr-4
                                !py-3
                                rounded-xl
                                border
                                border-gray-200
                                outline-none
                                focus:border-purple-500
                                focus:ring-2
                                focus:ring-purple-100
                            "
                        />

                    </div>

                    {/* Skills */}

                    {loading ? (

                        <div
                            className="
                                !py-12
                                text-center
                                text-gray-500
                            "
                        >
                            Loading skills...
                        </div>

                    ) : (

                        <div
                            className="
                                grid
                                grid-cols-1
                                sm:grid-cols-2
                                lg:grid-cols-3
                                gap-3
                                max-h-72
                                overflow-y-auto
                                !pr-1
                            "
                        >

                            {filteredSkills.map(
                                (skill) => {

                                    const selected =
                                        selectedSkillIds.includes(
                                            skill.id
                                        );

                                    return (

                                        <button
                                            key={skill.id}
                                            type="button"
                                            onClick={() =>
                                                toggleSkill(
                                                    skill.id
                                                )
                                            }
                                            className={`
                                                flex
                                                items-center
                                                gap-3
                                                !p-3
                                                rounded-xl
                                                border
                                                text-left
                                                transition
                                                ${
                                                    selected
                                                        ? "bg-purple-50 border-purple-500"
                                                        : "bg-white border-gray-300 hover:border-purple-500"
                                                }
                                            `}
                                        >

                                            <div
                                                className={`
                                                    w-5
                                                    h-5
                                                    rounded-md
                                                    border
                                                    flex
                                                    items-center
                                                    justify-center
                                                    shrink-0
                                                    ${
                                                        selected
                                                            ? "bg-purple-600 border-purple-600 text-white"
                                                            : "border-gray-600"
                                                    }
                                                `}
                                            >

                                                {selected && (
                                                    <Check
                                                        size={14}
                                                    />
                                                )}

                                            </div>

                                            <span
                                                className="
                                                    text-sm
                                                    text-gray-700
                                                "
                                            >
                                                {skill.name}
                                            </span>

                                        </button>

                                    );
                                }
                            )}

                        </div>

                    )}

                    {/* Configuration */}

                    <div
                        className="
                            grid
                            grid-cols-1
                            md:grid-cols-3
                            gap-4
                            mt-8
                        "
                    >

                        {/* Experience */}

                        <div>

                            <label
                                className="
                                    block
                                    text-sm
                                    font-medium
                                    text-gray-700
                                    mb-2
                                "
                            >
                                Experience Level
                            </label>

                            <select
                                value={experienceLevel}
                                onChange={(e) =>
                                    setExperienceLevel(
                                        e.target.value
                                    )
                                }
                                className="
                                    w-full
                                    !px-3
                                    !py-3
                                    rounded-xl
                                    border
                                    border-gray-200
                                    outline-none
                                    focus:border-purple-500
                                "
                            >

                                <option value="FRESHER">
                                    Fresher
                                </option>

                                <option value="ZERO_TO_ONE">
                                    0 - 1 Year
                                </option>

                                <option value="ONE_TO_THREE">
                                    1 - 3 Years
                                </option>

                                <option value="THREE_TO_FIVE">
                                    3 - 5 Years
                                </option>

                                <option value="FIVE_PLUS">
                                    5+ Years
                                </option>

                            </select>

                        </div>

                        {/* Difficulty */}

                        <div>

                            <label
                                className="
                                    block
                                    text-sm
                                    font-medium
                                    text-gray-700
                                    mb-2
                                "
                            >
                                Difficulty
                            </label>

                            <select
                                value={difficulty}
                                onChange={(e) =>
                                    setDifficulty(
                                        e.target.value
                                    )
                                }
                                className="
                                    w-full
                                    !px-3
                                    !py-3
                                    rounded-xl
                                    border
                                    border-gray-200
                                    outline-none
                                    focus:border-purple-500
                                "
                            >

                                <option value="EASY">
                                    Easy
                                </option>

                                <option value="MEDIUM">
                                    Medium
                                </option>

                                <option value="HARD">
                                    Hard
                                </option>

                                <option value="ADAPTIVE">
                                    Adaptive
                                </option>

                            </select>

                        </div>

                        {/* Questions */}

                        <div>

                            <label
                                className="
                                    block
                                    text-sm
                                    font-medium
                                    text-gray-700
                                    mb-2
                                "
                            >
                                Number of Questions
                            </label>

                            <select
                                value={numberOfQuestions}
                                onChange={(e) =>
                                    setNumberOfQuestions(
                                        Number(
                                            e.target.value
                                        )
                                    )
                                }
                                className="
                                    w-full
                                    !px-3
                                    !py-3
                                    rounded-xl
                                    border
                                    border-gray-200
                                    outline-none
                                    focus:border-purple-500
                                "
                            >

                                <option value={5}>
                                    5
                                </option>

                                <option value={10}>
                                    10
                                </option>

                                <option value={15}>
                                    15
                                </option>

                                <option value={20}>
                                    20
                                </option>

                                <option value={30}>
                                    30
                                </option>

                            </select>

                        </div>

                    </div>

                </div>

                {/* Footer */}

                <div
                    className="
                        !px-6
                        !py-4
                        border-t
                        border-gray-200
                        flex
                        justify-end
                        gap-3
                    "
                >

                    <button
                        type="button"
                        onClick={onClose}
                        className="
                            !px-5
                            !py-3
                            rounded-xl
                            border
                            border-gray-200
                            text-gray-700
                            hover:bg-gray-50
                        "
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        onClick={handleStart}
                        disabled={
                            starting ||
                            selectedSkillIds.length === 0
                        }
                        className="
                            !px-6
                            !py-3
                            rounded-xl
                            bg-purple-600
                            text-white
                            font-semibold
                            hover:bg-purple-700
                            disabled:opacity-50
                            disabled:cursor-not-allowed
                        "
                    >
                        {starting
                            ? "Starting..."
                            : "Start AI Interview"}
                    </button>

                </div>

            </div>

        </div>
    );
};

export default InterviewPrepConfigModal;