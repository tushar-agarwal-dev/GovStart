package com.govstart.dto;

import com.govstart.model.Role;

public class AuthResponse {
    private String token;
    private String email;
    private Role role;
    private Long userId;
    private String name;

    public AuthResponse() {}

    public AuthResponse(String token, String email, Role role, Long userId, String name) {
        this.token = token;
        this.email = email;
        this.role = role;
        this.userId = userId;
        this.name = name;
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private String token;
        private String email;
        private Role role;
        private Long userId;
        private String name;

        public Builder token(String token) { this.token = token; return this; }
        public Builder email(String email) { this.email = email; return this; }
        public Builder role(Role role) { this.role = role; return this; }
        public Builder userId(Long userId) { this.userId = userId; return this; }
        public Builder name(String name) { this.name = name; return this; }

        public AuthResponse build() {
            return new AuthResponse(token, email, role, userId, name);
        }
    }
}
