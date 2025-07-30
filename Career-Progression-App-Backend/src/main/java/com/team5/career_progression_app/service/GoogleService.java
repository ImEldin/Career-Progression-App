package com.team5.career_progression_app.service;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.team5.career_progression_app.exception.TokenVerificationException;
import com.team5.career_progression_app.exception.TokenRevocationException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;
import java.util.Date;

@Service
public class GoogleService {

    private static final Logger logger = LoggerFactory.getLogger(GoogleService.class);

    @Value("${google.client-id}")
    private String clientId;

    public GoogleIdToken.Payload verify(String idTokenString) {
        try {
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
                    new NetHttpTransport(),
                    new GsonFactory())
                    .setAudience(Collections.singletonList(clientId))
                    .build();

            GoogleIdToken idToken = verifier.verify(idTokenString);
            if (idToken == null) {
                throw new TokenVerificationException("Invalid ID token");
            }

            GoogleIdToken.Payload payload = idToken.getPayload();

            if (!payload.getAudience().equals(clientId)) {
                throw new TokenVerificationException("Audience mismatch");
            }

            long expirationTimeMillis = payload.getExpirationTimeSeconds() * 1000L;
            if (new Date().after(new Date(expirationTimeMillis))) {
                throw new TokenVerificationException("Token expired");
            }

            return payload;
        } catch (Exception e) {
            logger.error("Google token verification failed", e);
            throw new TokenVerificationException("Token verification failed", e);
        }
    }

    public void revokeToken(String token) {
        try {
            String revokeUrl = "https://oauth2.googleapis.com/revoke?token=" + token;
            RestTemplate restTemplate = new RestTemplate();

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

            HttpEntity<String> entity = new HttpEntity<>(headers);

            ResponseEntity<String> response = restTemplate.exchange(
                revokeUrl,
                HttpMethod.POST,
                entity,
                String.class
            );

            if (!response.getStatusCode().is2xxSuccessful()) {
                throw new TokenRevocationException("Failed to revoke token: " + response.getBody());
            }
        } catch (Exception e) {
            logger.error("Error during token revocation: " + e.getMessage(), e);
            throw new TokenRevocationException("Token revocation failed", e);
        }
    }
}
