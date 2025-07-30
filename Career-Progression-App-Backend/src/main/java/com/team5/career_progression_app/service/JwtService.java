package com.team5.career_progression_app.service;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken.Payload;
import com.team5.career_progression_app.exception.ResourceNotFoundException;
import com.team5.career_progression_app.model.Role;
import com.team5.career_progression_app.repository.RoleRepository;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import java.security.Key;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class JwtService {
    
    @Value("${jwt.secret}")
    private String SECRET_KEY;
    
    private final RoleRepository roleRepository;
    private static final long ONE_DAY_IN_MILLISECONDS = 1000 * 60 * 60 * 24;
    
    public JwtService(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    public String generateToken(Payload googlePayload, String roleName, Integer userId) {
        Map<String, Object> claims = new HashMap<>();
        
        Role role = roleRepository.findRoleByName(roleName)
            .orElseThrow(() -> new ResourceNotFoundException("Role " + roleName + " not found"));
            
        claims.put("sub", googlePayload.getEmail());
        claims.put("email", googlePayload.getEmail());
        claims.put("name", googlePayload.get("name"));
        claims.put("picture", googlePayload.get("picture"));
        claims.put("given_name", googlePayload.get("given_name"));
        claims.put("family_name", googlePayload.get("family_name"));
        claims.put("email_verified", googlePayload.getEmailVerified());
        claims.put("role", roleName);
        claims.put("user_id", userId);

        List<Integer> permissionIds = role.getRolePermissions().stream()
            .map(rp -> rp.getPermission().getId())
            .collect(Collectors.toList());
            
        claims.put("permission_ids", permissionIds);
        
        return createToken(claims, googlePayload.getEmail());
    }
    
    public List<Integer> extractPermissionIds(String token) {
        return extractClaim(token, claims -> claims.get("permission_ids", List.class));
    }

    public String extractRole(String token) {
        return extractClaim(token, claims -> claims.get("role", String.class));
    }

    private String createToken(Map<String, Object> claims, String subject) {
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + ONE_DAY_IN_MILLISECONDS))
                .signWith(getSignKey())
                .compact();
    }

    private Key getSignKey() {
        byte[] keyBytes = Decoders.BASE64.decode(SECRET_KEY);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String extractEmail(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSignKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public Boolean isTokenValid(String token, String email) {
        final String tokenEmail = extractEmail(token);
        return (tokenEmail.equals(email) && !isTokenExpired(token));
    }

    private Boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    public Integer extractUserId(String token) {
        return extractClaim(token, claims -> claims.get("user_id", Integer.class)); 
    }
    
}