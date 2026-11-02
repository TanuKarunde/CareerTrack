package com.careertrack.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.careertrack.dto.InterviewResponse;
import com.careertrack.dto.ScheduleInterviewRequest;
import com.careertrack.entity.Application;
import com.careertrack.entity.Interview;
import com.careertrack.entity.InterviewStatus;
import com.careertrack.repository.ApplicationRepository;
import com.careertrack.repository.InterviewRepository;

@Service
public class InterviewService {

    private final InterviewRepository interviewRepository;
    private final ApplicationRepository applicationRepository;
    private final NotificationService notificationService;

    public InterviewService(
            InterviewRepository interviewRepository,
            ApplicationRepository applicationRepository,
            NotificationService notificationService) {

        this.interviewRepository = interviewRepository;
        this.applicationRepository = applicationRepository;
        this.notificationService = notificationService;
    }

    // Get interviews for a particular employer
    public List<InterviewResponse> getEmployerInterviews(Long employerId) {

        List<Interview> interviews =
                interviewRepository
                        .findByApplicationJobEmployerIdOrderByInterviewDateAscInterviewTimeAsc(
                                employerId
                        );

        return interviews.stream()
                .map(this::convertToResponse)
                .toList();
    }

    // Create interview
    public InterviewResponse createInterview(
            ScheduleInterviewRequest request,
            Long employerId) {

    	Application application =
                applicationRepository
                        .findById(request.getApplicationId())
                        .orElseThrow(() ->
                                new RuntimeException("Application not found"));

        // Make sure this application belongs to the logged-in employer
        if (!application.getJob().getEmployer().getId().equals(employerId)) {
            throw new RuntimeException(
                    "You are not allowed to schedule an interview for this application"
            );
        }

        Interview interview = new Interview();

        interview.setApplication(application);
        interview.setInterviewDate(request.getInterviewDate());
        interview.setInterviewTime(request.getInterviewTime());
        interview.setMeetingLink(request.getMeetingLink());
        interview.setNotes(request.getNotes());
        interview.setStatus(InterviewStatus.SCHEDULED);

        Interview savedInterview =
                interviewRepository.save(interview);
        
        notificationService.create(
                savedInterview.getApplication().getStudent().getEmail(),
                "STUDENT",
                "INTERVIEW",
                "Interview Scheduled",
                "Your interview for "
                        + savedInterview.getApplication().getJob().getTitle()
                        + " has been scheduled on "
                        + savedInterview.getInterviewDate()
                        + " at "
                        + savedInterview.getInterviewTime()
                        + "."
                        + (savedInterview.getMeetingLink() != null
                                && !savedInterview.getMeetingLink().isBlank()
                                ? " Meeting link: " + savedInterview.getMeetingLink()
                                : ""),
                savedInterview.getId(),
                "INTERVIEW"
        );

        return convertToResponse(savedInterview);
    }

    // Convert Interview entity to response
    private InterviewResponse convertToResponse(
            Interview interview) {

        InterviewResponse response =
                new InterviewResponse();

        response.setId(interview.getId());

        response.setInterviewDate(
                interview.getInterviewDate()
        );

        response.setInterviewTime(
                interview.getInterviewTime()
        );

        response.setMeetingLink(
                interview.getMeetingLink()
        );

        response.setNotes(
                interview.getNotes()
        );

        if (interview.getStatus() != null) {

            response.setStatus(
                    interview.getStatus().name()
            );
        }

        Application application =
                interview.getApplication();

        if (application != null) {

            response.setApplicationId(
                    application.getId()
            );

            // Real candidate information
            if (application.getStudent() != null) {

                response.setCandidateName(
                        application.getStudent().getName()
                );

                response.setEmail(
                        application.getStudent().getEmail()
                );
            }

            // Real job information
            if (application.getJob() != null) {

                response.setJobTitle(
                        application.getJob().getTitle()
                );
            }
        }

        return response;
    }
    
