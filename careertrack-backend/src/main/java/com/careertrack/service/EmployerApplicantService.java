package com.careertrack.service;

import java.util.List;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.careertrack.dto.ApplicantResponse;
import com.careertrack.dto.ApplicationResponse;
import com.careertrack.entity.Application;
import com.careertrack.entity.ApplicationStatus;
import com.careertrack.entity.StudentProfile;
import com.careertrack.entity.User;
import com.careertrack.repository.ApplicationRepository;
import com.careertrack.repository.StudentProfileRepository;
import com.careertrack.repository.UserRepository;

@Service
public class EmployerApplicantService {

    private final UserRepository userRepository;
    private final ApplicationRepository applicationRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final NotificationService notificationService;

    public EmployerApplicantService(
            UserRepository userRepository,
            ApplicationRepository applicationRepository,
            StudentProfileRepository studentProfileRepository,
            NotificationService notificationService
    ) {
        this.userRepository = userRepository;
        this.applicationRepository = applicationRepository;
        this.studentProfileRepository = studentProfileRepository;
        this.notificationService = notificationService;
    }

    // =====================================================
    // Get single applicant profile
    // =====================================================

    public ApplicantResponse getApplicants(Long id, User employer) {

        Application application = applicationRepository
                .findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Application not found")
                );

        Long loggedInEmployerId = employer.getId();

        Long applicationEmployerId =
                application.getJob()
                        .getEmployer()
                        .getId();

        if (!applicationEmployerId.equals(loggedInEmployerId)) {

            throw new RuntimeException(
                    "You are not allowed to view this application"
            );
        }

        User student = application.getStudent();

        StudentProfile profile =
                studentProfileRepository
                        .findByUserId(student.getId())
                        .orElse(null);

        return new ApplicantResponse(
                application,
                profile
        );
    }

    // =====================================================
    // Update applicant status
    // =====================================================

@Transactional
public ApplicantResponse updateStatus(
        Long applicationId,
        ApplicationStatus status,
        User employer
) {
    Application application = applicationRepository
            .findById(applicationId)
            .orElseThrow(() ->
                    new RuntimeException("Application not found"));

    // Verify employer ownership.
    if (!application.getJob()
            .getEmployer()
            .getId()
            .equals(employer.getId())) {
        throw new RuntimeException(
                "You are not allowed to update this application");
    }

    if (status == null) {
        throw new RuntimeException(
                "Application status is required");
    }

    ApplicationStatus previousStatus = application.getStatus();

    // Save the new status.
    application.setStatus(status);
    Application updated = applicationRepository.save(application);

    // Send notification only when the status actually changes.
    if (previousStatus != status) {
        User student = updated.getStudent();

        String jobTitle = updated.getJob().getTitle();
        String title;
        String message;

        switch (status.name()) {
            case "SHORTLISTED":
                title = "Application Shortlisted!";
                message = "Your application for " + jobTitle
                        + " has been shortlisted by the employer.";
                break;

            case "REJECTED":
                title = "Application Status Updated";
                message = "Unfortunately, your application for "
                        + jobTitle + " has been rejected.";
                break;

            case "SELECTED":
                title = "Congratulations! You Are Selected";
                message = "Congratulations! You have been selected "
                        + "for " + jobTitle + ".";
                break;

            case "INTERVIEW":
                title = "Application Moved to Interview Stage";
                message = "Your application for " + jobTitle
                        + " has moved to the interview stage. "
                        + "Check your interviews for further details.";
                break;

            default:
                title = "Application Status Updated";
                message = "Your application for " + jobTitle
                        + " has been updated to "
                        + status.name().replace("_", " ") + ".";
                break;
        }

        notificationService.create(
                student.getEmail(),
                "STUDENT",
                "APPLICATION",
                title,
                message,
                updated.getId(),
                "APPLICATION"
        );
    }

    StudentProfile profile = studentProfileRepository
            .findByUserId(updated.getStudent().getId())
            .orElse(null);

    return new ApplicantResponse(updated, profile);
}

    // =====================================================
    // Get all applicants for logged-in employer
    // =====================================================

    public List<ApplicantResponse> getEmployerApplicants(
            User employer
    ) {

        return applicationRepository
                .findByJobEmployerIdOrderByAppliedAtDesc(
                        employer.getId()
                )
                .stream()
                .map(application -> {

                    User student =
                            application.getStudent();

                    StudentProfile profile =
                            studentProfileRepository
                                    .findByUserId(student.getId())
                                    .orElse(null);

                    return new ApplicantResponse(
                            application,
                            profile
                    );
                })
                .toList();
    }

    // =====================================================
    // Get applications of a particular student
    // =====================================================

    public List<ApplicationResponse> getStudentApplications(
            Long studentId,
            User employer
    ) {

        List<Application> applications =
                applicationRepository
                        .findByStudentIdOrderByAppliedAtDesc(
                                studentId
                        );

        return applications.stream()
                .filter(application ->
                        application.getJob()
                                .getEmployer()
                                .getId()
                                .equals(employer.getId())
                )
                .map(ApplicationResponse::new)
                .toList();
    }
    
    
 // =========================================================
    // EMPLOYER VIEW APPLICATION RESUME
    // =========================================================


