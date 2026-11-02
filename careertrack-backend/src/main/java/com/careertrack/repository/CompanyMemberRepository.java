package com.careertrack.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.careertrack.entity.Company;
import com.careertrack.entity.CompanyMember;
import com.careertrack.entity.CompanyMemberStatus;
import com.careertrack.entity.User;

public interface CompanyMemberRepository
        extends JpaRepository<CompanyMember, Long> {

    boolean existsByUserAndStatus(
            User user,
            CompanyMemberStatus status
    );

    Optional<CompanyMember> findByUserAndStatus(
            User user,
            CompanyMemberStatus status
    );

    List<CompanyMember> findAllByUser(User user);
    
    List<CompanyMember> findByCompanyAndStatus(
            Company company,
            CompanyMemberStatus status
    );
    
    List<CompanyMember> findByCompanyIdAndStatus(
            Long companyId,
            CompanyMemberStatus status
    );
}