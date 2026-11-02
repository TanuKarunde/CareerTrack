
package com.careertrack.service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.careertrack.dto.ExperienceRequest;
import com.careertrack.dto.ExperienceResponse;
import com.careertrack.dto.StudentCertificationRequest;
import com.careertrack.dto.StudentCertificationResponse;
import com.careertrack.dto.StudentProfileRequest;
import com.careertrack.dto.StudentProfileResponse;
import com.careertrack.dto.StudentProjectRequest;
import com.careertrack.dto.StudentProjectResponse;
import com.careertrack.entity.Experience;
import com.careertrack.entity.StudentCertification;
import com.careertrack.entity.StudentProfile;
import com.careertrack.entity.StudentProject;
import com.careertrack.entity.User;
import com.careertrack.repository.StudentCertificationRepository;
import com.careertrack.repository.StudentProfileRepository;
import com.careertrack.repository.StudentProjectRepository;
import com.careertrack.repository.UserRepository;

@Service
public class StudentProfileService {

    private final StudentProfileRepository studentProfileRepository;
    private final UserRepository userRepository;
    private final StudentProjectRepository studentProjectRepository;
    private final StudentCertificationRepository studentCertificationRepository;

    public StudentProfileService(
            StudentProfileRepository studentProfileRepository,
            UserRepository userRepository,
            StudentProjectRepository studentProjectRepository,
            StudentCertificationRepository studentCertificationRepository) {

        this.studentProfileRepository = studentProfileRepository;
        this.userRepository = userRepository;
        this.studentProjectRepository = studentProjectRepository;
        this.studentCertificationRepository = studentCertificationRepository;
    }

 // ============================================================
 // GET PROFILE
 // ============================================================

 @Transactional(readOnly = true)
 public StudentProfileResponse getProfile(String email) {

     User user = userRepository.findByEmail(email)
             .orElseThrow(() ->
                     new RuntimeException("User not found"));

     StudentProfile profile = studentProfileRepository
             .findByUserId(user.getId())
             .orElse(null);

     if (profile == null) {

         StudentProfileResponse response =
                 new StudentProfileResponse();

         response.setUserId(user.getId());
         response.setName(user.getName());
         response.setEmail(user.getEmail());

         response.setProjects(new ArrayList<>());
         response.setCertifications(new ArrayList<>());

         response.setHasResume(false);
         response.setHasProfileImage(false);

         return response;
     }

     return convertToResponse(profile);
 }

