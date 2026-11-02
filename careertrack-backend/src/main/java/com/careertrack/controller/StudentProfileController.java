package com.careertrack.controller;

import java.io.IOException;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.careertrack.dto.StudentProfileRequest;
import com.careertrack.dto.StudentProfileResponse;
import com.careertrack.entity.StudentProfile;
import com.careertrack.service.StudentProfileService;

@RestController
@RequestMapping("/api/student/profile")
@PreAuthorize("hasRole('STUDENT')")
@CrossOrigin(origins = "http://localhost:5173")
public class StudentProfileController {

    private final StudentProfileService studentProfileService;

    public StudentProfileController(
            StudentProfileService studentProfileService) {

        this.studentProfileService =
                studentProfileService;
    }

    // ============================================================
    // GET PROFILE
    // ============================================================

    @GetMapping
    public StudentProfileResponse getProfile(
            Authentication authentication) {

        String email = authentication.getName();

        return studentProfileService.getProfile(email);
    }

    // ============================================================
    // UPDATE PROFILE
    // ============================================================

    @PutMapping
    public StudentProfileResponse updateProfile(
            Authentication authentication,
            @RequestBody StudentProfileRequest request) {

        String email = authentication.getName();

        return studentProfileService.updateProfile(
                email,
                request
        );
    }

    // ============================================================
    // GET PROFILE IMAGE
    // ============================================================

    @GetMapping("/image")
    public ResponseEntity<byte[]> getProfileImage(
            Authentication authentication) {

        String email = authentication.getName();

        StudentProfile profile =
                studentProfileService
                        .getStudentProfileEntity(email);

        if (profile == null ||
                profile.getProfileImage() == null ||
                profile.getProfileImage().length == 0) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .build();
        }

        MediaType mediaType =
                MediaType.APPLICATION_OCTET_STREAM;

        if (profile.getProfileImageType() != null) {

            try {

                mediaType =
                        MediaType.parseMediaType(
                                profile.getProfileImageType()
                        );

            } catch (Exception ignored) {

                mediaType =
                        MediaType.APPLICATION_OCTET_STREAM;
            }
        }

        return ResponseEntity.ok()
                .contentType(mediaType)
                .header(
                        HttpHeaders.CACHE_CONTROL,
                        "no-cache, no-store, must-revalidate"
                )
                .body(
                        profile.getProfileImage()
                );
    }

    // ============================================================
    // UPLOAD PROFILE IMAGE
    // ============================================================

    @PutMapping(
            value = "/image",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public StudentProfileResponse uploadProfileImage(
            Authentication authentication,
            @RequestPart("file") MultipartFile file)
            throws IOException {

        String email = authentication.getName();

        return studentProfileService.saveProfileImage(
                email,
                file
        );
    }

 // ============================================================
 // UPLOAD RESUME — PDF ONLY
 // ============================================================

 @PostMapping(
         value = "/resume",
         consumes = MediaType.MULTIPART_FORM_DATA_VALUE
 )
 public ResponseEntity<StudentProfileResponse> uploadResume(
         Authentication authentication,
         @RequestPart("file") MultipartFile file)
         throws IOException {

     // Validate the file before saving it
     validatePdf(file);

     String email = authentication.getName();

     StudentProfileResponse response =
             studentProfileService.saveResume(
                     email,
                     file
             );

     return ResponseEntity.ok(response);
 }


    // ============================================================
    // VIEW RESUME
    // ============================================================

    @GetMapping("/resume")
    public ResponseEntity<byte[]> viewResume(
            Authentication authentication) {

        String email = authentication.getName();

        StudentProfile profile =
                studentProfileService
                        .getStudentProfileEntity(email);

        if (profile == null ||
                profile.getResume() == null ||
                profile.getResume().length == 0) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .build();
        }

        MediaType mediaType =
                getResumeMediaType(
                        profile.getResumeType()
                );

        String fileName =
                profile.getResumeName() != null
                        ? profile.getResumeName()
                        : "resume.pdf";

        return ResponseEntity.ok()
                .contentType(mediaType)
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "inline; filename=\"" +
                                fileName +
                                "\""
                )
                .body(profile.getResume());
    }

    // ============================================================
    // DOWNLOAD RESUME
    // ============================================================

    @GetMapping("/resume/download")
    public ResponseEntity<byte[]> downloadResume(
            Authentication authentication) {

        String email = authentication.getName();

        StudentProfile profile =
                studentProfileService
                        .getStudentProfileEntity(email);

        if (profile == null ||
                profile.getResume() == null ||
                profile.getResume().length == 0) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .build();
        }

        MediaType mediaType =
                getResumeMediaType(
                        profile.getResumeType()
                );

        String fileName =
                profile.getResumeName() != null
                        ? profile.getResumeName()
                        : "resume";

        return ResponseEntity.ok()
                .contentType(mediaType)
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" +
                                fileName +
                                "\""
                )
                .body(profile.getResume());
    }

    // ============================================================
    // RESUME MEDIA TYPE
    // ============================================================

    private MediaType getResumeMediaType(
            String resumeType) {

        if (resumeType == null ||
                resumeType.isBlank()) {

            return MediaType.APPLICATION_PDF;
        }

        try {

            return MediaType.parseMediaType(
                    resumeType
            );

        } catch (Exception ignored) {

            return MediaType.APPLICATION_OCTET_STREAM;
        }
    }
    
    
 // ============================================================
 // VALIDATE PDF RESUME
 // ============================================================

 private void validatePdf(MultipartFile file) {

     if (file == null || file.isEmpty()) {
         throw new IllegalArgumentException(
                 "Please upload a resume in PDF format."
         );
     }

     String fileName = file.getOriginalFilename();
     String contentType = file.getContentType();

     if (fileName == null ||
             !fileName.toLowerCase().endsWith(".pdf")) {
         throw new IllegalArgumentException(
                 "Only PDF resumes are allowed."
         );
     }

     if (contentType == null ||
             !contentType.equalsIgnoreCase("application/pdf")) {
         throw new IllegalArgumentException(
                 "Invalid file type. Please upload a PDF."
         );
     }
 }

}