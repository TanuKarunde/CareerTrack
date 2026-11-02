
package com.careertrack.service;

import java.io.IOException;
import java.util.List;
import java.util.Locale;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.careertrack.dto.ApplicationResponse;
import com.careertrack.entity.Application;
import com.careertrack.entity.ApplicationStatus;
import com.careertrack.entity.CompanyMember;
import com.careertrack.entity.CompanyMemberStatus;
import com.careertrack.entity.Job;
import com.careertrack.entity.StudentProfile;
import com.careertrack.entity.User;
import com.careertrack.exception.AlreadyAppliedException;
import com.careertrack.repository.ApplicationRepository;
import com.careertrack.repository.CompanyMemberRepository;
import com.careertrack.repository.JobRepository;
import com.careertrack.repository.StudentProfileRepository;
import com.careertrack.repository.UserRepository;

import jakarta.transaction.Transactional;

@Service
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final JobRepository jobRepository;
    private final UserRepository userRepository;
    private final CompanyMemberRepository companyMemberRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final StudentProfileService studentProfileService;
    private final NotificationService notificationService;

    public ApplicationService(
            ApplicationRepository applicationRepository,
            JobRepository jobRepository,
            UserRepository userRepository,
            CompanyMemberRepository companyMemberRepository,
            StudentProfileRepository studentProfileRepository,
            StudentProfileService studentProfileService,
            NotificationService notificationService) {

        this.applicationRepository = applicationRepository;
        this.jobRepository = jobRepository;
        this.userRepository = userRepository;
        this.companyMemberRepository = companyMemberRepository;
        this.studentProfileRepository = studentProfileRepository;
        this.studentProfileService = studentProfileService;
        this.notificationService = notificationService;
    }

    // ============================================================
    // APPLY FOR JOB
    // Resume is optional
    // ============================================================

    @Transactional
    public ApplicationResponse applyForJob(
            Long jobId,
            User student,
            MultipartFile uploadedResume,
            boolean useProfileResume) {

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() ->
                        new RuntimeException("Job not found"));

        if (!job.isActive()) {
            throw new RuntimeException(
                    "This job is no longer active");
        }

        // Prevent duplicate applications
        if (applicationRepository.existsByJobIdAndStudentId(
                job.getId(), student.getId())) {

            throw new AlreadyAppliedException(
                    "You have already applied for this job");
        }

        StudentProfile profile =
                studentProfileRepository.findByUserId(student.getId())
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Please complete your profile first"));

        // Validate required profile fields.
        // Resume is NOT mandatory.
        studentProfileService.validateProfileForApplication(
                student.getEmail(),
                false
        );

        Application application = new Application();

        application.setJob(job);
        application.setStudent(student);
        application.setStatus(ApplicationStatus.APPLIED);

        // ========================================================
        // OPTION 1: USE PROFILE RESUME
        // ========================================================

        if (useProfileResume) {

            // Copy the profile resume only if one exists.
            if (profile.getResume() != null
                    && profile.getResume().length > 0) {

            	application.setResume(
            	        java.util.Arrays.copyOf(
            	                profile.getResume(),
            	                profile.getResume().length
            	        )
            	);
                application.setResumeName(profile.getResumeName());
                application.setResumeType(profile.getResumeType());
            }

        } else if (uploadedResume != null
                && !uploadedResume.isEmpty()) {

            // ====================================================
            // OPTION 2: UPLOAD A CUSTOM RESUME
            // Saved ONLY in this Application, not StudentProfile.
            // ====================================================

            if (uploadedResume.getSize() > 5 * 1024 * 1024) {
                throw new RuntimeException(
                        "Resume must be 5 MB or smaller");
            }

            String originalName =
                    uploadedResume.getOriginalFilename();

            if (originalName == null || originalName.isBlank()) {
                throw new RuntimeException(
                        "Resume filename is missing");
            }

            String lowerName = originalName.toLowerCase(Locale.ROOT);

            if (!(lowerName.endsWith(".pdf")
                    || lowerName.endsWith(".doc")
                    || lowerName.endsWith(".docx"))) {

                throw new RuntimeException(
                        "Only PDF, DOC, and DOCX resumes are allowed");
            }

            try {
                application.setResume(uploadedResume.getBytes());

            } catch (IOException ex) {
                throw new RuntimeException(
                        "Unable to read uploaded resume", ex);
            }

            application.setResumeName(originalName);
            application.setResumeType(
                    uploadedResume.getContentType());
        }

        // ========================================================
        // NO RESUME SELECTED?
        // Continue and save the application anyway.
        // ========================================================

        Application saved = applicationRepository.save(application);
        
     // Notify the student that the application was submitted.
        notificationService.create(
                student.getEmail(),
                "STUDENT",
                "APPLICATION",
                "Application Submitted Successfully",
                "Your application for "
                        + saved.getJob().getTitle()
                        + " has been submitted successfully.",
                saved.getId(),
                "APPLICATION"
        );
        
     // Notify the employer who owns this job
        User employer = saved.getJob().getEmployer();


        notificationService.create(
                employer.getEmail(),
                "EMPLOYER",
                "APPLICATION",
                "New job application",
                "A new application has been received for "
                        + saved.getJob().getTitle()
                        + " from "
                        + student.getEmail()
                        + ".",
                saved.getId(),
                "APPLICATION"
        );

        return new ApplicationResponse(
                saved,
                getCompanyLogoUrl(saved.getJob())
        );
    }

    // ============================================================
    // GET STUDENT APPLICATIONS
    // ============================================================

    public List<ApplicationResponse> getStudentApplications(
            User student) {

        return applicationRepository
                .findByStudentIdOrderByAppliedAtDesc(student.getId())
                .stream()
                .map(application ->
                        new ApplicationResponse(
                                application,
                                getCompanyLogoUrl(application.getJob())
                        )
                )
                .toList();
    }

    // ============================================================
    // GET APPLICATION BY ID
    // ============================================================

    public ApplicationResponse getApplication(
            Long applicationId,
            User user) {

        Application application =
                applicationRepository.findById(applicationId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Application not found"));

        boolean isStudent =
                application.getStudent().getId()
                        .equals(user.getId());

        boolean isEmployer =
                application.getJob().getEmployer().getId()
                        .equals(user.getId());

        if (!isStudent && !isEmployer) {
            throw new RuntimeException(
                    "You are not allowed to view this application");
        }

        return new ApplicationResponse(
                application,
                getCompanyLogoUrl(application.getJob())
        );
    }

    // ============================================================
    // COMPANY LOGO URL
    // ============================================================

    private String getCompanyLogoUrl(Job job) {

        User employer = job.getEmployer();

        CompanyMember companyMember =
                companyMemberRepository.findByUserAndStatus(
                        employer,
                        CompanyMemberStatus.APPROVED
                ).orElse(null);

        if (companyMember == null
                || companyMember.getCompany() == null) {

            return null;
        }

        Long companyId = companyMember.getCompany().getId();

        return "/api/company/" + companyId + "/logo";
    }
    

    // ============================================================
    // UPDATE APPLICATION STATUS + NOTIFY STUDENT
    // ============================================================

    @Transactional
    public ApplicationResponse updateApplicationStatus(
            Long applicationId,
            ApplicationStatus status,
            User employer) {

        Application application =
                applicationRepository.findById(applicationId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Application not found"));

        // Ensure this employer owns the job.
        if (!application.getJob().getEmployer().getId()
                .equals(employer.getId())) {

            throw new RuntimeException(
                    "You are not allowed to update this application");
        }

        if (status == null) {
            throw new RuntimeException(
                    "Application status is required");
        }

        // Update and save application status.
        application.setStatus(status);

        Application saved =
                applicationRepository.save(application);

        // Prepare notification for the student.
        User student = saved.getStudent();

        String statusText =
                status.name().replace("_", " ");

        String title = "Application status updated";

        String message =
                "Your application for "
                        + saved.getJob().getTitle()
                        + " has been updated to "
                        + statusText
                        + ".";

        // Send notification to the student.
        notificationService.create(
                student.getEmail(),
                "STUDENT",
                "APPLICATION",
                title,
                message,
                saved.getId(),
                "APPLICATION"
        );

        return new ApplicationResponse(
                saved,
                getCompanyLogoUrl(saved.getJob())
        );
    }

}
