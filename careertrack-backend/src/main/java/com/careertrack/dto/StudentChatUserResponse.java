
package com.careertrack.dto;

public class StudentChatUserResponse {

    private Long id;
    private String name;
    private String designation;
    private String location;
    private String bio;
    private boolean hasProfileImage;

    public StudentChatUserResponse(
            Long id,
            String name,
            String designation,
            String location,
            String bio,
            boolean hasProfileImage) {
        this.id = id;
        this.name = name;
        this.designation = designation;
        this.location = location;
        this.bio = bio;
        this.hasProfileImage = hasProfileImage;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
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

    public boolean isHasProfileImage() {
        return hasProfileImage;
    }
}
