package com.careertrack.entity;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User implements UserDetails{

	@Id
    @GeneratedValue(strategy =  GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false , unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
    
    private String phone;

    private String designation;

    private String location;

    @Column(columnDefinition = "TEXT")
    private String bio;

    @Lob
    @Column(name = "profile_image", columnDefinition = "LONGBLOB")
    private byte[] profileImage;

    @Column(name = "profile_image_type")
    private String profileImageType;
    
    @PrePersist
    protected void onCreate(){
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdates(){
        updatedAt = LocalDateTime.now();
    }

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}	

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public Role getRole() {
		return role;
	}

	public void setRole(Role role) {
		this.role = role;
	}

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}

	public LocalDateTime getUpdatedAt() {
		return updatedAt;
	}

	@Override
	public Collection<? extends GrantedAuthority> getAuthorities(){
		
		return List.of(new SimpleGrantedAuthority("ROLE_" + role.name()));
	}
	
	@Override
	public String getUsername() {
		return email;
	}
	
	@Override
	public boolean isAccountNonExpired() {
		return true;
	}

	@Override
	public boolean isAccountNonLocked() {
		return true;
	}
	
	@Override
	public boolean isCredentialsNonExpired() {
		return true;
	}
	
	@Override
	public boolean isEnabled() {
		return true;
	}
	
	public String getPhone() {
	    return phone;
	}

	public void setPhone(String phone) {
	    this.phone = phone;
	}

	public String getDesignation() {
	    return designation;
	}

	public void setDesignation(String designation) {
	    this.designation = designation;
	}

	public String getLocation() {
	    return location;
	}

	public void setLocation(String location) {
	    this.location = location;
	}

	public String getBio() {
	    return bio;
	}

	public void setBio(String bio) {
	    this.bio = bio;
	}

	public byte[] getProfileImage() {
	    return profileImage;
	}

	public void setProfileImage(byte[] profileImage) {
	    this.profileImage = profileImage;
	}

	public String getProfileImageType() {
	    return profileImageType;
	}

	public void setProfileImageType(String profileImageType) {
	    this.profileImageType = profileImageType;
	}
}
