
package com.careertrack.service;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.careertrack.entity.FeatureUsage;
import com.careertrack.entity.PremiumSubscription;
import com.careertrack.repository.FeatureUsageRepository;
import com.careertrack.repository.PremiumSubscriptionRepository;

@Service
public class FeatureUsageService {

    private static final int FREE_INTERVIEW_LIMIT = 3;
    private static final int FREE_RESUME_LIMIT = 2;

    private final FeatureUsageRepository usageRepository;
    private final PremiumSubscriptionRepository subscriptionRepository;

    public FeatureUsageService(
            FeatureUsageRepository usageRepository,
            PremiumSubscriptionRepository subscriptionRepository) {
        this.usageRepository = usageRepository;
        this.subscriptionRepository = subscriptionRepository;
    }

    public boolean isPremiumActive(String email) {
        PremiumSubscription subscription =
                subscriptionRepository.findByUserEmail(email)
                        .orElse(null);

        return subscription != null
                && "ACTIVE".equals(subscription.getStatus())
                && subscription.getExpiresAt() != null
                && subscription.getExpiresAt().isAfter(LocalDateTime.now());
    }

    /*
     * Call inside the feature's existing @Transactional method.
     * If the analysis/session creation fails and the exception rolls
     * back that transaction, this usage increment rolls back too.
     */
    @Transactional
    public void consumeInterviewUse(String email) {
        if (isPremiumActive(email)) {
            return;
        }

        FeatureUsage usage = getOrCreateAndLock(email);

        if (usage.getInterviewUses() >= FREE_INTERVIEW_LIMIT) {
            throw premiumRequired(
                    "You have used all 3 free Interview Practice sessions. "
                    + "Upgrade to Premium for unlimited practice.");
        }

        usage.setInterviewUses(usage.getInterviewUses() + 1);
        usageRepository.save(usage);
    }

    @Transactional
    public void consumeResumeUse(String email) {
        if (isPremiumActive(email)) {
            return;
        }

        FeatureUsage usage = getOrCreateAndLock(email);

        if (usage.getResumeUses() >= FREE_RESUME_LIMIT) {
            throw premiumRequired(
                    "You have used both free Resume Analyzer attempts. "
                    + "Upgrade to Premium for unlimited resume analysis.");
        }

        usage.setResumeUses(usage.getResumeUses() + 1);
        usageRepository.save(usage);
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getUsageStatus(String email) {
        boolean premium = isPremiumActive(email);

        FeatureUsage usage = usageRepository.findByUserEmail(email)
                .orElse(null);

        int interviewUsed =
                usage == null ? 0 : usage.getInterviewUses();

        int resumeUsed =
                usage == null ? 0 : usage.getResumeUses();

        Map<String, Object> result = new LinkedHashMap<>();

        result.put("isPremium", premium);
        result.put("planPrice", 499);
        result.put("currency", "INR");

        result.put("interviewLimit", FREE_INTERVIEW_LIMIT);
        result.put("interviewUsed", interviewUsed);
        result.put("interviewRemaining", premium
                ? -1
                : Math.max(0, FREE_INTERVIEW_LIMIT - interviewUsed));

        result.put("resumeLimit", FREE_RESUME_LIMIT);
        result.put("resumeUsed", resumeUsed);
        result.put("resumeRemaining", premium
                ? -1
                : Math.max(0, FREE_RESUME_LIMIT - resumeUsed));

        return result;
    }

    private FeatureUsage getOrCreateAndLock(String email) {
        FeatureUsage usage = usageRepository.findByUserEmail(email)
                .orElse(null);

        if (usage == null) {
            FeatureUsage newUsage = new FeatureUsage();
            newUsage.setUserEmail(email);
            newUsage.setInterviewUses(0);
            newUsage.setResumeUses(0);

            usageRepository.saveAndFlush(newUsage);
        }

        return usageRepository.findByUserEmailForUpdate(email)
                .orElseThrow(() -> new IllegalStateException(
                        "Could not load feature usage"));
    }

    private ResponseStatusException premiumRequired(String message) {
        return new ResponseStatusException(
                HttpStatus.PAYMENT_REQUIRED,
                message);
    }
}
