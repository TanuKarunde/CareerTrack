
package com.careertrack.dto;

import java.time.LocalDateTime;

import com.careertrack.entity.Role;
import com.careertrack.entity.User;

public class AdminUserResponse {

    private Long id;
    private String name;
    private String email;
    private Role role;
    private String phone;
    private String location;
    private LocalDateTime createdAt;

    public AdminUserResponse() {
    }

    public AdminUserResponse(User user) {
        this.id = user.getId();
        this.name = user.getName();
        this.email = user.getEmail();
        this.role = user.getRole();
        this.phone = user.getPhone();
        this.location = user.getLocation();
        this.createdAt = user.getCreatedAt();
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

    public Role getRole() {
        return role;
    }

    public String getPhone() {
        return phone;
    }

    public String getLocation() {
        return location;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}
