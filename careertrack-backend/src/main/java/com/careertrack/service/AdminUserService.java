
package com.careertrack.service;

import java.util.List;
import java.util.Locale;

import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.careertrack.dto.AdminUserResponse;
import com.careertrack.entity.Role;
import com.careertrack.entity.User;
import com.careertrack.repository.UserRepository;

@Service
public class AdminUserService {

    private final UserRepository userRepository;

    public AdminUserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<AdminUserResponse> getUsers(String search, String roleFilter) {

        String normalizedSearch = search == null
                ? ""
                : search.trim().toLowerCase(Locale.ROOT);

        Role selectedRole = null;

        if (roleFilter != null
                && !roleFilter.isBlank()
                && !"ALL".equalsIgnoreCase(roleFilter.trim())) {

            try {
                selectedRole = Role.valueOf(
                        roleFilter.trim().toUpperCase(Locale.ROOT)
                );
            } catch (IllegalArgumentException exception) {
                throw new IllegalArgumentException(
                        "Invalid role filter. Use STUDENT, EMPLOYER, ADMIN, or ALL."
                );
            }
        }

        final Role role = selectedRole;

        return userRepository
                .findAll(Sort.by(Sort.Direction.DESC, "createdAt"))
                .stream()
                .filter(user -> role == null || user.getRole() == role)
                .filter(user -> matchesSearch(user, normalizedSearch))
                .map(AdminUserResponse::new)
                .toList();
    }

    private boolean matchesSearch(User user, String search) {
        if (search.isBlank()) {
            return true;
        }

        return contains(user.getName(), search)
                || contains(user.getEmail(), search);
    }

    private boolean contains(String value, String search) {
        return value != null
                && value.toLowerCase(Locale.ROOT).contains(search);
    }
}
