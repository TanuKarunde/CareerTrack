package com.careertrack.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.careertrack.entity.Company;

public interface CompanyRepository
        extends JpaRepository<Company, Long> {

    Optional<Company> findByWebsiteIgnoreCase(String website);

    boolean existsByWebsiteIgnoreCase(String website);
    
    Optional<Company> findByCreatedById(Long userId);
}