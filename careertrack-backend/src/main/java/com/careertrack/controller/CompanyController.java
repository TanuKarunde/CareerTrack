package com.careertrack.controller;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.careertrack.dto.CompanyCreateRequest;
import com.careertrack.dto.CompanyProfileResponse;
import com.careertrack.entity.Company;
import com.careertrack.service.CompanyService;

@RestController
@RequestMapping("/api/company")
public class CompanyController {

    private final CompanyService companyService;

    public CompanyController(CompanyService companyService) {
        this.companyService = companyService;
    }

    // CREATE
    @PostMapping
    @PreAuthorize("hasRole('EMPLOYER')")
    public ResponseEntity<?> createCompany(
            @RequestBody CompanyCreateRequest request,
            Authentication authentication) {

        try {

            Company company =
                    companyService.createCompany(
                            request,
                            authentication.getName()
                    );

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(company);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(Map.of(
                            "message",
                            e.getMessage()
                    ));
        }
    }


    // GET MY COMPANY
    @GetMapping
    @PreAuthorize("hasRole('EMPLOYER')")
    public ResponseEntity<?> getMyCompany(
            Authentication authentication) {

        try {

            Company company =
                    companyService.getCompanyByEmployerEmail(
                            authentication.getName()
                    );

            return ResponseEntity.ok(company);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(Map.of(
                            "message",
                            e.getMessage()
                    ));
        }
    }


    // UPDATE MY COMPANY
    @PutMapping
    @PreAuthorize("hasRole('EMPLOYER')")
    public ResponseEntity<?> updateMyCompany(
            @RequestBody CompanyCreateRequest request,
            Authentication authentication) {

        try {

            Company company =
                    companyService.updateCompany(
                            request,
                            authentication.getName()
                    );

            return ResponseEntity.ok(company);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(Map.of(
                            "message",
                            e.getMessage()
                    ));
        }
    }
    
    @PostMapping("/logo")
    @PreAuthorize("hasRole('EMPLOYER')")
    public ResponseEntity<?> uploadCompanyLogo(
            @RequestParam("file") MultipartFile file,
            Authentication authentication) {

        try {
            Company company = companyService.uploadCompanyLogo(
                    file,
                    authentication.getName()
            );

            return ResponseEntity.ok(company);

        } catch (RuntimeException e) {
            return ResponseEntity
                    .badRequest()
                    .body(Map.of("message", e.getMessage()));
        }
    }
    
    @GetMapping("/logo")
    public ResponseEntity<byte[]> getCompanyLogo(
            Authentication authentication) {

        Company company =
                companyService.getCompanyLogo(
                        authentication.getName());

        if (company.getLogo() == null ||
                company.getLogo().length == 0) {

            return ResponseEntity.notFound().build();
        }

        MediaType mediaType;

        try {

            if (company.getLogoType() != null &&
                    !company.getLogoType().isBlank()) {

                mediaType = MediaType.parseMediaType(
                        company.getLogoType());

            } else {

                mediaType = MediaType.IMAGE_JPEG;
            }

        } catch (Exception e) {

            mediaType = MediaType.IMAGE_JPEG;
        }

        return ResponseEntity
                .ok()
                .contentType(mediaType)
                .body(company.getLogo());
    }
    
 // =====================================================
 // GET COMPANY LOGO - PUBLIC
 // Used on public job cards and public job details
 // =====================================================

    @GetMapping("/{companyId}/logo")
    public ResponseEntity<byte[]> getPublicCompanyLogo(
            @PathVariable Long companyId) {

        System.out.println("PUBLIC LOGO REQUEST: " + companyId);

        Company company = companyService.getCompanyById(companyId);

        System.out.println("COMPANY: " + company.getId());
        System.out.println("LOGO SIZE: " +
                (company.getLogo() == null ? 0 : company.getLogo().length));
        System.out.println("LOGO TYPE: " + company.getLogoType());

        if (company.getLogo() == null ||
                company.getLogo().length == 0) {

            return ResponseEntity.notFound().build();
        }

        MediaType mediaType;

        try {
            mediaType = MediaType.parseMediaType(
                    company.getLogoType()
            );
        } catch (Exception e) {
            mediaType = MediaType.IMAGE_JPEG;
        }

        return ResponseEntity
                .status(HttpStatus.OK)
                .contentType(mediaType)
                .body(company.getLogo());
    }
  
 // =====================================================
 // GET PUBLIC COMPANY PROFILE
 // =====================================================

 @GetMapping("/{companyId}")
 public ResponseEntity<?> getPublicCompanyProfile(
         @PathVariable Long companyId) {

     try {

         Company company =
                 companyService.getCompanyById(companyId);

         CompanyProfileResponse response =
                 new CompanyProfileResponse(
                         company.getId(),
                         company.getName(),
                         company.getTagline(),
                         company.getWebsite(),
                         company.getIndustry(),
                         company.getFounded(),
                         company.getHeadquarters(),
                         company.getAbout(),
                         "/api/company/" + company.getId() + "/logo"
                 );

         return ResponseEntity.ok(response);

     } catch (RuntimeException e) {

         return ResponseEntity
                 .status(HttpStatus.NOT_FOUND)
                 .body(Map.of(
                         "message",
                         e.getMessage()
                 ));
     }
 }
 
 @GetMapping("/employer/{employerId}")
 public ResponseEntity<?> getPublicCompanyByEmployer(
         @PathVariable Long employerId) {

     try {

         Company company =
                 companyService.getCompanyByEmployerId(employerId);

         CompanyProfileResponse response =
                 new CompanyProfileResponse(
                         company.getId(),
                         company.getName(),
                         company.getTagline(),
                         company.getWebsite(),
                         company.getIndustry(),
                         company.getFounded(),
                         company.getHeadquarters(),
                         company.getAbout(),
                         "/api/company/" + company.getId() + "/logo"
                 );

         return ResponseEntity.ok(response);

     } catch (RuntimeException e) {

         return ResponseEntity
                 .status(HttpStatus.NOT_FOUND)
                 .body(Map.of(
                         "message",
                         e.getMessage()
                 ));
     }
 }
 
 // =====================================================
 // JOIN EXISTING COMPANY
 // =====================================================

 @PostMapping("/join")
 @PreAuthorize("hasRole('EMPLOYER')")
 public ResponseEntity<?> joinCompany(
         @RequestBody Map<String, String> request,
         Authentication authentication) {

     try {

         String website = request.get("website");

         Company company =
                 companyService.joinCompany(
                         website,
                         authentication.getName()
                 );

         return ResponseEntity.ok(company);

     } catch (RuntimeException e) {

         return ResponseEntity
                 .badRequest()
                 .body(Map.of(
                         "message",
                         e.getMessage()
                 ));
     }
 }
}