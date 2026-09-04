package com.govstart.dto;

import com.govstart.model.Role;
import java.util.List;

public class RegisterRequest {
    private String email;
    private String password;
    private String name;
    private Role role;

    private String deptName;
    private String deptAddress;
    private String deptContactPerson;

    private String companyName;
    private String startupDescription;
    private String startupDomain;
    private List<String> startupTags;
    private Integer teamSize;
    private Integer foundedYear;
    private String dpiitNumber;

    private String expertDomain;
    private String expertDesignation;
    private List<String> expertTags;

    public RegisterRequest() {}

    // Getters and Setters
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }
    public String getDeptName() { return deptName; }
    public void setDeptName(String deptName) { this.deptName = deptName; }
    public String getDeptAddress() { return deptAddress; }
    public void setDeptAddress(String deptAddress) { this.deptAddress = deptAddress; }
    public String getDeptContactPerson() { return deptContactPerson; }
    public void setDeptContactPerson(String deptContactPerson) { this.deptContactPerson = deptContactPerson; }
    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }
    public String getStartupDescription() { return startupDescription; }
    public void setStartupDescription(String startupDescription) { this.startupDescription = startupDescription; }
    public String getStartupDomain() { return startupDomain; }
    public void setStartupDomain(String startupDomain) { this.startupDomain = startupDomain; }
    public List<String> getStartupTags() { return startupTags; }
    public void setStartupTags(List<String> startupTags) { this.startupTags = startupTags; }
    public Integer getTeamSize() { return teamSize; }
    public void setTeamSize(Integer teamSize) { this.teamSize = teamSize; }
    public Integer getFoundedYear() { return foundedYear; }
    public void setFoundedYear(Integer foundedYear) { this.foundedYear = foundedYear; }
    public String getDpiitNumber() { return dpiitNumber; }
    public void setDpiitNumber(String dpiitNumber) { this.dpiitNumber = dpiitNumber; }
    public String getExpertDomain() { return expertDomain; }
    public void setExpertDomain(String expertDomain) { this.expertDomain = expertDomain; }
    public String getExpertDesignation() { return expertDesignation; }
    public void setExpertDesignation(String expertDesignation) { this.expertDesignation = expertDesignation; }
    public List<String> getExpertTags() { return expertTags; }
    public void setExpertTags(List<String> expertTags) { this.expertTags = expertTags; }
}
