package com.careertrack.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.careertrack.dto.EmployerProfileRequest;
import com.careertrack.dto.EmployerProfileResponse;
import com.careertrack.entity.User;
import com.careertrack.repository.UserRepository;

@Service
public class EmployerProfileService {

    private final UserRepository userRepository;
    

    public EmployerProfileService(
            UserRepository userRepository) {

        this.userRepository = userRepository;
        
    }

    public EmployerProfileResponse getProfile(
            String email) {

        User user = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Employer not found."
                        ));

        return convertToResponse(user);
    }

    public EmployerProfileResponse updateProfile(
            String email,
            EmployerProfileRequest request) {

        User user = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Employer not found."
                        ));

        if (request.getName() != null) {
            user.setName(request.getName());
        }

        user.setPhone(request.getPhone());
        user.setDesignation(request.getDesignation());
        user.setLocation(request.getLocation());
        user.setBio(request.getBio());

        User savedUser =
                userRepository.save(user);

        return convertToResponse(savedUser);
    }

    public EmployerProfileResponse uploadProfileImage(
            String email,
            MultipartFile file) {

        User user = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("Employer not found."));

        if (file == null || file.isEmpty()) {
            throw new RuntimeException("Please select an image.");
        }

        if (file.getSize() > 5 * 1024 * 1024) {
            throw new RuntimeException("Image must be smaller than 5 MB.");
        }

        try {

            byte[] imageBytes = file.getBytes();

            String contentType = file.getContentType();

            user.setProfileImage(imageBytes);
            user.setProfileImageType(contentType);

            User savedUser = userRepository.save(user);

            return convertToResponse(savedUser);

        } catch (Exception e) {
        	e.printStackTrace();

            throw new RuntimeException(
                    "Failed to store profile image: "
                    + e.getMessage()
            );
        }
    }

    private EmployerProfileResponse convertToResponse(
            User user) {

        String imageUrl = null;

        if (user.getProfileImage() != null &&
                user.getProfileImage().length > 0) {

            imageUrl = "/api/employer/profile/image";
        }

        return new EmployerProfileResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getPhone(),
                user.getDesignation(),
                user.getLocation(),
                user.getBio(),
                imageUrl
        );
    }
}