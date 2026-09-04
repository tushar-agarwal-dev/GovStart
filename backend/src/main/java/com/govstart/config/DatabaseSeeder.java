package com.govstart.config;

import com.govstart.model.*;
import com.govstart.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Collections;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DepartmentProfileRepository departmentProfileRepository;

    @Autowired
    private StartupProfileRepository startupProfileRepository;

    @Autowired
    private ExpertProfileRepository expertProfileRepository;

    @Autowired
    private ProblemRepository problemRepository;

    @Autowired
    private RecommendationRepository recommendationRepository;

    @Autowired
    private EvaluationRepository evaluationRepository;

    @Autowired
    private PilotRepository pilotRepository;

    @Autowired
    private PilotUpdateRepository pilotUpdateRepository;

    @Autowired
    private DecisionRepository decisionRepository;

    @Autowired
    private StatusTransitionLogRepository statusTransitionLogRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // 1. Clear ALL transactional/workflow data to ensure a completely fresh slate
        decisionRepository.deleteAll();
        pilotUpdateRepository.deleteAll();
        pilotRepository.deleteAll();
        evaluationRepository.deleteAll();
        recommendationRepository.deleteAll();
        statusTransitionLogRepository.deleteAll();
        problemRepository.deleteAll();

        // 2. Seed/Verify core roles
        seedAdmin();
        DepartmentProfile dept = seedDepartment();
        StartupProfile ecotech = seedStartup("Maha-EcoTech Solutions", "ecotech@startups.in", "StartupPass_GovStart_2026!",
                "Advanced AI-enabled organic waste decomposers for community landfill management.",
                "Waste Management", Arrays.asList("Waste Management", "Recycling", "AI", "AgriTech"), 12, 2024, "DPIIT-893021");

        StartupProfile healthsetu = seedStartup("HealthSetu Platforms", "healthsetu@startups.in", "StartupPass_GovStart_2026!",
                "Telemedicine infrastructure connecting rural primary health centers with civil hospitals.",
                "HealthTech", Arrays.asList("HealthTech", "Telemedicine", "IoT"), 25, 2023, "DPIIT-772183");

        StartupProfile krishidron = seedStartup("KrishiDron Systems", "krishidron@startups.in", "StartupPass_GovStart_2026!",
                "Drone-based multispectral imaging and local soil health forecasting algorithms.",
                "AgriTech", Arrays.asList("AgriTech", "IoT", "Drone", "Analytics"), 8, 2025, "DPIIT-321102");

        ExpertProfile kulkarni = seedExpert("Prof. Ravindra Kulkarni", "kulkarni@coep.ac.in", "ExpertPass_GovStart_2026!",
                "Environmental Science & Engineering", "Professor, COEP Tech University",
                Arrays.asList("Waste Management", "Recycling", "Biotech"));

        ExpertProfile deshmukh = seedExpert("Dr. Ananya Deshmukh", "deshmukh@vjti.ac.in", "ExpertPass_GovStart_2026!",
                "Digital Health & Communications", "Associate Professor, VJTI Mumbai",
                Arrays.asList("HealthTech", "Telemedicine", "AI"));

        // 3. Create fresh transactions representing each state in the pipeline

        // ==========================================
        // TRANSACTION 1: State = POSTED (New Challenge, Matchmaking calculated)
        // ==========================================
        Problem prob1 = Problem.builder()
                .department(dept)
                .title("AI-based Traffic Congestion Control")
                .description("Real-time traffic flow prediction and dynamic signal timing adjustments using computer vision feeds from existing city cameras.")
                .tags(Arrays.asList("AI", "Traffic Control", "Computer Vision", "IoT"))
                .budgetMin(500000.0)
                .budgetMax(1200000.0)
                .timelineDays(90)
                .status("POSTED")
                .build();
        prob1 = problemRepository.save(prob1);

        // Pre-create some recommendations
        recommendationRepository.save(Recommendation.builder()
                .problem(prob1)
                .startup(krishidron)
                .ruleScore(0.5)
                .llmScore(4.0)
                .finalWeightedScore(70.0)
                .llmJustification("KrishiDron's computer vision and IoT analytics background is moderately relevant to managing sensor nodes in city intersections.")
                .rankPosition(1)
                .build());

        // ==========================================
        // TRANSACTION 2: State = UNDER_EVALUATION (Expert scorecard submitted)
        // ==========================================
        Problem prob2 = Problem.builder()
                .department(dept)
                .title("Rural Telemedicine Portal")
                .description("Low-bandwidth virtual clinic platform connecting rural health sub-centers to city hospitals with integrated basic diagnostic IoT support.")
                .tags(Arrays.asList("HealthTech", "Telemedicine", "IoT"))
                .budgetMin(600000.0)
                .budgetMax(1500000.0)
                .timelineDays(120)
                .status("UNDER_EVALUATION")
                .build();
        prob2 = problemRepository.save(prob2);

        // Pre-create recommendation
        recommendationRepository.save(Recommendation.builder()
                .problem(prob2)
                .startup(healthsetu)
                .ruleScore(1.0)
                .llmScore(5.0)
                .finalWeightedScore(95.0)
                .llmJustification("Direct match. HealthSetu specializes in low-bandwidth telemedicine infrastructure for primary health centers.")
                .rankPosition(1)
                .build());

        // Submit Expert Evaluation scorecard
        evaluationRepository.save(Evaluation.builder()
                .problem(prob2)
                .startup(healthsetu)
                .expert(deshmukh)
                .feasibilityScore(4)
                .innovationScore(4)
                .teamScore(5)
                .costScore(3)
                .comments("The low-bandwidth video compression algorithm is highly suited for rural areas. Recommended for immediate sandbox pilot deployment.")
                .build());

        statusTransitionLogRepository.save(StatusTransitionLog.builder()
                .problem(prob2)
                .previousStatus("POSTED")
                .newStatus("UNDER_EVALUATION")
                .build());

        // ==========================================
        // TRANSACTION 3: State = PILOT_ACTIVE (Sandbox launched, progress updates logged)
        // ==========================================
        Problem prob3 = Problem.builder()
                .department(dept)
                .title("Drone-Based Crop Health Analytics")
                .description("Multi-spectral crop damage assessment and soil health mapping sandbox for local government agriculture support.")
                .tags(Arrays.asList("AgriTech", "IoT", "Drone", "Analytics"))
                .budgetMin(700000.0)
                .budgetMax(1800000.0)
                .timelineDays(120)
                .status("PILOT_ACTIVE")
                .build();
        prob3 = problemRepository.save(prob3);

        recommendationRepository.save(Recommendation.builder()
                .problem(prob3)
                .startup(krishidron)
                .ruleScore(1.0)
                .llmScore(5.0)
                .finalWeightedScore(98.0)
                .llmJustification("Perfect Jaccard and semantic match. KrishiDron has specialized drone fleets and crop forecasting algorithms ready.")
                .rankPosition(1)
                .build());

        // Launch Pilot
        Pilot pilot3 = Pilot.builder()
                .problem(prob3)
                .startup(krishidron)
                .department(dept)
                .scope("120-day sandbox pilot mapping 500 hectares of local crop land in Nanded district.")
                .startDate(LocalDate.now().minusDays(30))
                .endDate(LocalDate.now().plusDays(90))
                .budget(1200000.0)
                .releasedAmount(480000.0)
                .escrowBalance(720000.0)
                .status("PILOT_ACTIVE")
                .build();
        pilot3 = pilotRepository.save(pilot3);

        // Submit Startup progress updates
        pilotUpdateRepository.save(PilotUpdate.builder()
                .pilot(pilot3)
                .progressPercent(40)
                .milestoneName("Hardware Calibration & Flight Planning")
                .notes("Drones calibrated and flight paths generated for Shivaji Nagar rural sector.")
                .status("APPROVED")
                .build());

        pilotUpdateRepository.save(PilotUpdate.builder()
                .pilot(pilot3)
                .progressPercent(75)
                .milestoneName("Field Scanning & Imaging")
                .notes("350 hectares successfully scanned. Multi-spectral image data processed and generated.")
                .status("PENDING")
                .build());

        statusTransitionLogRepository.save(StatusTransitionLog.builder()
                .problem(prob3)
                .previousStatus("UNDER_EVALUATION")
                .newStatus("PILOT_ACTIVE")
                .build());

        // ==========================================
        // TRANSACTION 4: State = DECIDED (Pilot complete, Procurement approved)
        // ==========================================
        Problem prob4 = Problem.builder()
                .department(dept)
                .title("Smart AI-Enabled Landfill Waste Sorter")
                .description("Automated waste sorting and organic decomposition sandbox at community landfill.")
                .tags(Arrays.asList("Waste Management", "AI", "Recycling", "Biotech"))
                .budgetMin(800000.0)
                .budgetMax(2000000.0)
                .timelineDays(120)
                .status("DECIDED")
                .build();
        prob4 = problemRepository.save(prob4);

        recommendationRepository.save(Recommendation.builder()
                .problem(prob4)
                .startup(ecotech)
                .ruleScore(1.0)
                .llmScore(5.0)
                .finalWeightedScore(96.0)
                .llmJustification("Direct match for waste sorting. Maha-EcoTech's organic decomposer solves community landfill problems.")
                .rankPosition(1)
                .build());

        // Expert evaluation scorecard
        evaluationRepository.save(Evaluation.builder()
                .problem(prob4)
                .startup(ecotech)
                .expert(kulkarni)
                .feasibilityScore(5)
                .innovationScore(5)
                .teamScore(5)
                .costScore(4)
                .comments("Proven technology. Recommended for scale-up at landfill.")
                .build());

        // Complete Pilot
        Pilot pilot4 = Pilot.builder()
                .problem(prob4)
                .startup(ecotech)
                .department(dept)
                .scope("Deploy 2 waste sorter units at community landfill.")
                .startDate(LocalDate.now().minusDays(60))
                .endDate(LocalDate.now().minusDays(10))
                .budget(1500000.0)
                .releasedAmount(1500000.0)
                .escrowBalance(0.0)
                .status("PILOT_COMPLETE")
                .build();
        pilot4 = pilotRepository.save(pilot4);

        // Startup milestone showing 100% progress
        pilotUpdateRepository.save(PilotUpdate.builder()
                .pilot(pilot4)
                .progressPercent(100)
                .milestoneName("Full Landfill Commissioning")
                .notes("Both units fully active and running. Sorting accuracy logged at 93.5% over 15-day trial.")
                .status("APPROVED")
                .build());

        // Final Procurement Decision
        decisionRepository.save(Decision.builder()
                .pilot(pilot4)
                .decisionType("SCALE")
                .remarks("The pilot sandbox succeeded in meeting all operational SLAs (93.5% sorting accuracy achieved). Under the Sandbox legal framework, we authorize direct procurement via the GeM portal.")
                .decidedBy(dept.getUser())
                .build());

        statusTransitionLogRepository.save(StatusTransitionLog.builder()
                .problem(prob4)
                .previousStatus("PILOT_ACTIVE")
                .newStatus("DECIDED")
                .build());
    }

    private void seedAdmin() {
        if (!userRepository.existsByEmail("admin@govstart.gov.in")) {
            User admin = User.builder()
                    .name("Super Admin")
                    .email("admin@govstart.gov.in")
                    .passwordHash(passwordEncoder.encode("AdminPass_GovStart_2026!"))
                    .role(Role.ADMIN)
                    .status("ACTIVE")
                    .build();
            userRepository.save(admin);
        }
    }

    private DepartmentProfile seedDepartment() {
        User deptUser;
        if (!userRepository.existsByEmail("dept@govstart.gov.in")) {
            deptUser = User.builder()
                    .name("Urban Development Nodal Nanded")
                    .email("dept@govstart.gov.in")
                    .passwordHash(passwordEncoder.encode("DeptPass_GovStart_2026!"))
                    .role(Role.DEPARTMENT)
                    .status("ACTIVE")
                    .build();
            deptUser = userRepository.save(deptUser);
        } else {
            deptUser = userRepository.findByEmail("dept@govstart.gov.in").orElse(null);
        }

        DepartmentProfile profile = departmentProfileRepository.findByUser(deptUser).orElse(null);
        if (profile == null) {
            profile = DepartmentProfile.builder()
                    .user(deptUser)
                    .deptName("Nanded Waghala Municipal Corporation")
                    .address("NWMC Head Office, Shivaji Nagar, Nanded")
                    .contactPerson("Dr. Satish Kumar (Nodal Officer)")
                    .build();
            profile = departmentProfileRepository.save(profile);
        }
        return profile;
    }

    private StartupProfile seedStartup(String companyName, String email, String password, String desc,
                                     String domain, java.util.List<String> tags, int teamSize, int founded, String dpiit) {
        User user;
        if (!userRepository.existsByEmail(email)) {
            user = User.builder()
                    .name(companyName)
                    .email(email)
                    .passwordHash(passwordEncoder.encode(password))
                    .role(Role.STARTUP)
                    .status("ACTIVE")
                    .build();
            user = userRepository.save(user);
        } else {
            user = userRepository.findByEmail(email).orElse(null);
        }

        StartupProfile profile = startupProfileRepository.findByUser(user).orElse(null);
        if (profile == null) {
            profile = StartupProfile.builder()
                    .user(user)
                    .companyName(companyName)
                    .description(desc)
                    .domain(domain)
                    .tags(tags)
                    .teamSize(teamSize)
                    .foundedYear(founded)
                    .isDpiitVerified(true)
                    .dpiitNumber(dpiit)
                    .pastPilotsCount(1)
                    .successScore(85.0)
                    .build();
            profile = startupProfileRepository.save(profile);
        }
        return profile;
    }

    private ExpertProfile seedExpert(String name, String email, String password, String domain, String designation, java.util.List<String> tags) {
        User user;
        if (!userRepository.existsByEmail(email)) {
            user = User.builder()
                    .name(name)
                    .email(email)
                    .passwordHash(passwordEncoder.encode(password))
                    .role(Role.EXPERT)
                    .status("ACTIVE")
                    .build();
            user = userRepository.save(user);
        } else {
            user = userRepository.findByEmail(email).orElse(null);
        }

        ExpertProfile profile = expertProfileRepository.findByUser(user).orElse(null);
        if (profile == null) {
            profile = ExpertProfile.builder()
                    .user(user)
                    .expertiseDomain(domain)
                    .designation(designation)
                    .expertTags(tags)
                    .build();
            profile = expertProfileRepository.save(profile);
        }
        return profile;
    }
}
