package com.careertrack.controller;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.careertrack.dto.EmployerProfileRequest;
import com.careertrack.dto.EmployerProfileResponse;
import com.careertrack.entity.User;
import com.careertrack.repository.UserRepository;
import com.careertrack.service.EmployerProfileService;

@RestController
@RequestMapping("/api/employer/profile")
@PreAuthorize("hasRole('EMPLOYER')")
public class EmployerProfileController {

    private final EmployerProfileService employerProfileService;
    private final UserRepository userRepository;

    public EmployerProfileController(
            EmployerProfileService employerProfileService,
            UserRepository userRepository){

        this.employerProfileService = employerProfileService;
        this.userRepository = userRepository;
    }

    // =========================
    // GET EMPLOYER PROFILE
    // =========================

    @GetMapping
    public ResponseEntity<EmployerProfileResponse> getProfile(
            Authentication authentication) {

        EmployerProfileResponse response =
                employerProfileService.getProfile(
                        authentication.getName()
                );

        return ResponseEntity.ok(response);
    }

    // =========================
    // UPDATE EMPLOYER PROFILE
    // =========================

    @PutMapping
    public ResponseEntity<EmployerProfileResponse> updateProfile(
            Authentication authentication,
            @RequestBody EmployerProfileRequest request) {

        EmployerProfileResponse response =
                employerProfileService.updateProfile(
                        authentication.getName(),
                        request
                );

        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/image")
    public ResponseEntity<EmployerProfileResponse> uploadProfileImage(
            Authentication authentication,
            @RequestParam("file") MultipartFile file) {

        EmployerProfileResponse response =
                employerProfileService.uploadProfileImage(
                        authentication.getName(),
                        file
                );

        return ResponseEntity.ok(response);
    }

    // =========================
    // UPLOAD PROFILE IMAGE
    // =========================

    @GetMapping("/image")
    public ResponseEntity<byte[]> getProfileImage(
            Authentication authentication) {

        User user = userRepository
                .findByEmail(authentication.getName())
                .orElseThrow(() ->
                        new RuntimeException("Employer not found."));

        byte[] image = user.getProfileImage();

        if (image == null || image.length == 0) {
            return ResponseEntity.notFound().build();
        }

        String type = user.getProfileImageType();

        MediaType mediaType;

        try {
            if (type != null && !type.isBlank()) {
                mediaType = MediaType.parseMediaType(type);
            } else {
                mediaType = MediaType.parseMediaType("image/jpeg");
            }
        } catch (Exception e) {
            mediaType = MediaType.parseMediaType("image/jpeg");
        }

        return ResponseEntity
                .ok()
                .contentType(mediaType)
                .body(image);
    }
}