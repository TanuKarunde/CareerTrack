package com.careertrack.config;

import java.util.Arrays;
import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.careertrack.entity.InterviewSkill;
import com.careertrack.entity.InterviewTopic;
import com.careertrack.repository.InterviewSkillRepository;
import com.careertrack.repository.InterviewTopicRepository;

@Component
public class InterviewTopicDataInitializer implements CommandLineRunner {

    private final InterviewTopicRepository topicRepository;
    private final InterviewSkillRepository skillRepository;

    public InterviewTopicDataInitializer(
            InterviewTopicRepository topicRepository,
            InterviewSkillRepository skillRepository) {

        this.topicRepository = topicRepository;
        this.skillRepository = skillRepository;
    }

    @Override
    @Transactional
    public void run(String... args) {

        System.out.println(
                "========== Initializing Interview Preparation Data =========="
        );

        // =====================================================
        // 1. CREATE / UPDATE MAIN TOPICS
        // =====================================================

        InterviewTopic aptitude = createOrGetTopic(
                "Aptitude",
                "Practice quantitative aptitude, logical reasoning, verbal ability and problem solving.",
                "calculator"
        );

        InterviewTopic technical = createOrGetTopic(
                "Technical",
                "Prepare technical interview questions from programming, databases, web development and computer science.",
                "code"
        );

        InterviewTopic coding = createOrGetTopic(
                "Coding",
                "Practice programming problems, data structures, algorithms and interview coding challenges.",
                "terminal"
        );

        InterviewTopic hr = createOrGetTopic(
                "HR",
                "Prepare common HR interview questions and fresher interview questions.",
                "users"
        );

        InterviewTopic behavioral = createOrGetTopic(
                "Behavioral",
                "Practice teamwork, leadership, communication and workplace situation questions.",
                "message-circle"
        );

        InterviewTopic mockInterview = createOrGetTopic(
                "Mock Interview",
                "Take a complete AI-powered mock interview combining technical, coding, HR and behavioral questions.",
                "mic"
        );


        // =====================================================
        // 2. APTITUDE SKILLS
        // =====================================================

        createSkills(
                aptitude,

                "Quantitative Aptitude",
                "Logical Reasoning",
                "Verbal Ability",
                "Data Interpretation",
                "Problem Solving",
                "Number System",
                "Percentages",
                "Profit and Loss",
                "Ratio and Proportion",
                "Average",
                "Time and Work",
                "Time Speed and Distance",
                "Simple Interest",
                "Compound Interest",
                "Probability",
                "Permutation and Combination",
                "Algebra",
                "Geometry",
                "Mensuration",
                "Ages",
                "Mixtures and Allegations",
                "Partnership",
                "Pipes and Cisterns",
                "Boats and Streams",
                "Clocks",
                "Calendars",
                "Series",
                "Data Sufficiency"
        );


        // =====================================================
        // 3. TECHNICAL SKILLS
        // =====================================================

        createSkills(
                technical,

                // Programming
                "Java",
                "Python",
                "C",
                "C++",
                "C#",
                "JavaScript",
                "Kotlin",
                "Go",

                // Web
                "HTML",
                "CSS",
                "Bootstrap",
                "Tailwind CSS",
                "React",
                "Node.js",
                "Express.js",

                // Java ecosystem
                "Core Java",
                "Advanced Java",
                "JDBC",
                "Servlets",
                "JSP",
                "Spring",
                "Spring Boot",
                "Spring MVC",
                "Spring Security",
                "Hibernate",
                "JPA",
                "REST API",

                // Database
                "SQL",
                "MySQL",
                "PostgreSQL",
                "MongoDB",
                "DBMS",
                "Database Normalization",
                "Transactions",
                "Indexes",

                // Programming concepts
                "OOP",
                "Exception Handling",
                "Collections",
                "Multithreading",
                "File Handling",
                "Generics",
                "Lambda Expressions",
                "Streams API",

                // DSA
                "Data Structures",
                "Algorithms",
                "DSA",

                // Computer science
                "Operating Systems",
                "Computer Networks",
                "Software Engineering",
                "Computer Architecture",
                "System Design",

                // Development
                "Git",
                "GitHub",
                "Maven",
                "Gradle",
                "Microservices"
        );


        // =====================================================
        // 4. CODING SKILLS
        // =====================================================

        createSkills(
                coding,

                // Languages
                "Java",
                "Python",
                "C",
                "C++",
                "C#",
                "JavaScript",
                "Kotlin",
                "Go",

                // Basic programming
                "Variables and Data Types",
                "Operators",
                "Conditional Statements",
                "Loops",
                "Functions",
                "Methods",
                "Input and Output",
                "Type Casting",
                "Exception Handling",

                // Arrays and Strings
                "Arrays",
                "Two Dimensional Arrays",
                "Strings",
                "String Manipulation",
                "Matrix Problems",

                // Linked List
                "Linked List",
                "Singly Linked List",
                "Doubly Linked List",
                "Circular Linked List",

                // Stack and Queue
                "Stack",
                "Queue",
                "Circular Queue",
                "Deque",
                "Priority Queue",

                // Hashing
                "Hashing",
                "HashMap",
                "HashSet",

                // Recursion
                "Recursion",
                "Backtracking",

                // Searching
                "Linear Search",
                "Binary Search",

                // Sorting
                "Bubble Sort",
                "Selection Sort",
                "Insertion Sort",
                "Merge Sort",
                "Quick Sort",
                "Heap Sort",

                // Algorithm techniques
                "Two Pointers",
                "Sliding Window",
                "Prefix Sum",
                "Difference Array",
                "Divide and Conquer",

                // Trees
                "Binary Tree",
                "Binary Search Tree",
                "AVL Tree",
                "Heap",
                "Trie",

                // Graph
                "Graphs",
                "BFS",
                "DFS",
                "Shortest Path",
                "Dijkstra Algorithm",
                "Bellman Ford Algorithm",
                "Floyd Warshall Algorithm",
                "Topological Sort",
                "Minimum Spanning Tree",

                // Advanced algorithms
                "Greedy Algorithms",
                "Dynamic Programming",
                "Bit Manipulation",
                "Union Find",
                "Disjoint Set",
                "Segment Tree",
                "Fenwick Tree",

                // Problem categories
                "Pattern Problems",
                "Mathematical Problems",
                "Array Problems",
                "String Problems",
                "Matrix Problems",
                "Easy Problems",
                "Medium Problems",
                "Hard Problems",
                "Interview Coding Problems",
                "Competitive Programming"
        );


        // =====================================================
        // 5. HR SKILLS
        // =====================================================

        createSkills(
                hr,

                "Self Introduction",
                "Tell Me About Yourself",
                "Strengths",
                "Weaknesses",
                "Career Goals",
                "Short Term Goals",
                "Long Term Goals",
                "Why Should We Hire You",
                "Why Do You Want To Join Our Company",
                "Why This Company",
                "Why This Job",
                "Salary Expectations",
                "Relocation",
                "Work From Home",
                "Education",
                "Academic Projects",
                "Project Explanation",
                "Internship Experience",
                "Fresher Questions",
                "Gap Explanation",
                "Career Change",
                "Higher Studies",
                "Questions For Interviewer"
        );


        // =====================================================
        // 6. BEHAVIORAL SKILLS
        // =====================================================

        createSkills(
                behavioral,

                "Teamwork",
                "Leadership",
                "Communication",
                "Conflict Management",
                "Problem Solving",
                "Decision Making",
                "Time Management",
                "Adaptability",
                "Work Under Pressure",
                "Handling Failure",
                "Handling Criticism",
                "Taking Responsibility",
                "Workplace Situations",
                "Difficult Team Member",
                "Difficult Manager",
                "Meeting Deadlines",
                "Prioritization",
                "Collaboration",
                "Initiative",
                "Professionalism"
        );


        // =====================================================
        // 7. MOCK INTERVIEW SKILLS
        // =====================================================

        createSkills(
                mockInterview,

                "Technical",
                "Coding",
                "HR",
                "Behavioral",
                "Mixed Interview",
                "Fresher Mock Interview",
                "Java Mock Interview",
                "Full Stack Mock Interview",
                "Software Developer Mock Interview"
        );


        // =====================================================
        // 8. DEACTIVATE OLD TOP-LEVEL TOPICS
        // =====================================================

        deactivateOldTopics();


        System.out.println(
                "========== Interview Preparation Data Ready =========="
        );
    }


