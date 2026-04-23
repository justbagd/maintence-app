package com.example.maintenance.model;

public class TechnicianWorkload {

    private UserResponse technician;
    private long activeRequestCount;

    public TechnicianWorkload(UserResponse technician, long activeRequestCount) {
        this.technician = technician;
        this.activeRequestCount = activeRequestCount;
    }

    public UserResponse getTechnician() { return technician; }
    public long getActiveRequestCount() { return activeRequestCount; }
}
