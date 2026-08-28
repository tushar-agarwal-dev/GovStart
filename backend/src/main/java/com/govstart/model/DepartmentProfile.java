package com.govstart.model;

import jakarta.persistence.*;

@Entity
@Table(name = "department_profiles")
public class DepartmentProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", referencedColumnName = "id", nullable = false)
    private User user;

    @Column(name = "dept_name", nullable = false)
    private String deptName;

    @Column(columnDefinition = "TEXT")
    private String address;

    @Column(name = "contact_person")
    private String contactPerson;

    public DepartmentProfile() {}

    public DepartmentProfile(User user, String deptName, String address, String contactPerson) {
        this.user = user;
        this.deptName = deptName;
        this.address = address;
        this.contactPerson = contactPerson;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public String getDeptName() { return deptName; }
    public void setDeptName(String deptName) { this.deptName = deptName; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public String getContactPerson() { return contactPerson; }
    public void setContactPerson(String contactPerson) { this.contactPerson = contactPerson; }

    // Builder
    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private User user;
        private String deptName;
        private String address;
        private String contactPerson;

        public Builder user(User user) { this.user = user; return this; }
        public Builder deptName(String deptName) { this.deptName = deptName; return this; }
        public Builder address(String address) { this.address = address; return this; }
        public Builder contactPerson(String contactPerson) { this.contactPerson = contactPerson; return this; }

        public DepartmentProfile build() {
            return new DepartmentProfile(user, deptName, address, contactPerson);
        }
    }
}
