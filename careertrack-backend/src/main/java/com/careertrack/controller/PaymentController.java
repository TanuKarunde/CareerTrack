
package com.careertrack.controller;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.careertrack.dto.VerifyPaymentRequest;
import com.careertrack.entity.Payment;
import com.careertrack.entity.PremiumSubscription;
import com.careertrack.repository.PaymentRepository;
import com.careertrack.repository.PremiumSubscriptionRepository;
import com.careertrack.service.RazorpayPaymentService;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final RazorpayPaymentService razorpayPaymentService;
    private final PaymentRepository paymentRepository;
    private final PremiumSubscriptionRepository subscriptionRepository;

    public PaymentController(
            RazorpayPaymentService razorpayPaymentService,
            PaymentRepository paymentRepository,
            PremiumSubscriptionRepository subscriptionRepository) {

        this.razorpayPaymentService = razorpayPaymentService;
        this.paymentRepository = paymentRepository;
        this.subscriptionRepository = subscriptionRepository;
    }

    @PostMapping("/create-order")
    public ResponseEntity<?> createOrder(
            @RequestParam(defaultValue = "MONTHLY") String plan,
            Authentication authentication) {

        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401)
                    .body(Map.of("error", "Please log in first"));
        }

        if (!"MONTHLY".equalsIgnoreCase(plan)) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Invalid subscription plan"));
        }

        int amountInPaise = 49900;

        String receipt = "ct_" + UUID.randomUUID()
                .toString().replace("-", "").substring(0, 20);

        try {
            Map<?, ?> order = razorpayPaymentService.createOrder(
                    amountInPaise, receipt);

            String orderId = (String) order.get("id");

            Payment payment = new Payment();
            payment.setUserEmail(authentication.getName());
            payment.setRazorpayOrderId(orderId);
            payment.setPlanCode("MONTHLY");
            payment.setAmount(amountInPaise);
            payment.setCurrency("INR");
            payment.setStatus("CREATED");

            paymentRepository.save(payment);

            return ResponseEntity.ok(Map.of(
                    "keyId", razorpayPaymentService.getKeyId(),
                    "order", order
            ));

        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Unable to create payment order"));
        }
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyPayment(
            @RequestBody VerifyPaymentRequest request,
            Authentication authentication) {

        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401)
                    .body(Map.of("error", "Please log in first"));
        }

        if (request.getRazorpayOrderId() == null
                || request.getRazorpayPaymentId() == null
                || request.getRazorpaySignature() == null
                || request.getRazorpayOrderId().isBlank()
                || request.getRazorpayPaymentId().isBlank()
                || request.getRazorpaySignature().isBlank()) {

            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Missing payment verification details"));
        }

        Payment payment = paymentRepository
                .findByRazorpayOrderId(request.getRazorpayOrderId())
                .orElse(null);

        if (payment == null
                || !payment.getUserEmail().equals(authentication.getName())) {
            return ResponseEntity.status(404)
                    .body(Map.of("error", "Payment order not found"));
        }

        if ("SUCCESS".equals(payment.getStatus())) {
            return ResponseEntity.ok(Map.of(
                    "message", "Payment already verified",
                    "status", "SUCCESS"
            ));
        }

        if (!razorpayPaymentService.verifyPaymentSignature(
                request.getRazorpayOrderId(),
                request.getRazorpayPaymentId(),
                request.getRazorpaySignature())) {

            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Invalid payment signature"));
        }

        try {
            Map<String, Object> razorpayPayment =
                    razorpayPaymentService.fetchPayment(
                            request.getRazorpayPaymentId());

            if (!request.getRazorpayOrderId().equals(
                    razorpayPayment.get("order_id"))) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Payment order mismatch"));
            }

            if (!"captured".equals(razorpayPayment.get("status"))) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Payment has not been captured"));
            }

            if (!(razorpayPayment.get("amount") instanceof Number amount)
                    || amount.intValue() != payment.getAmount()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Payment amount mismatch"));
            }

            if (!"INR".equals(razorpayPayment.get("currency"))) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Payment currency mismatch"));
            }

            payment.setRazorpayPaymentId(request.getRazorpayPaymentId());
            payment.setStatus("SUCCESS");
            paymentRepository.save(payment);

            LocalDateTime now = LocalDateTime.now();

            PremiumSubscription subscription = subscriptionRepository
                    .findByUserEmail(payment.getUserEmail())
                    .orElseGet(PremiumSubscription::new);

            // Preserve remaining subscription time if Premium is already active.
            LocalDateTime start = now;
            if ("ACTIVE".equals(subscription.getStatus())
                    && subscription.getExpiresAt() != null
                    && subscription.getExpiresAt().isAfter(now)) {
                start = subscription.getExpiresAt();
            }

            subscription.setUserEmail(payment.getUserEmail());
            subscription.setPlanCode(payment.getPlanCode());
            subscription.setStatus("ACTIVE");
            subscription.setStartedAt(now);
            subscription.setExpiresAt(start.plusMonths(1));

            subscriptionRepository.save(subscription);

            return ResponseEntity.ok(Map.of(
                    "message", "Premium activated successfully",
                    "status", "ACTIVE",
                    "expiresAt", subscription.getExpiresAt().toString()
            ));

        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("error",
                            "Unable to confirm payment. Please try again."));
        }
    }
    
    @GetMapping("/subscription-status")
    public ResponseEntity<?> getSubscriptionStatus(
            Authentication authentication) {

        if (authentication == null
                || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401)
                    .body(Map.of("error", "Please log in first"));
        }

        String email = authentication.getName();
        LocalDateTime now = LocalDateTime.now();

        PremiumSubscription subscription = subscriptionRepository
                .findByUserEmail(email)
                .orElse(null);

        boolean isPremium = subscription != null
                && "ACTIVE".equals(subscription.getStatus())
                && subscription.getExpiresAt() != null
                && subscription.getExpiresAt().isAfter(now);

        return ResponseEntity.ok(Map.of(
                "isPremium", isPremium,
                "status", isPremium ? "ACTIVE" : "INACTIVE",
                "planCode", isPremium
                        ? subscription.getPlanCode()
                        : "",
                "expiresAt", isPremium
                        ? subscription.getExpiresAt().toString()
                        : ""
        ));
    }
}
