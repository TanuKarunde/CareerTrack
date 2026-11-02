package com.careertrack.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.careertrack.dto.ApplicationResponse;
import com.careertrack.dto.StudentdashboardResponse;
import com.careertrack.entity.Application;
import com.careertrack.entity.ApplicationStatus;
import com.careertrack.entity.CompanyMember;
import com.careertrack.entity.CompanyMemberStatus;
import com.careertrack.entity.Job;
import com.careertrack.entity.User;
import com.careertrack.repository.ApplicationRepository;
import com.careertrack.repository.CompanyMemberRepository;
import com.careertrack.repository.UserRepository;

@Service
public class Studentdashboardservice {

	private final UserRepository userRepository;
	private final ApplicationRepository applicationRepository;
	private final CompanyMemberRepository companyMemberRepository;
	
	public Studentdashboardservice(UserRepository userRepository, ApplicationRepository applicationRepository, CompanyMemberRepository companyMemberRepository) {

        this.userRepository = userRepository;
        this.applicationRepository = applicationRepository;
        this.companyMemberRepository = companyMemberRepository;
    }
	
	public StudentdashboardResponse getDashboard(String email) {
		
		User student = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("Student not found"));
		
		List<Application> applications = applicationRepository.findByStudentIdOrderByAppliedAtDesc(student.getId());
		
		long totalApplications = applications.size();
		
		long shortlisted = applications.stream().filter(app -> app.getStatus() == ApplicationStatus.SHORTLISTED).count();
		
		long interview = applications.stream().filter(app -> app.getStatus() == ApplicationStatus.INTERVIEW).count();
		
		long selected = applications.stream().filter(app -> app.getStatus() == ApplicationStatus.SELECTED).count();
		
		StudentdashboardResponse responce = new StudentdashboardResponse();
		
		
		responce.setTotalApplications(totalApplications);
		responce.setShortlisted(shortlisted);
		responce.setInterviews(interview);
		responce.setSelected(selected);
		
		List<ApplicationResponse> recentApplications = applications.stream()
				.limit(3)
				.map(application -> new ApplicationResponse(application, getCompanyUrl(application.getJob()))).toList();
		
		responce.setRecentApplications(recentApplications);
		
		responce.setUpcommingInterviews(List.of());
		
		responce.setRecommendedJobs(List.of());
		
		return responce;
	}
	
	private String getCompanyUrl(Job job) {

	    User employer = job.getEmployer();

	    if (employer == null) {
	        return null;
	    }

	    CompanyMember companyMember = companyMemberRepository
	            .findByUserAndStatus(
	                    employer,
	                    CompanyMemberStatus.APPROVED
	            )
	            .orElse(null);

	    if (companyMember == null || companyMember.getCompany() == null) {
	        return null;
	    }

	    Long companyId = companyMember.getCompany().getId();

	    return "/api/company/" + companyId + "/logo";
	}
}
