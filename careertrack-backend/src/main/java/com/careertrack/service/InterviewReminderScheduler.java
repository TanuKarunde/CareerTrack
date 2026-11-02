
package com.careertrack.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.careertrack.entity.Interview;
import com.careertrack.entity.InterviewStatus;
import com.careertrack.repository.InterviewRepository;

@Component
public class InterviewReminderScheduler {

    private final InterviewRepository interviewRepository;
    private final NotificationService notificationService;

    public InterviewReminderScheduler(
            InterviewRepository interviewRepository,
            NotificationService notificationService) {
        this.interviewRepository = interviewRepository;
        this.notificationService = notificationService;
    }

    // Run every minute.
    @Scheduled(fixedRate = 60000)
    @Transactional
    public void sendInterviewReminders() {

        LocalDateTime now = LocalDateTime.now();

        List<Interview> interviews =
                interviewRepository.findScheduledInterviewsForReminder(
                        InterviewStatus.SCHEDULED,
                        LocalDate.now()
                );

        for (Interview interview : interviews) {
            processInterview(interview, now);
        }
    }

    private void processInterview(
            Interview interview,
            LocalDateTime now) {

        if (interview.getInterviewDate() == null
                || interview.getInterviewTime() == null
                || interview.getApplication() == null
                || interview.getApplication().getStudent() == null
                || interview.getApplication().getJob() == null) {
            return;
        }

        if (interview.getStatus() != InterviewStatus.SCHEDULED) {
            return;
        }

        LocalDateTime interviewDateTime = LocalDateTime.of(
                interview.getInterviewDate(),
                interview.getInterviewTime()
        );

        // Never send reminders after the interview has started.
        if (!interviewDateTime.isAfter(now)) {
            return;
        }

        String studentEmail =
                interview.getApplication().getStudent().getEmail();

        String jobTitle =
                interview.getApplication().getJob().getTitle();

        // 24-hour reminder. If the backend was offline, catch up
        // while more than one hour remains before the interview.
        LocalDateTime twentyFourHourDeadline =
                interviewDateTime.minusHours(24);

        LocalDateTime oneHourDeadline =
                interviewDateTime.minusHours(1);

        if (!interview.isReminder24HoursSent()
                && !now.isBefore(twentyFourHourDeadline)
                && now.isBefore(oneHourDeadline)) {

            notificationService.create(
                    studentEmail,
                    "STUDENT",
                    "INTERVIEW",
                    "Interview Reminder: 24 Hours",
                    "Reminder: Your interview for " + jobTitle
                            + " is scheduled for "
                            + interview.getInterviewDate()
                            + " at " + interview.getInterviewTime()
                            + meetingLinkMessage(interview),
                    interview.getId(),
                    "INTERVIEW"
            );

            interview.setReminder24HoursSent(true);
            interviewRepository.save(interview);
        }

        // 1-hour reminder. Catch up if the backend was offline,
        // provided the interview has not started.
        if (!interview.isReminder1HourSent()
                && !now.isBefore(oneHourDeadline)
                && now.isBefore(interviewDateTime)) {

            notificationService.create(
                    studentEmail,
                    "STUDENT",
                    "INTERVIEW",
                    "Interview Reminder: 1 Hour",
                    "Your interview for " + jobTitle
                            + " is scheduled in about 1 hour, on "
                            + interview.getInterviewDate()
                            + " at " + interview.getInterviewTime()
                            + meetingLinkMessage(interview),
                    interview.getId(),
                    "INTERVIEW"
            );

            interview.setReminder1HourSent(true);
            interviewRepository.save(interview);
        }
    }

    private String meetingLinkMessage(Interview interview) {
        String link = interview.getMeetingLink();

        return link != null && !link.isBlank()
                ? ". Meeting link: " + link
                : ".";
    }
}
