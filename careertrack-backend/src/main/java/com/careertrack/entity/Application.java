package com.careertrack.entity;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;

@Entity
@Table(name = "applications",
uniqueConstraints = {
		@UniqueConstraint(columnNames = {"student_id", "job_id"})
})

public class Application {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long id;
	
	@ManyToOne
	@JoinColumn(name = "job_id", nullable = false)
	@JsonIgnore
	private Job job;
	
	@ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
	@JsonIgnore
    private User student;
	
	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private ApplicationStatus status = ApplicationStatus.APPLIED;
	
	@Column(nullable = false)
	private LocalDateTime appliedAt;
	
	private LocalDateTime updatedAt;
	
	@Lob
	@Column(name = "resume", columnDefinition = "LONGBLOB")
	private byte[] resume;

	@Column(name = "resume_name")
	private String resumeName;

	@Column(name = "resume_type")
	private String resumeType;
	
	@PrePersist
	protected void onCreate() {
		appliedAt = LocalDateTime.now();
		updatedAt = LocalDateTime.now();
	}
	
	@PreUpdate
	protected void onUpdate() {
		updatedAt = LocalDateTime.now();
	}
	
	public Application() {
		
	}

	public long getId() {
		return id;
	}

	public Job getJob() {
		return job;
	}

	public void setJob(Job job) {
		this.job = job;
	}

	public User getStudent() {
		return student;
	}

	public void setStudent(User student) {
		this.student = student;
	}

	public ApplicationStatus getStatus() {
		return status;
	}

	public void setStatus(ApplicationStatus status) {
		this.status = status;
	}

	public LocalDateTime getAppliedAt() {
		return appliedAt;
	}

	public LocalDateTime getUpdatedAt() {
		return updatedAt;
	}
	
	public byte[] getResume() {
	    return resume;
	}

	public void setResume(byte[] resume) {
	    this.resume = resume;
	}

	public String getResumeName() {
	    return resumeName;
	}

	public void setResumeName(String resumeName) {
	    this.resumeName = resumeName;
	}

	public String getResumeType() {
	    return resumeType;
	}

	public void setResumeType(String resumeType) {
	    this.resumeType = resumeType;
	}
		
}
