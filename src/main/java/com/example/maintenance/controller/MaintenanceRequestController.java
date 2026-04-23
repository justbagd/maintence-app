package com.example.maintenance.controller;

import com.example.maintenance.model.MaintenanceRequest;
import com.example.maintenance.service.MaintenanceRequestService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/requests")
public class MaintenanceRequestController {

    private final MaintenanceRequestService requestService;

    public MaintenanceRequestController(MaintenanceRequestService requestService) {
        this.requestService = requestService;
    }

    // GET /api/requests
    @GetMapping
    public List<MaintenanceRequest> getAllRequests() {
        return requestService.getAll();
    }

    // GET /api/requests/{id}
    @GetMapping("/{id}")
    public ResponseEntity<MaintenanceRequest> getRequestById(@PathVariable Long id) {
        return requestService.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // GET /api/requests/tenant/{tenantId}
    @GetMapping("/tenant/{tenantId}")
    public List<MaintenanceRequest> getRequestsByTenant(@PathVariable Long tenantId) {
        return requestService.getByTenant(tenantId);
    }

    // GET /api/requests/staff/{staffId}
    @GetMapping("/staff/{staffId}")
    public List<MaintenanceRequest> getRequestsByStaff(@PathVariable Long staffId) {
        return requestService.getByStaff(staffId);
    }

    // POST /api/requests
    @PostMapping
    public ResponseEntity<MaintenanceRequest> createRequest(@RequestBody MaintenanceRequest request) {
        return ResponseEntity.ok(requestService.submit(request));
    }

    // POST /api/requests/{id}/status
    @PostMapping("/{id}/status")
    public ResponseEntity<MaintenanceRequest> updateStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        return ResponseEntity.ok(requestService.updateStatus(id, status));
    }

    // POST /api/requests/{id}/assign
    @PostMapping("/{id}/assign")
    public ResponseEntity<MaintenanceRequest> assignStaff(
            @PathVariable Long id,
            @RequestParam Long staffId) {
        return ResponseEntity.ok(requestService.assignStaff(id, staffId));
    }

    // POST /api/requests/{id}/priority
    @PostMapping("/{id}/priority")
    public ResponseEntity<MaintenanceRequest> updatePriority(
            @PathVariable Long id,
            @RequestParam String priority) {
        return ResponseEntity.ok(requestService.updatePriority(id, priority));
    }

    // POST /api/requests/{id}/reopen
    @PostMapping("/{id}/reopen")
    public ResponseEntity<MaintenanceRequest> reopenRequest(@PathVariable Long id) {
        return ResponseEntity.ok(requestService.reopen(id));
    }

    // POST /api/requests/{id}/cancel
    @PostMapping("/{id}/cancel")
    public ResponseEntity<MaintenanceRequest> cancelRequest(@PathVariable Long id) {
        return ResponseEntity.ok(requestService.cancel(id));
    }
}
