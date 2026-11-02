
package com.careertrack.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.careertrack.dto.EmployerDashboardResponse;
import com.careertrack.entity.Application;
import com.careertrack.entity.ApplicationStatus;
import com.careertrack.entity.CompanyMember;
import com.careertrack.entity.CompanyMemberStatus;
import com.careertrack.entity.Job;
import com.careertrack.entity.User;
import com.careertrack.repository.ApplicationRepository;
import com.careertrack.repository.CompanyMemberRepository;
import com.careertrack.repository.JobRepository;
import com.careertrack.repository.UserRepository;

@Service
public class EmployerDashboardService {

    private final UserRepository userRepository;
    private final JobRepository jobRepository;
    private final ApplicationRepository applicationRepository;
    private final CompanyMemberRepository companyMemberRepository;

    public EmployerDashboardService(
            UserRepository userRepository,
            JobRepository jobRepository,
            ApplicationRepository applicationRepository,
            CompanyMemberRepository companyMemberRepository) {

        this.userRepository = userRepository;
        this.jobRepository = jobRepository;
        this.applicationRepository = applicationRepository;
        this.companyMemberRepository = companyMemberRepository;
    }

    // =====================================================
    // GET EMPLOYER DASHBOARD
    // =====================================================

    public EmployerDashboardResponse getDashboard(String email) {

        // -------------------------------------------------
        // 1. FIND LOGGED-IN EMPLOYER
        // -------------------------------------------------

        User employer = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("Employer not found"));

        // -------------------------------------------------
        // 2. CREATE RESPONSE
        // -------------------------------------------------

        EmployerDashboardResponse response =
                new EmployerDashboardResponse();

        // -------------------------------------------------
        // 3. FIND APPROVED COMPANY MEMBERSHIP
        // -------------------------------------------------

        Optional<CompanyMember> memberOpt =
                companyMemberRepository.findByUserAndStatus(
                        employer,
                        CompanyMemberStatus.APPROVED
                );

        // -------------------------------------------------
        // 4. NEW EMPLOYER / NO APPROVED COMPANY
        // -------------------------------------------------

        if (memberOpt.isEmpty()) {

            response.setHasCompany(false);

            response.setTotalJobs(0);
            response.setActiveJobs(0);
            response.setTotalApplications(0);
            response.setShortListed(0);

            response.setActivejobsList(List.of());
            response.setRecentApplications(List.of());

            return response;
        }

        // -------------------------------------------------
        // 5. EMPLOYER HAS A COMPANY
        // -------------------------------------------------

        CompanyMember currentMember = memberOpt.get();

        response.setHasCompany(true);

        // -------------------------------------------------
        // 6. GET COMPANY
        // -------------------------------------------------

        var company = currentMember.getCompany();

        // -------------------------------------------------
        // 7. GET ALL APPROVED MEMBERS OF COMPANY
        // -------------------------------------------------

        List<CompanyMember> companyMembers =
                companyMemberRepository.findByCompanyAndStatus(
                        company,
                        CompanyMemberStatus.APPROVED
                );

        // -------------------------------------------------
        // 8. GET ALL EMPLOYERS OF COMPANY
        // -------------------------------------------------

        List<User> companyEmployers =
                companyMembers.stream()
                        .map(CompanyMember::getUser)
                        .toList();

        // -------------------------------------------------
        // 9. GET ALL COMPANY JOBS
        // -------------------------------------------------

        List<Job> jobs =
                jobRepository.findByEmployerIn(
                        companyEmployers
                );

        // -------------------------------------------------
        // 10. GET ACTIVE JOBS
        // -------------------------------------------------

        List<Job> activeJobs =
                jobs.stream()
                        .filter(Job::isActive)
                        .toList();

        // -------------------------------------------------
        // 11. GET ALL COMPANY APPLICATIONS
        // -------------------------------------------------

        List<Application> applications =
                applicationRepository
                        .findByJobEmployerInOrderByAppliedAtDesc(
                                companyEmployers
                        );

        // -------------------------------------------------
        // 12. COUNT SHORTLISTED APPLICATIONS
        // -------------------------------------------------

        long shortListed =
                applications.stream()
                        .filter(app ->
                                app.getStatus()
                                        == ApplicationStatus.SHORTLISTED
                        )
                        .count();

        // -------------------------------------------------
        // 13. COMPANY-WIDE STATISTICS
        // -------------------------------------------------

        response.setTotalJobs(jobs.size());

        response.setActiveJobs(activeJobs.size());

        response.setTotalApplications(
                applications.size()
        );

        response.setShortListed(shortListed);

        // -------------------------------------------------
        // 14. COMPANY-WIDE ACTIVE JOBS
        // -------------------------------------------------

        response.setActivejobsList(
                activeJobs.stream()
                        .limit(5)
                        .toList()
        );

        // -------------------------------------------------
        // 15. COMPANY-WIDE RECENT APPLICATIONS
        // -------------------------------------------------

        response.setRecentApplications(
                applications.stream()
                        .limit(5)
                        .toList()
        );

        return response;
    }
}
