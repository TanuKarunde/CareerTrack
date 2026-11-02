
package com.careertrack.security;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.careertrack.entity.User;
import com.careertrack.repository.UserRepository;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email)
            throws UsernameNotFoundException {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new UsernameNotFoundException("User not found")
                );

        System.out.println("USER EMAIL = " + user.getEmail());
        System.out.println("USER ROLE = " + user.getRole());
        System.out.println("USER AUTHORITIES = " + user.getAuthorities());

        // Return your actual CareerTrack User entity.
        return user;
    }
}
