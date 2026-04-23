package com.example.maintenance.model;

import java.time.LocalDate;

public class UserResponse {

    private Long id;
    private String name;
    private String email;
    private Role role;

    // Tenant only
    private String apartmentNumber;
    private LocalDate leaseStart;
    private LocalDate leaseEnd;

    // Staff only
    private String skillType;
    private Boolean available;

    public static UserResponse from(User user) {
        UserResponse res = new UserResponse();
        res.id = user.getId();
        res.name = user.getName();
        res.email = user.getEmail();
        res.role = user.getRole();

        if (user.getRole() == Role.TENANT) {
            res.apartmentNumber = user.getApartmentNumber();
            res.leaseStart = user.getLeaseStart();
            res.leaseEnd = user.getLeaseEnd();
        }

        if (user.getRole() == Role.STAFF) {
            res.skillType = user.getSkillType();
            res.available = user.getAvailable();
        }

        return res;
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    public Role getRole() { return role; }
    public String getApartmentNumber() { return apartmentNumber; }
    public LocalDate getLeaseStart() { return leaseStart; }
    public LocalDate getLeaseEnd() { return leaseEnd; }
    public String getSkillType() { return skillType; }
    public Boolean getAvailable() { return available; }
}
