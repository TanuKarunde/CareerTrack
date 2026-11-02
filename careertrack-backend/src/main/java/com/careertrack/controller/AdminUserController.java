
package com.careertrack.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.careertrack.dto.AdminUserResponse;
import com.careertrack.service.AdminUserService;

@RestController
@RequestMapping("/api/admin")
public class AdminUserController {

    private final AdminUserService adminUserService;

    public AdminUserController(AdminUserService adminUserService) {
        this.adminUserService = adminUserService;
    }

    @GetMapping("/users")
    public ResponseEntity<List<AdminUserResponse>> getUsers(
            @RequestParam(required = false) String search,
            @RequestParam(required = false, defaultValue = "ALL") String role) {

        try {
            return ResponseEntity.ok(
                    adminUserService.getUsers(search, role)
            );
        } catch (IllegalArgumentException exception) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    exception.getMessage()
            );
        }
    }
}
