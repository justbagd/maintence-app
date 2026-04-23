package com.example.maintenance.model;

public class LoginResponse {

    private UserResponse user;
    private String token;

    public LoginResponse(UserResponse user, String token) {
        this.user = user;
        this.token = token;
    }

    public UserResponse getUser() { return user; }
    public String getToken() { return token; }
}