public ResponseEntity<byte[]> viewApplicationResume(
        Long applicationId,
        User employer) {

    Application application = applicationRepository
            .findById(applicationId)
            .orElseThrow(() ->
                    new RuntimeException("Application not found"));

    checkEmployerAccess(application, employer);

    // Only the resume submitted with this application.
    byte[] resume = application.getResume();
    String fileName = application.getResumeName();
    String resumeType = application.getResumeType();

    if (resume == null || resume.length == 0) {
        throw new RuntimeException(
                "Application resume not available. " +
                "The student did not submit a resume with this application."
        );
    }

    if (fileName == null || fileName.isBlank()) {
        fileName = "resume.pdf";
    }

    // Prevent quotes in the filename from breaking the header.
    fileName = fileName.replace("\"", "");

    MediaType mediaType = getResumeMediaType(resumeType, fileName);

    return ResponseEntity.ok()
            .contentType(mediaType)
            .header(
                    HttpHeaders.CONTENT_DISPOSITION,
                    "inline; filename=\"" + fileName + "\"")
            .header("X-Content-Type-Options", "nosniff")
            .body(resume);
}

    
    // =========================================================
    // EMPLOYER DOWNLOAD APPLICATION RESUME
    // =========================================================



public ResponseEntity<byte[]> downloadApplicationResume(
        Long applicationId,
        User employer) {

    Application application = applicationRepository
            .findById(applicationId)
            .orElseThrow(() ->
                    new RuntimeException("Application not found"));

    checkEmployerAccess(application, employer);

    // Only the resume submitted with this application.
    byte[] resume = application.getResume();
    String fileName = application.getResumeName();
    String resumeType = application.getResumeType();

    if (resume == null || resume.length == 0) {
        throw new RuntimeException(
                "Application resume not available. " +
                "The student did not submit a resume with this application."
        );
    }

    if (fileName == null || fileName.isBlank()) {
        fileName = "resume.pdf";
    }

    fileName = fileName.replace("\"", "");

    MediaType mediaType = getResumeMediaType(resumeType, fileName);

    return ResponseEntity.ok()
            .contentType(mediaType)
            .contentLength(resume.length)
            .header(
                    HttpHeaders.CONTENT_DISPOSITION,
                    "attachment; filename=\"" + fileName + "\"")
            .header("X-Content-Type-Options", "nosniff")
            .body(resume);
}

    
 // =========================================================
    // CHECK EMPLOYER ACCESS
    // =========================================================

    private void checkEmployerAccess(
            Application application,
            User employer) {

        if (application.getJob() == null ||
                application.getJob().getEmployer() == null) {

            throw new RuntimeException(
                    "Application job information not found");
        }

        Long applicationEmployerId =
                application.getJob()
                        .getEmployer()
                        .getId();

        if (!applicationEmployerId.equals(
                employer.getId())) {

            throw new RuntimeException(
                    "You are not allowed to access this resume");
        }
    }
    
 // =========================================================
    // RESUME MEDIA TYPE
    // =========================================================

    private MediaType getResumeMediaType(String resumeType, String fileName) {

        if (resumeType != null && !resumeType.isBlank()) {
            try {
                return MediaType.parseMediaType(resumeType);
            } catch (Exception ignored) {
                // Fall back to the filename extension.
            }
        }

        if (fileName != null) {
            String lowerName = fileName.toLowerCase();

            if (lowerName.endsWith(".pdf")) {
                return MediaType.APPLICATION_PDF;
            }

            if (lowerName.endsWith(".docx")) {
                return MediaType.parseMediaType(
                        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                );
            }

            if (lowerName.endsWith(".doc")) {
                return MediaType.parseMediaType("application/msword");
            }
        }

        return MediaType.APPLICATION_OCTET_STREAM;
    }
    

    // ==========================================
    // VIEW STUDENT PROFILE RESUME
    // ==========================================

    public ResponseEntity<byte[]> viewStudentProfileResume(
            Long applicationId,
            User employer) {

        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() ->
                        new RuntimeException("Application not found"));

        checkEmployerAccess(application, employer);

        StudentProfile profile = studentProfileRepository
                .findByUserId(application.getStudent().getId())
                .orElseThrow(() ->
                        new RuntimeException("Student profile not found"));

        return buildResumeResponse(
                profile.getResume(),
                profile.getResumeName(),
                profile.getResumeType(),
                false
        );
    }

    // ==========================================
    // DOWNLOAD STUDENT PROFILE RESUME
    // ==========================================

    public ResponseEntity<byte[]> downloadStudentProfileResume(
            Long applicationId,
            User employer) {

        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() ->
                        new RuntimeException("Application not found"));

        checkEmployerAccess(application, employer);

        StudentProfile profile = studentProfileRepository
                .findByUserId(application.getStudent().getId())
                .orElseThrow(() ->
                        new RuntimeException("Student profile not found"));

        return buildResumeResponse(
                profile.getResume(),
                profile.getResumeName(),
                profile.getResumeType(),
                true
        );
    }

    // ==========================================
    // COMMON PROFILE RESUME RESPONSE
    // ==========================================

    private ResponseEntity<byte[]> buildResumeResponse(
            byte[] resume,
            String fileName,
            String resumeType,
            boolean download) {

        if (resume == null || resume.length == 0) {
            throw new RuntimeException("Profile resume not available");
        }

        if (fileName == null || fileName.isBlank()) {
            fileName = "resume.pdf";
        }

        fileName = fileName.replace("\"", "");

        MediaType mediaType = getResumeMediaType(resumeType, fileName);

        return ResponseEntity.ok()
                .contentType(mediaType)
                .contentLength(resume.length)
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        (download ? "attachment" : "inline")
                                + "; filename=\"" + fileName + "\"")
                .header("X-Content-Type-Options", "nosniff")
                .body(resume);
    }


}