package com.govstart.model;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "expert_profiles")
public class ExpertProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", referencedColumnName = "id", nullable = false)
    private User user;

    @Column(name = "expertise_domain", nullable = false)
    private String expertiseDomain;

    @Column
    private String designation;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "expert_tags", joinColumns = @JoinColumn(name = "expert_profile_id"))
    @Column(name = "tag")
    private List<String> expertTags;

    public ExpertProfile() {}

    public ExpertProfile(User user, String expertiseDomain, String designation, List<String> expertTags) {
        this.user = user;
        this.expertiseDomain = expertiseDomain;
        this.designation = designation;
        this.expertTags = expertTags;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public String getExpertiseDomain() { return expertiseDomain; }
    public void setExpertiseDomain(String expertiseDomain) { this.expertiseDomain = expertiseDomain; }
    public String getDesignation() { return designation; }
    public void setDesignation(String designation) { this.designation = designation; }
    public List<String> getExpertTags() { return expertTags; }
    public void setExpertTags(List<String> expertTags) { this.expertTags = expertTags; }

    // Builder
    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private User user;
        private String expertiseDomain;
        private String designation;
        private List<String> expertTags;

        public Builder user(User user) { this.user = user; return this; }
        public Builder expertiseDomain(String expertiseDomain) { this.expertiseDomain = expertiseDomain; return this; }
        public Builder designation(String designation) { this.designation = designation; return this; }
        public Builder expertTags(List<String> expertTags) { this.expertTags = expertTags; return this; }

        public ExpertProfile build() {
            return new ExpertProfile(user, expertiseDomain, designation, expertTags);
        }
    }
}
