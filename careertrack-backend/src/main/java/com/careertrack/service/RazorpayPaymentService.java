
package com.careertrack.service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.Base64;
import java.util.HexFormat;
import java.util.Map;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

@Service
public class RazorpayPaymentService {

    @Value("${razorpay.key-id}")
    private String keyId;

    @Value("${razorpay.key-secret}")
    private String keySecret;

    private final RestClient restClient = RestClient.builder()
            .baseUrl("https://api.razorpay.com/v1")
            .build();

    public String getKeyId() {
        return keyId;
    }

    public Map<?, ?> createOrder(int amountInPaise, String receipt) {

        if (amountInPaise <= 0) {
            throw new IllegalArgumentException("Amount must be greater than zero");
        }

        String credentials = keyId + ":" + keySecret;
        String encodedCredentials = Base64.getEncoder()
                .encodeToString(credentials.getBytes());

        return restClient.post()
                .uri("/orders")
                .header(
                        HttpHeaders.AUTHORIZATION,
                        "Basic " + encodedCredentials
                )
                .contentType(MediaType.APPLICATION_JSON)
                .body(Map.of(
                        "amount", amountInPaise,
                        "currency", "INR",
                        "receipt", receipt
                ))
                .retrieve()
                .body(Map.class);
    }
    

public boolean verifyPaymentSignature(
        String orderId,
        String paymentId,
        String signature) {

    try {
        String payload = orderId + "|" + paymentId;

        Mac mac = Mac.getInstance("HmacSHA256");

        SecretKeySpec secretKey = new SecretKeySpec(
                keySecret.getBytes(StandardCharsets.UTF_8),
                "HmacSHA256"
        );

        mac.init(secretKey);

        byte[] hash = mac.doFinal(
                payload.getBytes(StandardCharsets.UTF_8)
        );

        String expectedSignature = HexFormat.of().formatHex(hash);

        return MessageDigest.isEqual(
                expectedSignature.getBytes(StandardCharsets.UTF_8),
                signature.getBytes(StandardCharsets.UTF_8)
        );

    } catch (Exception e) {
        return false;
    }
}



@SuppressWarnings("unchecked")
public Map<String, Object> fetchPayment(String paymentId) {

    String credentials = keyId + ":" + keySecret;

    String encodedCredentials = java.util.Base64.getEncoder()
            .encodeToString(
                    credentials.getBytes(java.nio.charset.StandardCharsets.UTF_8));

    Map<String, Object> payment = restClient.get()
            .uri("/payments/{paymentId}", paymentId)
            .header(
                    org.springframework.http.HttpHeaders.AUTHORIZATION,
                    "Basic " + encodedCredentials)
            .retrieve()
            .body(Map.class);

    if (payment == null) {
        throw new IllegalStateException("Payment details not found");
    }

    return payment;
}

}
