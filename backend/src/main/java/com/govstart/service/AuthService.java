package com.govstart.service;

import com.govstart.config.JwtTokenProvider;
import com.govstart.dto.AuthRequest;
import com.govstart.dto.AuthResponse;
import com.govstart.dto.RegisterRequest;
import com.govstart.model.*;
import com.govstart.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DepartmentProfileRepository departmentProfileRepository;

    @Autowired
    private StartupProfileRepository startupProfileRepository;

    @Autowired
    private ExpertProfileRepository expertProfileRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Transactional
    public User registerUser(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already in use");
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .status("ACTIVE")
                .build();

        user = userRepository.save(user);

        switch (request.getRole()) {
            case DEPARTMENT:
                DepartmentProfile deptProfile = DepartmentProfile.builder()
                        .user(user)
                        .deptName(request.getDeptName() != null ? request.getDeptName() : request.getName())
                        .address(request.getDeptAddress())
                        .contactPerson(request.getDeptContactPerson())
                        .build();
                departmentProfileRepository.save(deptProfile);
                break;
                
            case STARTUP:
                boolean isDpiitVerified = request.getDpiitNumber() != null && !request.getDpiitNumber().isEmpty();
                StartupProfile startupProfile = StartupProfile.builder()
                        .user(user)
                        .companyName(request.getCompanyName() != null ? request.getCompanyName() : request.getName())
                        .description(request.getStartupDescription())
                        .domain(request.getStartupDomain() != null ? request.getStartupDomain() : "General")
                        .tags(request.getStartupTags())
                        .teamSize(request.getTeamSize())
                        .foundedYear(request.getFoundedYear())
                        .isDpiitVerified(isDpiitVerified)
                        .dpiitNumber(request.getDpiitNumber())
                        .pastPilotsCount(0)
                        .successScore(0.0)
                        .build();
                startupProfileRepository.save(startupProfile);
                break;
                
            case EXPERT:
                ExpertProfile expertProfile = ExpertProfile.builder()
                        .user(user)
                        .expertiseDomain(request.getExpertDomain() != null ? request.getExpertDomain() : "General")
                        .designation(request.getExpertDesignation())
                        .expertTags(request.getExpertTags())
                        .build();
                expertProfileRepository.save(expertProfile);
                break;
                
            case ADMIN:
                // Admins do not need extra profile tables in Phase 1
                break;
        }

        return user;
    }

    public AuthResponse authenticateUser(AuthRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = tokenProvider.generateToken(authentication);

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        return AuthResponse.builder()
                .token(token)
                .email(user.getEmail())
                .role(user.getRole())
                .userId(user.getId())
                .name(user.getName())
                .build();
    }
}
