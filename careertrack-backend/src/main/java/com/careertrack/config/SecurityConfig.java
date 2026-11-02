package com.careertrack.config;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.careertrack.security.CustomUserDetailsService;
import com.careertrack.security.JwtAuthenticationFilter;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

	private final JwtAuthenticationFilter jwtAuthenticationFilter;

	private final CustomUserDetailsService userDetailsService;

	public SecurityConfig(CustomUserDetailsService userDetailsService,
			JwtAuthenticationFilter jwtAuthenticationFilter) {

		this.userDetailsService = userDetailsService;
		this.jwtAuthenticationFilter = jwtAuthenticationFilter;
	}

	@Bean
	public PasswordEncoder passwordEncoder() {

		return new BCryptPasswordEncoder();
	}

	@Bean
	public AuthenticationProvider authenticationProvider() {

		DaoAuthenticationProvider provider = new DaoAuthenticationProvider(userDetailsService);

		provider.setPasswordEncoder(passwordEncoder());

		return provider;
	}

	@Bean
	public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {

		return configuration.getAuthenticationManager();
	}

	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

		http.csrf(csrf -> csrf.disable())
		
		.exceptionHandling(ex -> ex
			    .accessDeniedHandler(accessDeniedHandler())
			)

				.cors(cors -> cors.configurationSource(corsConfigurationSource()))

				.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

				.authorizeHttpRequests(auth -> auth
						
						.requestMatchers(HttpMethod.OPTIONS, "/**")
						.permitAll()

						// Authentication APIs
						.requestMatchers("/api/auth/**")
						    .permitAll()

						// Employer job endpoint - must come before /api/jobs/**
						.requestMatchers(HttpMethod.GET, "/api/jobs/employer")
						    .hasRole("EMPLOYER")

						// Public job APIs
						.requestMatchers(HttpMethod.GET, "/api/jobs")
						    .permitAll()

						.requestMatchers(HttpMethod.GET, "/api/jobs/search")
						    .permitAll()
						    
						.requestMatchers(HttpMethod.GET, "/api/jobs/**")
						    .permitAll()
						    
						 //Amin APIs
						    .requestMatchers("/api/admin/**").hasRole("ADMIN")

						// Uploaded files/images
						.requestMatchers(
						        "/uploads/**",
						        "/uploads/company-logos/**",
						        "/uploads/profile-images/**"
						    )
						    .permitAll()
						    
						    .requestMatchers(HttpMethod.GET, "/api/company/employer/**").permitAll()
						    
						    .requestMatchers(
						            HttpMethod.GET,
						            "/api/company/*/logo"
						    )
						    .permitAll()
						    
						// Employer APIs
						.requestMatchers("/api/company/**")
						    .hasRole("EMPLOYER")

						.requestMatchers(HttpMethod.POST, "/api/jobs/**")
						    .hasRole("EMPLOYER")

						.requestMatchers(HttpMethod.PUT, "/api/jobs/**")
						    .hasRole("EMPLOYER")

						.requestMatchers(HttpMethod.DELETE, "/api/jobs/**")
						    .hasRole("EMPLOYER")

						.requestMatchers("/api/employer/**")
						    .hasAuthority("ROLE_EMPLOYER")

						// Student APIs
						.requestMatchers("/api/student/**")
						    .hasRole("STUDENT")

						.requestMatchers("/api/dashboard/student")
						    .hasRole("STUDENT")
						    
						    .requestMatchers("/api/applications/my")
					        .hasRole("STUDENT")

						// Student application APIs
						.requestMatchers("/api/applications/**")
						    .hasRole("STUDENT")
						    
						 // Resume Analyzer APIs - students only
						    .requestMatchers("/api/resume-analyzer/**")
						    .hasRole("STUDENT")

						// Employer dashboard
						.requestMatchers("/api/dashboard/employer")
						    .hasAuthority("ROLE_EMPLOYER")
						    

						    // WebSocket handshake
						    .requestMatchers("/ws", "/ws/**")
						        .permitAll()

						    // Temporary notification test endpoint - employers only
						    .requestMatchers(HttpMethod.POST, "/api/notifications/test")
						        .hasRole("EMPLOYER")

						    .anyRequest().authenticated()
)

				.authenticationProvider(authenticationProvider())

				.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

		return http.build();
	}

	@Bean
	CorsConfigurationSource corsConfigurationSource() {

	    CorsConfiguration configuration = new CorsConfiguration();

	    configuration.setAllowedOrigins(List.of("http://localhost:5173"));
	    configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
	    configuration.setAllowedHeaders(List.of("*"));
	    configuration.setAllowCredentials(true);

	    UrlBasedCorsConfigurationSource source =
	            new UrlBasedCorsConfigurationSource();

	    source.registerCorsConfiguration("/**", configuration);

	    return source;
	}
	
	@Bean
	public AccessDeniedHandler accessDeniedHandler() {
	    return (request, response, exception) -> {
	        var authentication =
	                org.springframework.security.core.context.SecurityContextHolder
	                        .getContext()
	                        .getAuthentication();

	        System.err.println("========== ACCESS DENIED ==========");
	        System.err.println("Request: " + request.getRequestURI());
	        System.err.println("Exception: " + exception.getMessage());

	        if (authentication == null) {
	            System.err.println("Authentication: NULL");
	        } else {
	            System.err.println("Principal: " + authentication.getName());
	            System.err.println("Authorities: " + authentication.getAuthorities());
	            System.err.println("Authenticated: " + authentication.isAuthenticated());
	        }

	        System.err.println("===================================");

	        response.sendError(
	                HttpServletResponse.SC_FORBIDDEN,
	                "Access denied"
	        );
	    };
	}
}
