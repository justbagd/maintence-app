package com.example.maintenance.model;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class MaintenanceRequest {

    private Long requestId;
    private Long tenantId;
    private Long assignedStaffId;      // nullable

    private Category category;
    private LocationInUnit locationInUnit;
    private String description;

    private Priority priority;
    private Status status;

    private String photoUrl;           // nullable

    private LocalDate preferredDate;   // nullable
    private PreferredTime preferredTime;

    private boolean allowEntry;

    private LocalDateTime dateSubmitted;
    private LocalDateTime completionDate; // nullable

    private Long parentRequestId;      // nullable — set when reopening an archived request

    public MaintenanceRequest() {}

    public MaintenanceRequest(Long requestId, Long tenantId, Category category,
                              LocationInUnit locationInUnit, String description,
                              Priority priority) {
        this.requestId = requestId;
        this.tenantId = tenantId;
        this.category = category;
        this.locationInUnit = locationInUnit;
        this.description = description;
        this.priority = priority;
        this.status = Status.PENDING;
        this.allowEntry = false;
        this.dateSubmitted = LocalDateTime.now();
    }

    public Long getRequestId() { return requestId; }
    public void setRequestId(Long requestId) { this.requestId = requestId; }

    public Long getTenantId() { return tenantId; }
    public void setTenantId(Long tenantId) { this.tenantId = tenantId; }

    public Long getAssignedStaffId() { return assignedStaffId; }
    public void setAssignedStaffId(Long assignedStaffId) { this.assignedStaffId = assignedStaffId; }

    public Category getCategory() { return category; }
    public void setCategory(Category category) { this.category = category; }

    public LocationInUnit getLocationInUnit() { return locationInUnit; }
    public void setLocationInUnit(LocationInUnit locationInUnit) { this.locationInUnit = locationInUnit; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Priority getPriority() { return priority; }
    public void setPriority(Priority priority) { this.priority = priority; }

    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }

    public String getPhotoUrl() { return photoUrl; }
    public void setPhotoUrl(String photoUrl) { this.photoUrl = photoUrl; }

    public LocalDate getPreferredDate() { return preferredDate; }
    public void setPreferredDate(LocalDate preferredDate) { this.preferredDate = preferredDate; }

    public PreferredTime getPreferredTime() { return preferredTime; }
    public void setPreferredTime(PreferredTime preferredTime) { this.preferredTime = preferredTime; }

    public boolean isAllowEntry() { return allowEntry; }
    public void setAllowEntry(boolean allowEntry) { this.allowEntry = allowEntry; }

    public LocalDateTime getDateSubmitted() { return dateSubmitted; }
    public void setDateSubmitted(LocalDateTime dateSubmitted) { this.dateSubmitted = dateSubmitted; }

    public LocalDateTime getCompletionDate() { return completionDate; }
    public void setCompletionDate(LocalDateTime completionDate) { this.completionDate = completionDate; }

    public Long getParentRequestId() { return parentRequestId; }
    public void setParentRequestId(Long parentRequestId) { this.parentRequestId = parentRequestId; }
}
