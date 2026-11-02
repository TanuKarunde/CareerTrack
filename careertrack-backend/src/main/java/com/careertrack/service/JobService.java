package com.careertrack.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.careertrack.dto.JobRequest;
import com.careertrack.dto.JobResponce;
import com.careertrack.entity.CompanyMember;
import com.careertrack.entity.CompanyMemberStatus;
import com.careertrack.entity.Job;
import com.careertrack.entity.User;
import com.careertrack.repository.CompanyMemberRepository;
import com.careertrack.repository.JobRepository;

@Service
public class JobService {

    private final JobRepository jobRepository;
    private final CompanyMemberRepository companyMemberRepository;

    public JobService(
            JobRepository jobRepository,
            CompanyMemberRepository companyMemberRepository) {

        this.jobRepository = jobRepository;
        this.companyMemberRepository = companyMemberRepository;
    }

    // =========================================================
    // Create Job
    // =========================================================

    public JobResponce createJob(JobRequest request, User employer) {

        Job job = new Job();

        job.setTitle(request.getTitle());
        job.setCompany(request.getCompany());
        job.setDescription(request.getDescription());
        job.setLocation(request.getLocation());
        job.setJobType(request.getJobtype());
        job.setExperienceLevel(request.getExperienceLevel());
        job.setSkills(request.getSkills());
        job.setSalaryMin(request.getSalaryMin());
        job.setSalaryMax(request.getSalaryMax());

        // Keep the actual creator
        job.setEmployer(employer);

        job.setActive(true);

        Job savedJob = jobRepository.save(job);

        return new JobResponce(
                savedJob,
                getCompanyLogoUrl(savedJob)
        );
    }

    // =========================================================
    // Get All Active Jobs - Student
    // =========================================================

    public List<JobResponce> getAllJobs() {

    	return jobRepository.findByActiveTrue()
    	        .stream()
    	        .map(job -> new JobResponce(
    	                job,
    	                getCompanyLogoUrl(job)
    	        ))
    	        .toList();
    }

    // =========================================================
    // Get Job By ID
    // =========================================================

    public JobResponce getJobById(Long id) {

        Job job = jobRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Job not Found"));

        return new JobResponce(
                job,
                getCompanyLogoUrl(job)
        );
    }

    // =========================================================
    // Search Jobs
    // =========================================================

    public List<JobResponce> searchJobs(String keyword) {

    	return jobRepository
    	        .findByTitleContainingIgnoreCaseAndActiveTrue(keyword)
    	        .stream()
    	        .map(job -> new JobResponce(
    	                job,
    	                getCompanyLogoUrl(job)
    	        ))
    	        .toList();
    }

    // =========================================================
    // Get Company Jobs
    // =========================================================
    // Every approved employer belonging to the same company
    // can see all jobs created by company members.
    // =========================================================

    public List<JobResponce> getEmployerJobs(User employer) {

        System.out.println("======================================");
        System.out.println("GET EMPLOYER JOBS");
        System.out.println("Logged in employer: " + employer.getName());
        System.out.println("Logged in employer ID: " + employer.getId());
        System.out.println("======================================");

        // Find logged-in employer's approved membership
        CompanyMember currentMember =
                companyMemberRepository
                        .findByUserAndStatus(
                                employer,
                                CompanyMemberStatus.APPROVED
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "You are not an approved member of any company."
                                )
                        );

        System.out.println(
                "Company: " + currentMember.getCompany().getName()
        );

        System.out.println(
                "Company ID: " + currentMember.getCompany().getId()
        );

        // Find all approved members of the same company
        List<CompanyMember> approvedMembers =
                companyMemberRepository.findByCompanyAndStatus(
                        currentMember.getCompany(),
                        CompanyMemberStatus.APPROVED
                );

        System.out.println("APPROVED COMPANY MEMBERS:");

        approvedMembers.forEach(member -> {

            System.out.println(
                    "User ID: " +
                    member.getUser().getId() +
                    " | Name: " +
                    member.getUser().getName() +
                    " | Email: " +
                    member.getUser().getEmail() +
                    " | Role: " +
                    member.getRole() +
                    " | Status: " +
                    member.getStatus()
            );

        });

        // Convert members to users
        List<User> companyEmployers =
                approvedMembers
                        .stream()
                        .map(CompanyMember::getUser)
                        .toList();

        // Get jobs created by all approved company members
        List<Job> companyJobs =
                jobRepository.findByEmployerIn(companyEmployers);

        System.out.println("COMPANY JOBS:");

        companyJobs.forEach(job -> {

            System.out.println(
                    "Job ID: " +
                    job.getId() +
                    " | Title: " +
                    job.getTitle() +
                    " | Created By: " +
                    job.getEmployer().getName() +
                    " | Employer ID: " +
                    job.getEmployer().getId()
            );

        });

        System.out.println("TOTAL COMPANY JOBS: " + companyJobs.size());
        System.out.println("======================================");

        return companyJobs
                .stream()
                .map(job -> new JobResponce(
                        job,
                        getCompanyLogoUrl(job)
                ))
                .toList();
    }

    // =========================================================
    // Update Job
    // =========================================================

    public JobResponce updateJob(
            Long id,
            JobRequest request,
            User employer) {

        Job job = jobRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Job not found"));

        // Only the person who created the job can edit it
        if (!job.getEmployer().getId().equals(employer.getId())) {

            throw new RuntimeException(
                    "You are not allowed to update this job"
            );
        }

        job.setTitle(request.getTitle());
        job.setCompany(request.getCompany());
        job.setDescription(request.getDescription());
        job.setLocation(request.getLocation());
        job.setJobType(request.getJobtype());
        job.setExperienceLevel(request.getExperienceLevel());
        job.setSkills(request.getSkills());
        job.setSalaryMin(request.getSalaryMin());
        job.setSalaryMax(request.getSalaryMax());

        Job updatedJob = jobRepository.save(job);

        return new JobResponce(
                updatedJob,
                getCompanyLogoUrl(updatedJob)
        );
    }

    // =========================================================
    // Update Job Status
    // =========================================================

    public JobResponce updateJobStatus(
            Long id,
            boolean active,
            User employer) {

        Job job = jobRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Job not found"));

        // Only the person who created the job can modify status
        if (!job.getEmployer().getId().equals(employer.getId())) {

            throw new RuntimeException(
                    "You are not allowed to modify this job"
            );
        }

        job.setActive(active);

        Job updatedJob = jobRepository.save(job);

        return new JobResponce(
                updatedJob,
                getCompanyLogoUrl(updatedJob)
        );
    }
    
  
 // =========================================================
 // Get Company Logo URL for Job
 // =========================================================

 private String getCompanyLogoUrl(Job job) {

     User employer = job.getEmployer();

     CompanyMember companyMember =
             companyMemberRepository
                     .findByUserAndStatus(
                             employer,
                             CompanyMemberStatus.APPROVED
                     )
                     .orElse(null);

     if (companyMember == null ||
             companyMember.getCompany() == null) {

         return null;
     }

     Long companyId =
             companyMember.getCompany().getId();

     return "/api/company/" + companyId + "/logo";
 }

}