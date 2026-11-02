package com.careertrack.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

import java.nio.charset.StandardCharsets;
import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;


@Service
public class JwtService {

	private final SecretKey secretKey;
	
	private final long experiationTime = 1000 * 60 * 60;
	
	public JwtService(
			@Value("${jwt.secret}") String secret) {
		this.secretKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
	}
	
	public String generateToken(UserDetails userDetails) {
		
		return Jwts.builder().subject(userDetails.getUsername()).claim("role", userDetails.getAuthorities().iterator().next().getAuthority()).issuedAt(new Date()).expiration(new Date(System.currentTimeMillis() + experiationTime)).signWith(secretKey).compact();
	}
	
	public String extractUsername(String token) {
		return extractAllClaims(token).getSubject();
	}
	
	public boolean isTokenValid(String token, UserDetails userDetails) {
		
		String username = extractUsername(token);
		
		return username.equals(userDetails.getUsername()) && !isTokenExpired(token);
	}
	
	private boolean isTokenExpired(String token) {
		
		return extractAllClaims(token).getExpiration().before(new Date());
	}
	
	private Claims extractAllClaims(String token) {
		
		return Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(token).getPayload();
	}
}
