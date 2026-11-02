package com.careertrack.service;

import java.net.URI;
import java.util.Locale;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

import org.springframework.web.multipart.MultipartFile;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.careertrack.dto.CompanyCreateRequest;
import com.careertrack.entity.Company;
import com.careertrack.entity.CompanyMember;
import com.careertrack.entity.CompanyMemberStatus;
import com.careertrack.entity.CompanyRole;
import com.careertrack.entity.CompanyVerificationStatus;
import com.careertrack.entity.User;
import com.careertrack.repository.CompanyMemberRepository;
import com.careertrack.repository.CompanyRepository;
import com.careertrack.repository.UserRepository;

@Service
public class CompanyService {

	private final CompanyRepository companyRepository;
	private final CompanyMemberRepository companyMemberRepository;
	private final UserRepository userRepository;

	public CompanyService(CompanyRepository companyRepository, CompanyMemberRepository companyMemberRepository,
			UserRepository userRepository) {
		this.companyRepository = companyRepository;
		this.companyMemberRepository = companyMemberRepository;
		this.userRepository = userRepository;
	}

	// =====================================================
	// CREATE COMPANY
	// =====================================================

	@Transactional
	public Company createCompany(CompanyCreateRequest request, String userEmail) {

		User user = userRepository.findByEmail(userEmail).orElseThrow(() -> new RuntimeException("User not found"));

		// ---------------------------------------------
		// CHECK USER ALREADY HAS COMPANY
		// ---------------------------------------------

		if (companyMemberRepository.existsByUserAndStatus(user, CompanyMemberStatus.APPROVED)) {

			throw new RuntimeException("You already belong to a company.");
		}

		// ---------------------------------------------
		// NORMALIZE WEBSITE
		// ---------------------------------------------

		String website = normalizeWebsite(request.getWebsite());

		// ---------------------------------------------
		// CHECK COMPANY ALREADY EXISTS
		// ---------------------------------------------

		if (companyRepository.existsByWebsiteIgnoreCase(website)) {

			throw new RuntimeException("A company with this website already exists. Please request to join it.");
		}

		// ---------------------------------------------
		// VERIFY EMAIL DOMAIN
		// ---------------------------------------------

		String emailDomain = user.getEmail().substring(user.getEmail().indexOf("@") + 1).toLowerCase(Locale.ROOT);

		String websiteDomain = extractDomain(website);

		if (!emailDomain.equals(websiteDomain)) {

			throw new RuntimeException("Company website must match your employer email domain.");
		}

		// ---------------------------------------------
		// CREATE COMPANY
		// ---------------------------------------------

		Company company = new Company();

		company.setName(request.getName());
		company.setVerificationStatus(
		        CompanyVerificationStatus.PENDING
		);
		company.setVerificationNote(null);
		company.setTagline(request.getTagline());
		company.setWebsite(website);
		company.setIndustry(request.getIndustry());
		company.setFounded(request.getFounded());
		company.setHeadquarters(request.getHeadquarters());
		company.setAbout(request.getAbout());
		company.setCreatedBy(user);

        Company savedCompany =
                companyRepository.save(company);

		// ---------------------------------------------
		// CREATE OWNER MEMBERSHIP
		// ---------------------------------------------

		CompanyMember member = new CompanyMember();

		member.setCompany(savedCompany);
		member.setUser(user);
		member.setRole(CompanyRole.OWNER);
		member.setStatus(CompanyMemberStatus.PENDING);

		companyMemberRepository.save(member);

		return savedCompany;
	}

	// =====================================================
	// JOIN EXISTING COMPANY
	// =====================================================

	@Transactional
	public Company joinCompany(String website, String userEmail) {

	    User user = userRepository.findByEmail(userEmail)
	            .orElseThrow(() ->
	                    new RuntimeException("User not found"));

	    // ---------------------------------------------
	    // CHECK USER ALREADY BELONGS TO A COMPANY
	    // ---------------------------------------------

	    if (companyMemberRepository.existsByUserAndStatus(
	            user,
	            CompanyMemberStatus.APPROVED)) {

	        throw new RuntimeException(
	                "You already belong to a company.");
	    }

	    // ---------------------------------------------
	    // NORMALIZE WEBSITE
	    // ---------------------------------------------

	    String normalizedWebsite = normalizeWebsite(website);

	    // ---------------------------------------------
	    // FIND EXISTING COMPANY
	    // ---------------------------------------------

	    Company company = companyRepository
	            .findByWebsiteIgnoreCase(normalizedWebsite)
	            .orElseThrow(() ->
	                    new RuntimeException(
	                            "Company not found. Please check the company website."));

	    // ---------------------------------------------
	    // VERIFY EMAIL DOMAIN
	    // ---------------------------------------------

	    String emailDomain = user.getEmail()
	            .substring(user.getEmail().indexOf("@") + 1)
	            .toLowerCase(Locale.ROOT);

	    String companyDomain = extractDomain(
	            company.getWebsite());

	    if (!emailDomain.equals(companyDomain)) {

	        throw new RuntimeException(
	                "Your employer email domain does not match this company.");
	    }

	    // ---------------------------------------------
	    // CHECK EXISTING MEMBERSHIP
	    // ---------------------------------------------

	    if (!companyMemberRepository
	            .findAllByUser(user)
	            .isEmpty()) {

	        throw new RuntimeException(
	                "You already have a company membership.");
	    }

	    // ---------------------------------------------
	    // CREATE MEMBERSHIP
	    // ---------------------------------------------

	    CompanyMember member = new CompanyMember();

	    member.setCompany(company);
	    member.setUser(user);
	    member.setRole(CompanyRole.HR);
	    member.setStatus(CompanyMemberStatus.APPROVED);

	    companyMemberRepository.save(member);

	    return company;
	}
	