    // ============================================================
    // UPDATE PROFILE
    // ============================================================

//============================================================
//UPDATE PROFILE
//============================================================

@Transactional
public StudentProfileResponse updateProfile(
      String email,
      StudentProfileRequest request) {

  User user = userRepository.findByEmail(email)
          .orElseThrow(() ->
                  new RuntimeException("User not found"));

  StudentProfile profile = studentProfileRepository
          .findByUserId(user.getId())
          .orElseGet(() -> {
              StudentProfile newProfile = new StudentProfile();
              newProfile.setUser(user);
              return newProfile;
          });

  // ========================================================
  // PROFILE INFORMATION
  // ========================================================


  // ========================================================
  // PROFILE INFORMATION
  // ========================================================

  String phone = request.getPhone();

  // Save phone number in StudentProfile
  profile.setPhone(phone);

  // Also save phone number in User for Admin User Management
  user.setPhone(phone);

  // Keep user location synchronized with the profile
  user.setLocation(request.getLocation());

  // Save other profile information
  profile.setDateOfBirth(request.getDateOfBirth());
  profile.setGender(request.getGender());
  profile.setLocation(request.getLocation());
  profile.setBio(request.getBio());

  // Save updated User information
  userRepository.save(user);


  // ========================================================
  // EDUCATION
  // ========================================================

  profile.setCollege(request.getCollege());
  profile.setDegree(request.getDegree());
  profile.setBranch(request.getBranch());
  profile.setGraduationYear(request.getGraduationYear());
  profile.setCgpa(request.getCgpa());

  // ========================================================
  // SKILLS
  // ========================================================

  profile.setSkills(request.getSkills());

  // ========================================================
  // SOCIAL & PORTFOLIO
  // ========================================================

  profile.setGithubUrl(request.getGithubUrl());
  profile.setLinkedinUrl(request.getLinkedinUrl());
  profile.setPortfolioUrl(request.getPortfolioUrl());

  // ========================================================
  // CAREER PREFERENCES
  // ========================================================

  profile.setPreferredJobRole(request.getPreferredJobRole());
  profile.setPreferredLocation(request.getPreferredLocation());


  // ========================================================
  // SAVE PROFILE FIRST
  // ========================================================

  profile = studentProfileRepository.save(profile);


  // ========================================================
  // UPDATE EXPERIENCES
  // ========================================================

  profile.getExperiences().clear();

  if (request.getExperiences() != null) {
      for (ExperienceRequest experienceRequest : request.getExperiences()) {

          if (experienceRequest.getJobTitle() == null
                  || experienceRequest.getJobTitle().trim().isEmpty()) {
              continue;
          }

          Experience experience = new Experience();

          experience.setJobTitle(experienceRequest.getJobTitle().trim());
          experience.setCompanyName(experienceRequest.getCompanyName());
          experience.setEmploymentType(experienceRequest.getEmploymentType());
          experience.setLocation(experienceRequest.getLocation());
          experience.setStartDate(experienceRequest.getStartDate());
          experience.setCurrentlyWorking(
                  experienceRequest.isCurrentlyWorking());
          experience.setEndDate(
                  experienceRequest.isCurrentlyWorking()
                          ? null
                          : experienceRequest.getEndDate());
          experience.setDescription(experienceRequest.getDescription());

          experience.setStudentProfile(profile);
          profile.getExperiences().add(experience);
      }
  }

  // Do not clear and add the experiences a second time.



  // ========================================================
  // DELETE OLD PROJECTS
  // ========================================================

  List<StudentProject> oldProjects =
          studentProjectRepository
                  .findByStudentProfileId(profile.getId());

  if (!oldProjects.isEmpty()) {
      studentProjectRepository.deleteAll(oldProjects);
  }

  // ========================================================
  // SAVE NEW PROJECTS
  // ========================================================

  if (request.getProjects() != null) {

      for (StudentProjectRequest projectRequest
              : request.getProjects()) {

          StudentProject project = new StudentProject();

          project.setStudentProfile(profile);
          project.setProjectName(
                  projectRequest.getProjectName());
          project.setDescription(
                  projectRequest.getDescription());
          project.setTechnologies(
                  projectRequest.getTechnologies());
          project.setProjectUrl(
                  projectRequest.getProjectUrl());
          project.setGithubUrl(
                  projectRequest.getGithubUrl());

          studentProjectRepository.save(project);
      }
  }

  // ========================================================
  // DELETE OLD CERTIFICATIONS
  // ========================================================

  List<StudentCertification> oldCertifications =
          studentCertificationRepository
                  .findByStudentProfileId(profile.getId());

  if (!oldCertifications.isEmpty()) {
      studentCertificationRepository.deleteAll(oldCertifications);
  }

  // ========================================================
  // SAVE NEW CERTIFICATIONS
  // ========================================================

  if (request.getCertifications() != null) {

      for (StudentCertificationRequest certificationRequest
              : request.getCertifications()) {

          StudentCertification certification =
                  new StudentCertification();

          certification.setStudentProfile(profile);

          certification.setCertificationName(
                  certificationRequest.getCertificationName());

          certification.setIssuingOrganization(
                  certificationRequest.getIssuingOrganization());

          certification.setIssueDate(
                  certificationRequest.getIssueDate());

          certification.setCredentialId(
                  certificationRequest.getCredentialId());

          certification.setCredentialUrl(
                  certificationRequest.getCredentialUrl());

          studentCertificationRepository.save(certification);
      }
  }

  // ========================================================
  // RETURN UPDATED PROFILE
  // ========================================================

  return convertToResponse(profile);
}

    // ============================================================
    // CONVERT ENTITY → RESPONSE
    // ============================================================

