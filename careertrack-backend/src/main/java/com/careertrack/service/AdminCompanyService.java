package com.careertrack.service;

import java.util.List;
import java.util.Locale;

import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.careertrack.dto.AdminCompanyResponse;
import com.careertrack.entity.Company;
import com.careertrack.entity.CompanyVerificationStatus;
import com.careertrack.repository.CompanyRepository;

@Service
public class AdminCompanyService {

    private final CompanyRepository companyRepository;

    public AdminCompanyService(CompanyRepository companyRepository) {
        this.companyRepository = companyRepository;
    }

    @Transactional(readOnly = true)
    public List<AdminCompanyResponse> getCompanies(
            String search,
            String statusFilter) {

        String normalizedSearch =
                search == null ? "" : search.trim().toLowerCase(Locale.ROOT);

        String normalizedStatus =
                statusFilter == null
                        ? "ALL"
                        : statusFilter.trim().toUpperCase(Locale.ROOT);

        if (!normalizedStatus.equals("ALL")) {
            try {
                CompanyVerificationStatus.valueOf(normalizedStatus);
            } catch (IllegalArgumentException exception) {
                throw new IllegalArgumentException(
                        "Invalid verification status: " + normalizedStatus);
            }
        }

        return companyRepository
                .findAll(Sort.by(Sort.Direction.DESC, "createdAt"))
                .stream()
                .filter(company -> {
                    if (normalizedStatus.equals("ALL")) {
                        return true;
                    }

                    return company.getVerificationStatus() != null
                            && company.getVerificationStatus()
                                    .name().equals(normalizedStatus);
                })
                .filter(company -> {
                    if (normalizedSearch.isEmpty()) {
                        return true;
                    }

                    return contains(company.getName(), normalizedSearch)
                            || contains(company.getWebsite(), normalizedSearch)
                            || contains(company.getIndustry(), normalizedSearch)
                            || contains(company.getHeadquarters(), normalizedSearch)
                            || (company.getCreatedBy() != null
                                    && (contains(
                                            company.getCreatedBy().getName(),
                                            normalizedSearch)
                                        || contains(
                                            company.getCreatedBy().getEmail(),
                                            normalizedSearch)));
                })
                .map(AdminCompanyResponse::new)
                .toList();
    }

    @Transactional
    public AdminCompanyResponse updateVerification(
            Long companyId,
            CompanyVerificationStatus status,
            String note) {

        if (status == null) {
            throw new IllegalArgumentException(
                    "Verification status is required.");
        }

        if (status == CompanyVerificationStatus.PENDING) {
            throw new IllegalArgumentException(
                    "Admin can only approve or reject a company.");
        }

        if (status == CompanyVerificationStatus.REJECTED
                && (note == null || note.isBlank())) {
            throw new IllegalArgumentException(
                    "Please provide a reason for rejecting the company.");
        }

        Company company = companyRepository.findById(companyId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Company not found."));

        company.setVerificationStatus(status);

        company.setVerificationNote(
                status == CompanyVerificationStatus.VERIFIED
                        ? null
                        : note.trim());

        Company savedCompany = companyRepository.save(company);

        return new AdminCompanyResponse(savedCompany);
    }

    private boolean contains(String value, String search) {
        return value != null
                && value.toLowerCase(Locale.ROOT).contains(search);
    }
}