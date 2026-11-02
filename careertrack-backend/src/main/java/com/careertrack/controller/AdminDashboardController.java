package com.careertrack.controller;

import java.util.Map;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
public class AdminDashboardController {

    private final JdbcTemplate jdbcTemplate;

    public AdminDashboardController(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @GetMapping("/dashboard")
    public Map<String, Object> getDashboardStats() {

        long students = count(
            "SELECT COUNT(*) FROM users WHERE role = 'STUDENT'"
        );

        long employers = count(
            "SELECT COUNT(*) FROM users WHERE role = 'EMPLOYER'"
        );

        long companies = count(
            "SELECT COUNT(*) FROM companies"
        );

        long jobs = count(
            "SELECT COUNT(*) FROM jobs"
        );

        long applications = count(
            "SELECT COUNT(*) FROM applications"
        );

        long interviews = count(
            "SELECT COUNT(*) FROM interviews"
        );

        long selected = count(
            "SELECT COUNT(*) FROM applications WHERE status = 'SELECTED'"
        );

        return Map.of(
            "totalStudents", students,
            "totalEmployers", employers,
            "totalCompanies", companies,
            "totalJobs", jobs,
            "totalApplications", applications,
            "totalInterviews", interviews,
            "totalSelected", selected
        );
    }

    private long count(String sql) {
        Long result = jdbcTemplate.queryForObject(sql, Long.class);
        return result != null ? result : 0L;
    }
}