    @Transactional(readOnly = true)
    public StudentProfileResponse convertToResponse(
            StudentProfile profile) {

        StudentProfileResponse response =
                new StudentProfileResponse();

        // ========================================================
        // USER INFORMATION
        // ========================================================

        if (profile.getUser() != null) {

            response.setUserId(profile.getUser().getId());
            response.setName(profile.getUser().getName());
            response.setEmail(profile.getUser().getEmail());
        }

        // ========================================================
        // PROFILE INFORMATION
        // ========================================================

        response.setId(profile.getId());
        response.setPhone(profile.getPhone());
        response.setDateOfBirth(profile.getDateOfBirth());
        response.setGender(profile.getGender());
        response.setLocation(profile.getLocation());
        response.setBio(profile.getBio());

        // ========================================================
        // EDUCATION
        // ========================================================

        response.setCollege(profile.getCollege());
        response.setDegree(profile.getDegree());
        response.setBranch(profile.getBranch());
        response.setGraduationYear(profile.getGraduationYear());
        response.setCgpa(profile.getCgpa());

        // ========================================================
        // SKILLS
        // ========================================================

        response.setSkills(profile.getSkills());

        // ========================================================
        // SOCIAL & PORTFOLIO
        // ========================================================

        response.setGithubUrl(profile.getGithubUrl());
        response.setLinkedinUrl(profile.getLinkedinUrl());
        response.setPortfolioUrl(profile.getPortfolioUrl());
        
     // ========================================================
     // RESUME
     // ========================================================

     response.setHasResume(profile.getResume() != null && profile.getResume().length > 0);
     response.setResumeName(profile.getResumeName());
     response.setResumeType(profile.getResumeType());

        // ========================================================
        // CAREER PREFERENCES
        // ========================================================

        response.setPreferredJobRole(
                profile.getPreferredJobRole());

        response.setPreferredLocation(
                profile.getPreferredLocation());

        // ========================================================
        // PROFILE IMAGE
        // ========================================================

        response.setHasProfileImage(
                profile.getProfileImage() != null
                        && profile.getProfileImage().length > 0);

        // ========================================================
        // PROJECTS
        // ========================================================

        List<StudentProjectResponse> projectResponses =
                new ArrayList<>();

        List<StudentProject> projects =
                studentProjectRepository
                        .findByStudentProfileId(profile.getId());

        for (StudentProject project : projects) {

            StudentProjectResponse projectResponse =
                    new StudentProjectResponse();

            projectResponse.setId(project.getId());
            projectResponse.setProjectName(
                    project.getProjectName());

            projectResponse.setDescription(
                    project.getDescription());

            projectResponse.setTechnologies(
                    project.getTechnologies());

            projectResponse.setProjectUrl(
                    project.getProjectUrl());

            projectResponse.setGithubUrl(
                    project.getGithubUrl());

            projectResponses.add(projectResponse);
        }

        response.setProjects(projectResponses);

        // ========================================================
        // CERTIFICATIONS
        // ========================================================

        List<StudentCertificationResponse>
                certificationResponses = new ArrayList<>();

        List<StudentCertification> certifications =
                studentCertificationRepository
                        .findByStudentProfileId(profile.getId());

        for (StudentCertification certification
                : certifications) {

            StudentCertificationResponse certificationResponse =
                    new StudentCertificationResponse();

            certificationResponse.setId(
                    certification.getId());

            certificationResponse.setCertificationName(
                    certification.getCertificationName());

            certificationResponse.setIssuingOrganization(
                    certification.getIssuingOrganization());

            certificationResponse.setIssueDate(
                    certification.getIssueDate());

            certificationResponse.setCredentialId(
                    certification.getCredentialId());

            certificationResponse.setCredentialUrl(
                    certification.getCredentialUrl());

            certificationResponses.add(certificationResponse);
        }

        response.setCertifications(certificationResponses);
        

        // ========================================================
        // EXPERIENCES
        // ========================================================

        List<ExperienceResponse> experienceResponses = new ArrayList<>();

        if (profile.getExperiences() != null) {
            for (Experience experience : profile.getExperiences()) {

                ExperienceResponse experienceResponse =
                        new ExperienceResponse();

                experienceResponse.setId(experience.getId());
                experienceResponse.setJobTitle(experience.getJobTitle());
                experienceResponse.setCompanyName(experience.getCompanyName());
                experienceResponse.setEmploymentType(
                        experience.getEmploymentType());
                experienceResponse.setLocation(experience.getLocation());
                experienceResponse.setStartDate(experience.getStartDate());
                experienceResponse.setEndDate(experience.getEndDate());
                experienceResponse.setCurrentlyWorking(
                        experience.isCurrentlyWorking());
                experienceResponse.setDescription(experience.getDescription());

                experienceResponses.add(experienceResponse);
            }
        }

        response.setExperiences(experienceResponses);


        return response;
    }
    
    /*
    ============================================================
    GET STUDENT PROFILE ENTITY
    ============================================================
    */

