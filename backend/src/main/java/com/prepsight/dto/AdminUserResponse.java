package com.prepsight.dto;

public class AdminUserResponse {

    private Long id;
    private String username;
    private String email;
    private String role;
    private boolean active;
    private int activityCount;

    public AdminUserResponse(Long id, String username, String email, String role, boolean active, int activityCount) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.role = role;
        this.active = active;
        this.activityCount = activityCount;
    }

    public Long getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public String getEmail() {
        return email;
    }

    public String getRole() {
        return role;
    }

    public boolean isActive() {
        return active;
    }

    public int getActivityCount() {
        return activityCount;
    }
}