    public List<InterviewResponse> getStudentUpcomingInterviews(Long studentId) {

        List<Interview> interviews =
                interviewRepository
                        .findByApplicationStudentIdAndInterviewDateGreaterThanEqualOrderByInterviewDateAscInterviewTimeAsc(
                                studentId,
                                java.time.LocalDate.now()
                        );

        return interviews.stream()
                .filter(interview ->
                        interview.getStatus() != InterviewStatus.CANCELLED &&
                        interview.getStatus() != InterviewStatus.COMPLETED
                )
                .map(this::convertToResponse)
                .toList();
    }
    
 // Reschedule an existing interview
    public InterviewResponse rescheduleInterview(
            Long interviewId,
            ScheduleInterviewRequest request,
            Long employerId) {

        Interview interview = interviewRepository.findById(interviewId)
                .orElseThrow(() ->
                        new RuntimeException("Interview not found"));

        // Verify that this interview belongs to the logged-in employer
        if (!interview.getApplication().getJob()
                .getEmployer().getId().equals(employerId)) {
            throw new RuntimeException(
                    "You are not allowed to update this interview");
        }

        if (interview.getStatus() == InterviewStatus.CANCELLED
                || interview.getStatus() == InterviewStatus.COMPLETED) {
            throw new RuntimeException(
                    "Cancelled or completed interviews cannot be rescheduled");
        }

        boolean changed =
                !java.util.Objects.equals(
                        interview.getInterviewDate(),
                        request.getInterviewDate())
                || !java.util.Objects.equals(
                        interview.getInterviewTime(),
                        request.getInterviewTime())
                || !java.util.Objects.equals(
                        interview.getMeetingLink(),
                        request.getMeetingLink())
                || !java.util.Objects.equals(
                        interview.getNotes(),
                        request.getNotes());

        if (!changed) {
            return convertToResponse(interview);
        }

        interview.setInterviewDate(request.getInterviewDate());
        interview.setInterviewTime(request.getInterviewTime());
        interview.setMeetingLink(request.getMeetingLink());
        interview.setNotes(request.getNotes());

        Interview updated = interviewRepository.save(interview);

        String message = "Your interview for "
                + updated.getApplication().getJob().getTitle()
                + " has been rescheduled. New date: "
                + updated.getInterviewDate()
                + ", time: " + updated.getInterviewTime() + ".";

        if (updated.getMeetingLink() != null
                && !updated.getMeetingLink().isBlank()) {
            message += " Meeting link: " + updated.getMeetingLink();
        }

        notificationService.create(
                updated.getApplication().getStudent().getEmail(),
                "STUDENT",
                "INTERVIEW",
                "Interview Rescheduled",
                message,
                updated.getId(),
                "INTERVIEW"
        );

        return convertToResponse(updated);
    }


    // Cancel an existing interview
    public InterviewResponse cancelInterview(
            Long interviewId,
            Long employerId) {

        Interview interview = interviewRepository.findById(interviewId)
                .orElseThrow(() ->
                        new RuntimeException("Interview not found"));

        // Verify that this interview belongs to the logged-in employer
        if (!interview.getApplication().getJob()
                .getEmployer().getId().equals(employerId)) {
            throw new RuntimeException(
                    "You are not allowed to cancel this interview");
        }

        if (interview.getStatus() == InterviewStatus.CANCELLED) {
            return convertToResponse(interview);
        }

        if (interview.getStatus() == InterviewStatus.COMPLETED) {
            throw new RuntimeException(
                    "A completed interview cannot be cancelled");
        }

        interview.setStatus(InterviewStatus.CANCELLED);

        Interview updated = interviewRepository.save(interview);

        notificationService.create(
                updated.getApplication().getStudent().getEmail(),
                "STUDENT",
                "INTERVIEW",
                "Interview Cancelled",
                "Your interview for "
                        + updated.getApplication().getJob().getTitle()
                        + " scheduled on "
                        + updated.getInterviewDate()
                        + " at "
                        + updated.getInterviewTime()
                        + " has been cancelled by the employer.",
                updated.getId(),
                "INTERVIEW"
        );

        return convertToResponse(updated);
    }
    
    public List<InterviewResponse> getAllStudentInterviews(Long studentId) {

        List<Interview> interviews =
                interviewRepository
                        .findByApplicationStudentIdOrderByInterviewDateAscInterviewTimeAsc(
                                studentId
                        );

        return interviews.stream()
                .map(this::convertToResponse)
                .toList();
    }
}