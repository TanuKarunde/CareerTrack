
package com.careertrack.repository;

import java.util.Optional;

import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.careertrack.entity.FeatureUsage;

public interface FeatureUsageRepository
        extends JpaRepository<FeatureUsage, Long> {

    Optional<FeatureUsage> findByUserEmail(String userEmail);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("""
        SELECT f FROM FeatureUsage f
        WHERE f.userEmail = :email
        """)
    Optional<FeatureUsage> findByUserEmailForUpdate(
            @Param("email") String email);
}
