package com.example.maintenance.model;

public class AnalyticsResponse {

    private long totalOpen;
    private long urgentCount;
    private double avgResolutionDays;
    private long completedThisMonth;
    private double technicianAvgWorkload;

    public AnalyticsResponse(long totalOpen, long urgentCount, double avgResolutionDays,
                              long completedThisMonth, double technicianAvgWorkload) {
        this.totalOpen = totalOpen;
        this.urgentCount = urgentCount;
        this.avgResolutionDays = avgResolutionDays;
        this.completedThisMonth = completedThisMonth;
        this.technicianAvgWorkload = technicianAvgWorkload;
    }

    public long getTotalOpen() { return totalOpen; }
    public long getUrgentCount() { return urgentCount; }
    public double getAvgResolutionDays() { return avgResolutionDays; }
    public long getCompletedThisMonth() { return completedThisMonth; }
    public double getTechnicianAvgWorkload() { return technicianAvgWorkload; }
}
