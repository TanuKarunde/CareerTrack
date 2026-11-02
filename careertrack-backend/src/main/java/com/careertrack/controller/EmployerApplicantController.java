package com.careertrack.controller;

import java.util.List;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.careertrack.dto.ApplicantResponse;
import com.careertrack.dto.ApplicationResponse;
import com.careertrack.entity.ApplicationStatus;
import com.careertrack.entity.StudentProfile;
import com.careertrack.entity.User;
import com.careertrack.repository.StudentProfileRepository;
import com.careertrack.repository.UserRepository;
import com.careertrack.service.EmployerApplicantService;

@RestController
@RequestMapping("/api/employer/applicants")
public class EmployerApplicantController {

	private final EmployerApplicantService applicantService;
	private final UserRepository userRepository;
	private final StudentProfileRepository studentProfileRepository;

	public EmployerApplicantController(EmployerApplicantService applicantService, UserRepository userRepository,
			StudentProfileRepository studentProfileRepository) {

		this.applicantService = applicantService;
		this.userRepository = userRepository;
		this.studentProfileRepository = studentProfileRepository;
	}

	// =====================================================
	// Get logged-in employer
	// =====================================================

	private User getLoggedInEmployer(Authentication authentication) {

		String email = authentication.getName();

		return userRepository.findByEmail(email)
				.orElseThrow(() -> new RuntimeException("Employer not found with email: " + email));
	}

	// =====================================================
	// Get single applicant
	// GET /api/employer/applicants/{id}
	// =====================================================

	@GetMapping("/{id}")
	@PreAuthorize("hasRole('EMPLOYER')")
	public ResponseEntity<ApplicantResponse> getApplicant(@PathVariable Long id, Authentication authentication) {

		User employer = getLoggedInEmployer(authentication);

		ApplicantResponse response = applicantService.getApplicants(id, employer);

		return ResponseEntity.ok(response);
	}

	// =====================================================
	// Update applicant status
	// PUT /api/employer/applicants/{id}/status
	// =====================================================

	@PutMapping("/{id}/status")
	@PreAuthorize("hasRole('EMPLOYER')")
	public ResponseEntity<ApplicantResponse> updateStatus(@PathVariable Long id, @RequestParam ApplicationStatus status,
			Authentication authentication) {

		User employer = getLoggedInEmployer(authentication);

		ApplicantResponse response = applicantService.updateStatus(id, status, employer);

		return ResponseEntity.ok(response);
	}

	// =====================================================
	// Get all applicants for logged-in employer
	// GET /api/employer/applicants/employer
	// =====================================================

	@GetMapping("/employer")
	@PreAuthorize("hasRole('EMPLOYER')")
	public ResponseEntity<List<ApplicantResponse>> getEmployerApplicants(Authentication authentication) {

		User employer = getLoggedInEmployer(authentication);

		List<ApplicantResponse> response = applicantService.getEmployerApplicants(employer);

		return ResponseEntity.ok(response);
	}

	// =====================================================
	// Get all applications of a particular student
	// GET /api/employer/applicants/students/{studentId}/applications
	// =====================================================

	@GetMapping("/students/{studentId}/applications")
	@PreAuthorize("hasRole('EMPLOYER')")
	public ResponseEntity<List<ApplicationResponse>> getStudentApplications(@PathVariable Long studentId,
			Authentication authentication) {

		User employer = getLoggedInEmployer(authentication);

		List<ApplicationResponse> response = applicantService.getStudentApplications(studentId, employer);

		return ResponseEntity.ok(response);
	}

	@GetMapping("/{applicationId}/resume")
	@PreAuthorize("hasRole('EMPLOYER')")
	public ResponseEntity<byte[]> viewResume(@PathVariable Long applicationId, Authentication authentication) {

		User employer = getLoggedInEmployer(authentication);

		return applicantService.viewApplicationResume(applicationId, employer);
	}

	@GetMapping("/{applicationId}/resume/download")
	@PreAuthorize("hasRole('EMPLOYER')")
	public ResponseEntity<byte[]> downloadResume(@PathVariable Long applicationId, Authentication authentication) {

		User employer = getLoggedInEmployer(authentication);

		return applicantService.downloadApplicationResume(applicationId, employer);
	}

	// =====================================================
	// VIEW STUDENT PROFILE RESUME
	// GET /api/employer/applicants/{applicationId}/profile-resume
	// =====================================================

	@GetMapping("/{applicationId}/profile-resume")
	@PreAuthorize("hasRole('EMPLOYER')")
	public ResponseEntity<byte[]> viewStudentProfileResume(@PathVariable Long applicationId,
			Authentication authentication) {

		User employer = getLoggedInEmployer(authentication);

		return applicantService.viewStudentProfileResume(applicationId, employer);
	}

	// =====================================================
	// DOWNLOAD STUDENT PROFILE RESUME
	// GET /api/employer/applicants/{applicationId}/profile-resume/download
	// =====================================================

	@GetMapping("/{applicationId}/profile-resume/download")
	@PreAuthorize("hasRole('EMPLOYER')")
	public ResponseEntity<byte[]> downloadStudentProfileResume(@PathVariable Long applicationId,
			Authentication authentication) {

		User employer = getLoggedInEmployer(authentication);

		return applicantService.downloadStudentProfileResume(applicationId, employer);
	}

	@GetMapping("/{studentId}/image")
	public ResponseEntity<byte[]> getApplicantProfileImage(@PathVariable Long studentId) {

		StudentProfile profile = studentProfileRepository.findByUserId(studentId)
				.orElseThrow(() -> new RuntimeException("Student profile not found"));

		byte[] image = profile.getProfileImage();

		if (image == null || image.length == 0) {
			return ResponseEntity.notFound().build();
		}

		String imageType = profile.getProfileImageType();

		return ResponseEntity.ok().contentType(MediaType.parseMediaType(imageType != null ? imageType : "image/jpeg"))
				.body(image);
	}
}