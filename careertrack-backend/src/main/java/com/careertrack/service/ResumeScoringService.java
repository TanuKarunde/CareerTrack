package com.careertrack.service;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;

import org.springframework.stereotype.Service;

@Service
public class ResumeScoringService {

    private static final Pattern EMAIL = Pattern.compile(
            "[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}",
            Pattern.CASE_INSENSITIVE);

    private static final Pattern PHONE = Pattern.compile(
            "(\\+?\\d[\\d ()-]{7,}\\d)");

    public Map<String, Object> analyze(String text) {
        String lower = text.toLowerCase();

        List<String> strengths = new ArrayList<>();
        List<String> improvements = new ArrayList<>();
        Map<String, Object> details = new LinkedHashMap<>();

        boolean hasEmail = EMAIL.matcher(text).find();
        boolean hasPhone = PHONE.matcher(text).find();

        boolean hasEducation = containsAny(lower,
                "education", "academic", "qualification");
        boolean hasSkills = containsAny(lower,
                "technical skills", "skills", "technologies");
        boolean hasProjects = containsAny(lower,
                "projects", "personal projects", "academic projects");
        boolean hasExperience = containsAny(lower,
                "experience", "internship", "employment");
        boolean hasSummary = containsAny(lower,
                "summary", "objective", "profile");

        int ats = 0;
        ats += hasEmail ? 25 : 0;
        ats += hasPhone ? 20 : 0;
        ats += hasEducation ? 20 : 0;
        ats += hasSkills ? 20 : 0;
        ats += hasProjects || hasExperience ? 15 : 0;

        int skills = hasSkills ? 80 : 25;
        if (containsAny(lower, "java", "sql", "spring boot",
                "python", "javascript", "react")) {
            skills = Math.min(100, skills + 20);
        }

        int projects = hasProjects ? 85 : 20;
        if (hasProjects && containsAny(lower,
                "github", "live demo", "deployed", "implemented")) {
            projects = 100;
        }

        int education = hasEducation ? 85 : 20;
        int experience = hasExperience ? 85 : 45;

        if (hasEmail) strengths.add("Email address detected.");
        else improvements.add("Add a professional email address.");

        if (hasPhone) strengths.add("Phone number detected.");
        else improvements.add("Add a contact phone number.");

        if (hasEducation) strengths.add("Education section detected.");
        else improvements.add("Add an Education section.");

        if (hasSkills) strengths.add("Skills section detected.");
        else improvements.add("Add a clearly labelled Technical Skills section.");

        if (hasProjects) strengths.add("Projects section detected.");
        else improvements.add("Add relevant projects with your contribution and results.");

        if (hasExperience) strengths.add("Experience or internship section detected.");
        else improvements.add("Include internships, practical work, or relevant experience if available.");

        if (hasSummary) strengths.add("Professional summary or objective detected.");
        else improvements.add("Consider adding a concise, role-specific professional summary.");

        if (!containsAny(lower, "github", "portfolio", "linkedin")) {
            improvements.add("Consider adding relevant professional or project links.");
        }

        if (!containsAny(lower, "improved", "reduced", "increased",
                "automated", "optimized", "%")) {
            improvements.add("Where truthful, quantify project outcomes and describe your individual contribution.");
        }

        // Fixed, explainable weighting: these are heuristic scores,
        // not a prediction of whether an employer will shortlist you.
        int overall = (int) Math.round(
                ats * 0.30
                + skills * 0.25
                + projects * 0.20
                + education * 0.10
                + experience * 0.15);

        details.put("emailPresent", hasEmail);
        details.put("phonePresent", hasPhone);
        details.put("educationPresent", hasEducation);
        details.put("skillsPresent", hasSkills);
        details.put("projectsPresent", hasProjects);
        details.put("experiencePresent", hasExperience);
        details.put("summaryPresent", hasSummary);
        details.put("wordCount", text.split("\\s+").length);
        details.put("scoringMethod", "rule-based heuristic");

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("overallScore", overall);
        result.put("atsScore", ats);
        result.put("skillsScore", skills);
        result.put("projectsScore", projects);
        result.put("educationScore", education);
        result.put("experienceScore", experience);
        result.put("strengths", strengths);
        result.put("improvements", improvements);
        result.put("extractedDetails", details);

        return result;
    }

    private boolean containsAny(String text, String... terms) {
        for (String term : terms) {
            if (text.contains(term)) {
                return true;
            }
        }
        return false;
    }
}