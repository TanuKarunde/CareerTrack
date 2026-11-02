package com.careertrack.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.careertrack.dto.AdminCompanyResponse;
import com.careertrack.dto.CompanyVerificationRequest;
import com.careertrack.service.AdminCompanyService;

@RestController
@RequestMapping("/api/admin/companies")
@PreAuthorize("hasRole('ADMIN')")
public class AdminCompanyController {

    private final AdminCompanyService adminCompanyService;

    public AdminCompanyController(
            AdminCompanyService adminCompanyService) {
        this.adminCompanyService = adminCompanyService;
    }

    @GetMapping
    public ResponseEntity<?> getCompanies(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "ALL") String status) {

        try {
            List<AdminCompanyResponse> companies =
                    adminCompanyService.getCompanies(search, status);

            return ResponseEntity.ok(companies);

        } catch (IllegalArgumentException exception) {
            return ResponseEntity.badRequest().body(
                    Map.of("message", exception.getMessage()));
        }
    }

    @PatchMapping("/{companyId}/verification")
    public ResponseEntity<?> updateVerification(
            @PathVariable Long companyId,
            @RequestBody CompanyVerificationRequest request) {

        try {
            AdminCompanyResponse company =
                    adminCompanyService.updateVerification(
                            companyId,
                            request.getStatus(),
                            request.getNote());

            return ResponseEntity.ok(company);

        } catch (IllegalArgumentException exception) {
            HttpStatus status = "Company not found.".equals(
                    exception.getMessage())
                    ? HttpStatus.NOT_FOUND
                    : HttpStatus.BAD_REQUEST;

            return ResponseEntity.status(status).body(
                    Map.of("message", exception.getMessage()));
        }
    }
}