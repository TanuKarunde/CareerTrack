package com.careertrack.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.careertrack.entity.Interview;
import com.careertrack.entity.InterviewStatus;

public interface InterviewRepository extends JpaRepository<Interview, Long> {
	

@Lock(jakarta.persistence.LockModeType.PESSIMISTIC_WRITE)
@Query("""
    SELECT i FROM Interview i
    WHERE i.status = :status
      AND i.interviewDate >= :today
    ORDER BY i.interviewDate ASC, i.interviewTime ASC
    """)
List<Interview> findScheduledInterviewsForReminder(
        @Param("status") InterviewStatus status,
        @Param("today") LocalDate today
);


    List<Interview> findAllByOrderByInterviewDateAscInterviewTimeAsc();

    List<Interview> findByApplicationJobEmployerIdOrderByInterviewDateAscInterviewTimeAsc(
            Long employerId
    );
    
    List<Interview> findByApplicationStudentIdAndInterviewDateGreaterThanEqualOrderByInterviewDateAscInterviewTimeAsc(
            Long studentId,
            LocalDate date
    );
    
    List<Interview> findByStatusAndInterviewDateGreaterThanEqualOrderByInterviewDateAscInterviewTimeAsc(
            InterviewStatus status,
            LocalDate interviewDate
    );
    
    List<Interview> findByApplicationStudentIdOrderByInterviewDateAscInterviewTimeAsc(
            Long studentId
    );
}