    public StudentProfile getStudentProfileEntity(
            String email) {

        User user =
                userRepository
                        .findByEmail(email)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "User not found"
                                )
                        );

        return studentProfileRepository
                .findByUserId(user.getId())
                .orElse(null);
    }


    /*
    ============================================================
    SAVE PROFILE IMAGE
    ============================================================
    */

    @Transactional
    public StudentProfileResponse saveProfileImage(
            String email,
            MultipartFile file)
            throws IOException {

        if (file == null ||
                file.isEmpty()) {

            throw new RuntimeException(
                    "Profile image is required"
            );
        }


        String contentType =
                file.getContentType();


        if (contentType == null ||
                !contentType.startsWith("image/")) {

            throw new RuntimeException(
                    "Only image files are allowed"
            );
        }


        if (file.getSize() >
                2 * 1024 * 1024) {

            throw new RuntimeException(
                    "Image size must be less than 2 MB"
            );
        }


        User user =
                userRepository
                        .findByEmail(email)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "User not found"
                                )
                        );


        StudentProfile profile =
                studentProfileRepository
                        .findByUserId(user.getId())
                        .orElseGet(() -> {

                            StudentProfile newProfile =
                                    new StudentProfile();

                            newProfile.setUser(user);

                            return newProfile;

                        });


        profile.setProfileImage(
                file.getBytes()
        );

        profile.setProfileImageType(
                contentType
        );


        StudentProfile saved =
                studentProfileRepository
                        .save(profile);


        return convertToResponse(saved);
    }
    
 // ============================================================
 // SAVE RESUME
 // ============================================================

 @Transactional
 public StudentProfileResponse saveResume(
         String email,
         MultipartFile file) throws IOException {

     if (file == null || file.isEmpty()) {
         throw new RuntimeException("Resume is required");
     }

     String contentType = file.getContentType();

     if (contentType == null ||
             !(contentType.equals("application/pdf")
                     || contentType.equals(
                             "application/vnd.openxmlformats-officedocument.wordprocessingml.document")
                     || contentType.equals(
                             "application/msword"))) {

         throw new RuntimeException(
                 "Only PDF, DOC, and DOCX files are allowed"
         );
     }

     // Maximum 5 MB
     if (file.getSize() > 5 * 1024 * 1024) {
         throw new RuntimeException(
                 "Resume size must be less than 5 MB"
         );
     }

     User user = userRepository
             .findByEmail(email)
             .orElseThrow(() ->
                     new RuntimeException("User not found")
             );

     StudentProfile profile = studentProfileRepository
             .findByUserId(user.getId())
             .orElseGet(() -> {

                 StudentProfile newProfile =
                         new StudentProfile();

                 newProfile.setUser(user);

                 return newProfile;
             });

     profile.setResume(file.getBytes());
     profile.setResumeName(file.getOriginalFilename());
     profile.setResumeType(contentType);

     StudentProfile saved =
             studentProfileRepository.save(profile);

     return convertToResponse(saved);
 }
 

//============================================================
//CHECK PROFILE COMPLETENESS FOR JOB APPLICATION
//============================================================

 @Transactional(readOnly = true)
 public void validateProfileForApplication(
         String email,
         boolean requireProfileResume) {

  User user = userRepository
          .findByEmail(email)
          .orElseThrow(() ->
                  new RuntimeException("User not found")
          );

  StudentProfile profile = studentProfileRepository
          .findByUserId(user.getId())
          .orElseThrow(() ->
                  new RuntimeException(
                          "Please complete your profile before applying"
                  )
          );

  // ========================================================
  // REQUIRED PROFILE FIELDS
  // ========================================================

  if (isBlank(profile.getPhone())) {
      throw new RuntimeException(
              "Please complete your profile: Phone number is required"
      );
  }

  if (isBlank(profile.getDateOfBirth())) {
      throw new RuntimeException(
              "Please complete your profile: Date of birth is required"
      );
  }

  if (isBlank(profile.getGender())) {
      throw new RuntimeException(
              "Please complete your profile: Gender is required"
      );
  }

  if (isBlank(profile.getLocation())) {
      throw new RuntimeException(
              "Please complete your profile: Location is required"
      );
  }

  if (isBlank(profile.getBio())) {
      throw new RuntimeException(
              "Please complete your profile: Bio is required"
      );
  }

  // ========================================================
  // SKILLS
  // ========================================================

  if (isBlank(profile.getSkills())) {
      throw new RuntimeException(
              "Please complete your profile: Skills are required"
      );
  }

  // ========================================================
  // EXPERIENCE
  // ========================================================
  // Experience is optional. Freshers can apply without it.
  // Do not reject applications when experiences is empty.


}



//============================================================
//CHECK BLANK
//============================================================

private boolean isBlank(String value) {

  return value == null ||
          value.trim().isEmpty();
}
 
 
}

