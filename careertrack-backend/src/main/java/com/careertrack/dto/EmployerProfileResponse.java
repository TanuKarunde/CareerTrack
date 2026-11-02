package com.careertrack.dto;

public class EmployerProfileResponse {

    private Long id;
    private String name;
    private String email;
    private String phone;
    private String designation;
    private String location;
    private String bio;
    private String profileImage;

    public EmployerProfileResponse() {
    }

    public EmployerProfileResponse(
            Long id,
            String name,
            String email,
            String phone,
            String designation,
            String location,
            String bio,
            String profileImage) {

        this.id = id;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.designation = designation;
        this.location = location;
        this.bio = bio;
        this.profileImage = profileImage;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public String getPhone() {
        return phone;
    }

    public String getDesignation() {
        return designation;
    }

    public String getLocation() {
        return location;
    }

    public String getBio() {
        return bio;
    }

    public String getProfileImage() {
        return profileImage;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public void setDesignation(String designation) {
        this.designation = designation;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public void setProfileImage(String profileImage) {
        this.profileImage = profileImage;
    }
}