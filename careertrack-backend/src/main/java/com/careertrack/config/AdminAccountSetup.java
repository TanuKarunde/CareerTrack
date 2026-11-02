
package com.careertrack.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.careertrack.entity.Role;
import com.careertrack.entity.User;
import com.careertrack.repository.UserRepository;

@Configuration
@ConditionalOnProperty(
    name = "app.admin-setup.enabled",
    havingValue = "true"
)
public class AdminAccountSetup {

    @Bean
    CommandLineRunner createAdminAccount(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            org.springframework.core.env.Environment environment) {

        return args -> {
            String name = environment.getProperty("app.admin-setup.name");
            String email = environment.getProperty("app.admin-setup.email");
            String password = environment.getProperty("app.admin-setup.password");

            if (name == null || name.isBlank()
                    || email == null || email.isBlank()
                    || password == null || password.length() < 12) {
                throw new IllegalStateException(
                    "Provide admin setup name, email, and a password of at least 12 characters."
                );
            }

            if (userRepository.existsByEmail(email)) {
                throw new IllegalStateException(
                    "The admin email already exists. No account was changed."
                );
            }

            User admin = new User();
            admin.setName(name);
            admin.setEmail(email);
            admin.setPassword(passwordEncoder.encode(password));
            admin.setRole(Role.ADMIN);

            userRepository.save(admin);

            System.out.println("CareerTrack Admin account created.");
        };
    }
}