	// =====================================================
	// GET MY COMPANY
	// =====================================================

	@Transactional(readOnly = true)
	public Company getCompanyByEmployerEmail(String userEmail) {

		User user = userRepository.findByEmail(userEmail).orElseThrow(() -> new RuntimeException("User not found"));

		CompanyMember member = companyMemberRepository.findByUserAndStatus(user, CompanyMemberStatus.APPROVED)
				.orElseThrow(() -> new RuntimeException("You are not associated with any company."));

		return member.getCompany();
	}

	// =====================================================
	// UPDATE MY COMPANY
	// =====================================================

	@Transactional
	public Company updateCompany(CompanyCreateRequest request, String userEmail) {

		User user = userRepository.findByEmail(userEmail).orElseThrow(() -> new RuntimeException("User not found"));

		// ---------------------------------------------
		// FIND APPROVED COMPANY MEMBERSHIP
		// ---------------------------------------------

		CompanyMember member = companyMemberRepository.findByUserAndStatus(user, CompanyMemberStatus.APPROVED)
				.orElseThrow(() -> new RuntimeException("You are not associated with any company."));

		Company company = member.getCompany();

		// ---------------------------------------------
		// UPDATE BASIC INFORMATION
		// ---------------------------------------------

		company.setName(request.getName());
		company.setTagline(request.getTagline());
		company.setIndustry(request.getIndustry());
		company.setFounded(request.getFounded());
		company.setHeadquarters(request.getHeadquarters());
		company.setAbout(request.getAbout());

		return companyRepository.save(company);
	}
	
	// =====================================================
		// UPLOAD COMPANY LOGO
		// =====================================================

		@Transactional
		public Company uploadCompanyLogo(MultipartFile file, String userEmail) {

			if (file == null || file.isEmpty()) {

				throw new RuntimeException("Please select a logo.");
			}

			// 5 MB LIMIT

			if (file.getSize() > 5 * 1024 * 1024) {

				throw new RuntimeException("Logo must be smaller than 5 MB.");
			}

			// CHECK IMAGE TYPE

			String contentType = file.getContentType();

			if (contentType == null || !contentType.startsWith("image/")) {

				throw new RuntimeException("Please select a valid image.");
			}

			User user = userRepository.findByEmail(userEmail).orElseThrow(() -> new RuntimeException("User not found"));

			CompanyMember member = companyMemberRepository.findByUserAndStatus(user, CompanyMemberStatus.APPROVED)
					.orElseThrow(() -> new RuntimeException("You are not associated with any company."));

			Company company = member.getCompany();

			try {

				// Convert image into byte[]

				byte[] logoBytes = file.getBytes();

				// Save image into MySQL BLOB

				company.setLogo(logoBytes);

				// Save image MIME type

				company.setLogoType(contentType);

				return companyRepository.save(company);

			} catch (Exception e) {

				throw new RuntimeException("Failed to store company logo: " + e.getMessage());
			}
		}

		// =====================================================
		// GET COMPANY LOGO
		// =====================================================

		@Transactional(readOnly = true)
		public Company getCompanyLogo(String userEmail) {

			User user = userRepository.findByEmail(userEmail).orElseThrow(() -> new RuntimeException("User not found"));

			CompanyMember member = companyMemberRepository.findByUserAndStatus(user, CompanyMemberStatus.APPROVED)
					.orElseThrow(() -> new RuntimeException("You are not associated with any company."));

			return member.getCompany();
		}

	// =====================================================
	// NORMALIZE WEBSITE
	// =====================================================

	private String normalizeWebsite(String website) {

		if (website == null || website.isBlank()) {

			throw new RuntimeException("Company website is required.");
		}

		website = website.trim();

		if (!website.startsWith("http://") && !website.startsWith("https://")) {

			website = "https://" + website;
		}

		return website;
	}

	// =====================================================
	// EXTRACT DOMAIN
	// =====================================================

	private String extractDomain(String website) {

		try {

			String host = URI.create(website).getHost();

			if (host == null) {

				throw new RuntimeException("Invalid company website.");
			}

			host = host.toLowerCase(Locale.ROOT);

			if (host.startsWith("www.")) {

				host = host.substring(4);
			}

			return host;

		} catch (Exception e) {

			throw new RuntimeException("Invalid company website.");
		}
	}
	
	public Company getCompanyById(Long companyId) {

	    return companyRepository.findById(companyId)
	            .orElseThrow(() ->
	                    new RuntimeException("Company not found"));
	}
	
	public Company getCompanyByEmployerId(Long employerId) {

	    return companyRepository
	            .findByCreatedById(employerId)
	            .orElseThrow(() ->
	                    new RuntimeException("Company not found"));
	}
}