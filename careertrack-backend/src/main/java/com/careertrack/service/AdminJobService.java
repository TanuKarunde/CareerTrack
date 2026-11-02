
package com.careertrack.service;

import java.util.List;
import java.util.Locale;
import java.util.Set;

import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.careertrack.dto.AdminJobResponse;
import com.careertrack.entity.Job;
import com.careertrack.repository.JobRepository;

@Service
public class AdminJobService {

    private final JobRepository jobRepository;

    public AdminJobService(JobRepository jobRepository) {
        this.jobRepository = jobRepository;
    }

    @Transactional(readOnly = true)
    public List<AdminJobResponse> getJobs(
            String search,
            String status,
            String jobType) {

        String keyword = search == null
                ? ""
                : search.trim().toLowerCase(Locale.ROOT);

        String normalizedStatus = status == null
                ? "ALL"
                : status.trim().toUpperCase(Locale.ROOT);

        String normalizedType = jobType == null
                ? "ALL"
                : jobType.trim().toUpperCase(Locale.ROOT);

        if (!Set.of("ALL", "ACTIVE", "INACTIVE")
                .contains(normalizedStatus)) {
            throw new IllegalArgumentException(
                    "Invalid status. Use ALL, ACTIVE, or INACTIVE."
            );
        }

        List<Job> jobs = jobRepository.findAll(
                Sort.by(Sort.Direction.DESC, "createAt")
        );

        return jobs.stream()
                .filter(job -> {
                    if ("ACTIVE".equals(normalizedStatus)) {
                        return job.isActive();
                    }

                    if ("INACTIVE".equals(normalizedStatus)) {
                        return !job.isActive();
                    }

                    return true;
                })
                .filter(job ->
                        "ALL".equals(normalizedType)
                        || normalizedType.equalsIgnoreCase(job.getJobType())
                )
                .filter(job -> {
                    if (keyword.isBlank()) {
                        return true;
                    }

                    String employerName = job.getEmployer() == null
                            ? ""
                            : safe(job.getEmployer().getName());

                    String employerEmail = job.getEmployer() == null
                            ? ""
                            : safe(job.getEmployer().getEmail());

                    return contains(job.getTitle(), keyword)
                            || contains(job.getCompany(), keyword)
                            || contains(job.getLocation(), keyword)
                            || contains(job.getJobType(), keyword)
                            || contains(job.getExperienceLevel(), keyword)
                            || contains(job.getSkills(), keyword)
                            || contains(employerName, keyword)
                            || contains(employerEmail, keyword);
                })
                .map(AdminJobResponse::new)
                .toList();
    }

    @Transactional(readOnly = true)
    public AdminJobResponse getJob(Long id) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException("Job not found.")
                );

        return new AdminJobResponse(job);
    }

    @Transactional
    public AdminJobResponse updateJobStatus(
            Long id,
            boolean active) {

        Job job = jobRepository.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException("Job not found.")
                );

        job.setActive(active);

        Job updatedJob = jobRepository.save(job);

        return new AdminJobResponse(updatedJob);
    }

    private boolean contains(String value, String keyword) {
        return value != null
                && value.toLowerCase(Locale.ROOT).contains(keyword);
    }

    private String safe(String value) {
        return value == null ? "" : value;
    }
}