    // =========================================================
    // CREATE OR GET TOPIC
    // =========================================================

    private InterviewTopic createOrGetTopic(
            String name,
            String description,
            String icon) {

        InterviewTopic topic = topicRepository
                .findByNameIgnoreCase(name)
                .orElseGet(() -> {

                    InterviewTopic newTopic =
                            new InterviewTopic();

                    newTopic.setName(name);
                    newTopic.setDescription(description);
                    newTopic.setIcon(icon);
                    newTopic.setActive(true);

                    return topicRepository.save(newTopic);
                });


        // Update existing topic

        topic.setDescription(description);
        topic.setIcon(icon);
        topic.setActive(true);

        return topicRepository.save(topic);
    }


    // =========================================================
    // CREATE SKILLS
    // =========================================================

    private void createSkills(
            InterviewTopic topic,
            String... skillNames) {

        List<String> existingSkills =
                skillRepository
                        .findByTopicIdAndActiveTrueOrderByNameAsc(
                                topic.getId()
                        )
                        .stream()
                        .map(InterviewSkill::getName)
                        .toList();


        Arrays.stream(skillNames)
                .forEach(skillName -> {

                    if (!existingSkills
                            .stream()
                            .anyMatch(existing ->
                                    existing.equalsIgnoreCase(skillName))) {

                        InterviewSkill skill =
                                new InterviewSkill();

                        skill.setName(skillName);

                        skill.setDescription(
                                "Practice " +
                                skillName +
                                " based interview questions."
                        );

                        skill.setTopic(topic);

                        skill.setActive(true);

                        skillRepository.save(skill);
                    }
                });
    }


    // =========================================================
    // DEACTIVATE OLD TOP-LEVEL TOPICS
    // =========================================================

    private void deactivateOldTopics() {

        List<String> validTopics = Arrays.asList(
                "Aptitude",
                "Technical",
                "Coding",
                "HR",
                "Behavioral",
                "Mock Interview"
        );


        topicRepository.findAll()
                .forEach(topic -> {

                    if (!validTopics
                            .stream()
                            .anyMatch(valid ->
                                    valid.equalsIgnoreCase(
                                            topic.getName()
                                    ))) {

                        topic.setActive(false);

                        topicRepository.save(topic);
                    }
                });
    }
}