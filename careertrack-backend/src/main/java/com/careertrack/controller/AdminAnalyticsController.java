package com.careertrack.controller;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/analytics")
@PreAuthorize("hasRole('ADMIN')")
public class AdminAnalyticsController {

    private final JdbcTemplate jdbcTemplate;

    public AdminAnalyticsController(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @GetMapping
    public Map<String, Object> getAnalytics() {

        Map<String, Object> result = new LinkedHashMap<>();

        // User analytics
        result.put("totalStudents", count(
                "SELECT COUNT(*) FROM users WHERE role = 'STUDENT'"));

        result.put("totalEmployers", count(
                "SELECT COUNT(*) FROM users WHERE role = 'EMPLOYER'"));

        // Company analytics
        result.put("totalCompanies", count(
                "SELECT COUNT(*) FROM companies"));

        result.put("pendingCompanies", count(
                "SELECT COUNT(*) FROM companies WHERE verification_status = 'PENDING'"));

        result.put("verifiedCompanies", count(
                "SELECT COUNT(*) FROM companies WHERE verification_status = 'VERIFIED'"));

        result.put("rejectedCompanies", count(
                "SELECT COUNT(*) FROM companies WHERE verification_status = 'REJECTED'"));

        // Job analytics
        result.put("totalJobs", count(
                "SELECT COUNT(*) FROM jobs"));

        result.put("activeJobs", count(
                "SELECT COUNT(*) FROM jobs WHERE active = TRUE"));

        result.put("inactiveJobs", count(
                "SELECT COUNT(*) FROM jobs WHERE active = FALSE"));

        // Application analytics
        result.put("totalApplications", count(
                "SELECT COUNT(*) FROM applications"));

        result.put("shortlistedApplications", count(
                "SELECT COUNT(*) FROM applications WHERE status = 'SHORTLISTED'"));

        result.put("interviewStageApplications", count(
                "SELECT COUNT(*) FROM applications WHERE status = 'INTERVIEW'"));

        result.put("selectedApplications", count(
                "SELECT COUNT(*) FROM applications WHERE status = 'SELECTED'"));

        result.put("rejectedApplications", count(
                "SELECT COUNT(*) FROM applications WHERE status = 'REJECTED'"));

        // Interview analytics
        result.put("totalInterviews", count(
                "SELECT COUNT(*) FROM interviews"));

        result.put("scheduledInterviews", count(
                "SELECT COUNT(*) FROM interviews WHERE status = 'SCHEDULED'"));

        // Monthly trends
        result.put("monthlyRegistrations", queryRows("""
                SELECT
                    DATE_FORMAT(created_at, '%Y-%m') AS month,
                    SUM(CASE WHEN role = 'STUDENT' THEN 1 ELSE 0 END) AS students,
                    SUM(CASE WHEN role = 'EMPLOYER' THEN 1 ELSE 0 END) AS employers
                FROM users
                WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 11 MONTH)
                GROUP BY DATE_FORMAT(created_at, '%Y-%m')
                ORDER BY month
                """));

        result.put("monthlyJobs", queryRows("""
                SELECT
                    DATE_FORMAT(create_at, '%Y-%m') AS month,
                    COUNT(*) AS total
                FROM jobs
                WHERE create_at >= DATE_SUB(CURDATE(), INTERVAL 11 MONTH)
                GROUP BY DATE_FORMAT(create_at, '%Y-%m')
                ORDER BY month
                """));

        result.put("monthlyApplications", queryRows("""
                SELECT
                    DATE_FORMAT(applied_at, '%Y-%m') AS month,
                    COUNT(*) AS total
                FROM applications
                WHERE applied_at >= DATE_SUB(CURDATE(), INTERVAL 11 MONTH)
                GROUP BY DATE_FORMAT(applied_at, '%Y-%m')
                ORDER BY month
                """));

        result.put("monthlyInterviews", queryRows("""
                SELECT
                    DATE_FORMAT(interview_date, '%Y-%m') AS month,
                    COUNT(*) AS total
                FROM interviews
                WHERE interview_date >= DATE_SUB(CURDATE(), INTERVAL 11 MONTH)
                  AND interview_date IS NOT NULL
                GROUP BY DATE_FORMAT(interview_date, '%Y-%m')
                ORDER BY month
                """));

        return result;
    }

    private long count(String sql) {
        Long value = jdbcTemplate.queryForObject(sql, Long.class);
        return value != null ? value : 0L;
    }

    private List<Map<String, Object>> queryRows(String sql) {
        return jdbcTemplate.queryForList(sql);
    }
}
