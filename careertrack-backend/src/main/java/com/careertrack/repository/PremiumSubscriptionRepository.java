
package com.careertrack.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.careertrack.entity.PremiumSubscription;

public interface PremiumSubscriptionRepository
        extends JpaRepository<PremiumSubscription, Long> {

    Optional<PremiumSubscription> findByUserEmail(String userEmail);
}
