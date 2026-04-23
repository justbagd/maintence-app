package com.example.maintenance.controller;

import com.example.maintenance.model.*;
import com.example.maintenance.service.MaintenanceRequestService;
import com.example.maintenance.service.UserService;
import org.springframework.web.bind.annotation.*;

import java.time.temporal.ChronoUnit;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final MaintenanceRequestService requestService;
    private final UserService userService;

    public AdminController(MaintenanceRequestService requestService, UserService userService) {
        this.requestService = requestService;
        this.userService = userService;
    }

    // GET /api/admin/analytics
    @GetMapping("/analytics")
    public AnalyticsResponse getAnalytics() {
        List<MaintenanceRequest> all = requestService.getAll();

        long totalOpen = all.stream()
                .filter(r -> r.getStatus() == Status.PENDING
                        || r.getStatus() == Status.ASSIGNED
                        || r.getStatus() == Status.IN_PROGRESS)
                .count();

        long urgentCount = all.stream()
                .filter(r -> r.getPriority() == Priority.URGENT)
                .count();

        List<MaintenanceRequest> completed = all.stream()
                .filter(r -> r.getStatus() == Status.COMPLETED
                        && r.getCompletionDate() != null
                        && r.getDateSubmitted() != null)
                .toList();

        double avgResolutionDays = completed.isEmpty() ? 0.0 :
                completed.stream()
                        .mapToLong(r -> ChronoUnit.HOURS.between(r.getDateSubmitted(), r.getCompletionDate()))
                        .average()
                        .orElse(0.0) / 24.0;

        LocalDateTime now = LocalDateTime.now();
        long completedThisMonth = completed.stream()
                .filter(r -> r.getCompletionDate().getYear() == now.getYear()
                        && r.getCompletionDate().getMonth() == now.getMonth())
                .count();

        List<User> staff = userService.getByRole(Role.STAFF);
        double technicianAvgWorkload = staff.isEmpty() ? 0.0 : (double) totalOpen / staff.size();

        return new AnalyticsResponse(totalOpen, urgentCount, avgResolutionDays,
                completedThisMonth, technicianAvgWorkload);
    }

    // GET /api/admin/technicians
    @GetMapping("/technicians")
    public List<TechnicianWorkload> getTechnicians() {
        List<User> staff = userService.getByRole(Role.STAFF);
        List<MaintenanceRequest> all = requestService.getAll();

        List<TechnicianWorkload> result = new ArrayList<>();
        for (User technician : staff) {
            long activeCount = all.stream()
                    .filter(r -> technician.getId().equals(r.getAssignedStaffId())
                            && r.getStatus() != Status.COMPLETED
                            && r.getStatus() != Status.ARCHIVED)
                    .count();
            result.add(new TechnicianWorkload(UserResponse.from(technician), activeCount));
        }
        return result;
    }
}
