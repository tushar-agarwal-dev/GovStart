package com.govstart.model;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "startup_profiles")
public class StartupProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", referencedColumnName = "id", nullable = false)
    private User user;

    @Column(name = "company_name", nullable = false)
    private String companyName;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private String domain; // E.g., Waste Management, HealthTech, AgriTech

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "startup_tags", joinColumns = @JoinColumn(name = "startup_profile_id"))
    @Column(name = "tag")
    private List<String> tags;

    @Column(name = "team_size")
    private Integer teamSize;

    @Column(name = "founded_year")
    private Integer foundedYear;

    @Column(name = "past_pilots_count")
    private Integer pastPilotsCount;

    @Column(name = "success_score")
    private Double successScore; // range 0-100 or 0-5

    @Column(name = "is_dpiit_verified", nullable = false)
    private boolean isDpiitVerified;

    @Column(name = "dpiit_number")
    private String dpiitNumber;

    public StartupProfile() {}

    public StartupProfile(User user, String companyName, String description, String domain, List<String> tags,
                          Integer teamSize, Integer foundedYear, Integer pastPilotsCount, Double successScore,
                          boolean isDpiitVerified, String dpiitNumber) {
        this.user = user;
        this.companyName = companyName;
        this.description = description;
        this.domain = domain;
        this.tags = tags;
        this.teamSize = teamSize;
        this.foundedYear = foundedYear;
        this.pastPilotsCount = pastPilotsCount;
        this.successScore = successScore;
        this.isDpiitVerified = isDpiitVerified;
        this.dpiitNumber = dpiitNumber;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getDomain() { return domain; }
    public void setDomain(String domain) { this.domain = domain; }
    public List<String> getTags() { return tags; }
    public void setTags(List<String> tags) { this.tags = tags; }
    public Integer getTeamSize() { return teamSize; }
    public void setTeamSize(Integer teamSize) { this.teamSize = teamSize; }
    public Integer getFoundedYear() { return foundedYear; }
    public void setFoundedYear(Integer foundedYear) { this.foundedYear = foundedYear; }
    public Integer getPastPilotsCount() { return pastPilotsCount; }
    public void setPastPilotsCount(Integer pastPilotsCount) { this.pastPilotsCount = pastPilotsCount; }
    public Double getSuccessScore() { return successScore; }
    public void setSuccessScore(Double successScore) { this.successScore = successScore; }
    public boolean isDpiitVerified() { return isDpiitVerified; }
    public void setDpiitVerified(boolean isDpiitVerified) { this.isDpiitVerified = isDpiitVerified; }
    public String getDpiitNumber() { return dpiitNumber; }
    public void setDpiitNumber(String dpiitNumber) { this.dpiitNumber = dpiitNumber; }

    // Builder
    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private User user;
        private String companyName;
        private String description;
        private String domain;
        private List<String> tags;
        private Integer teamSize;
        private Integer foundedYear;
        private Integer pastPilotsCount;
        private Double successScore;
        private boolean isDpiitVerified;
        private String dpiitNumber;

        public Builder user(User user) { this.user = user; return this; }
        public Builder companyName(String companyName) { this.companyName = companyName; return this; }
        public Builder description(String description) { this.description = description; return this; }
        public Builder domain(String domain) { this.domain = domain; return this; }
        public Builder tags(List<String> tags) { this.tags = tags; return this; }
        public Builder teamSize(Integer teamSize) { this.teamSize = teamSize; return this; }
        public Builder foundedYear(Integer foundedYear) { this.foundedYear = foundedYear; return this; }
        public Builder pastPilotsCount(Integer pastPilotsCount) { this.pastPilotsCount = pastPilotsCount; return this; }
        public Builder successScore(Double successScore) { this.successScore = successScore; return this; }
        public Builder isDpiitVerified(boolean isDpiitVerified) { this.isDpiitVerified = isDpiitVerified; return this; }
        public Builder dpiitNumber(String dpiitNumber) { this.dpiitNumber = dpiitNumber; return this; }

        public StartupProfile build() {
            return new StartupProfile(user, companyName, description, domain, tags, teamSize, foundedYear, pastPilotsCount, successScore, isDpiitVerified, dpiitNumber);
        }
    }
}
