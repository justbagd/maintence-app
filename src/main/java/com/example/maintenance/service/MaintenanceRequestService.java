package com.example.maintenance.service;

import com.example.maintenance.model.*;
import com.example.maintenance.repository.MaintenanceRequestRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class MaintenanceRequestService {

    private final MaintenanceRequestRepository requestRepository;
    private final NotificationService notificationService;
    private final SseService sseService;

    public MaintenanceRequestService(MaintenanceRequestRepository requestRepository,
                                     NotificationService notificationService,
                                     SseService sseService) {
        this.requestRepository = requestRepository;
        this.notificationService = notificationService;
        this.sseService = sseService;
    }

    private String ev(String type, Long id) {
        return "{\"type\":\"" + type + "\",\"requestId\":" + id + "}";
    }

    public MaintenanceRequest submit(MaintenanceRequest request) {
        request.setStatus(Status.PENDING);
        request.setDateSubmitted(LocalDateTime.now());
        MaintenanceRequest saved = requestRepository.save(request);
        notificationService.create(
                saved.getTenantId(),
                saved.getRequestId(),
                "Your maintenance request has been submitted successfully."
        );
        sseService.broadcast("request-created", ev("request-created", saved.getRequestId()));
        return saved;
    }

    public MaintenanceRequest assignStaff(Long requestId, Long staffId) {
        MaintenanceRequest request = requestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found with id: " + requestId));
        request.setAssignedStaffId(staffId);
        request.setStatus(Status.ASSIGNED);
        MaintenanceRequest saved = requestRepository.save(request);
        notificationService.create(
                saved.getTenantId(),
                saved.getRequestId(),
                "Your request has been assigned to a technician."
        );
        sseService.broadcast("request-assigned", ev("request-assigned", saved.getRequestId()));
        return saved;
    }

    public MaintenanceRequest updateStatus(Long requestId, String statusStr) {
        MaintenanceRequest request = requestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found with id: " + requestId));
        Status newStatus = Status.valueOf(statusStr.toUpperCase());
        request.setStatus(newStatus);
        if (newStatus == Status.COMPLETED) {
            request.setCompletionDate(LocalDateTime.now());
            notificationService.create(
                    request.getTenantId(),
                    request.getRequestId(),
                    "Your maintenance request has been completed."
            );
        } else {
            notificationService.create(
                    request.getTenantId(),
                    request.getRequestId(),
                    "Your request status has been updated to: " + newStatus
            );
        }
        MaintenanceRequest result = requestRepository.save(request);
        sseService.broadcast("status-updated", ev("status-updated", result.getRequestId()));
        return result;
    }

    public MaintenanceRequest updatePriority(Long requestId, String priorityStr) {
        MaintenanceRequest request = requestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found with id: " + requestId));
        request.setPriority(Priority.valueOf(priorityStr.toUpperCase()));
        MaintenanceRequest result = requestRepository.save(request);
        sseService.broadcast("priority-updated", ev("priority-updated", result.getRequestId()));
        return result;
    }

    public MaintenanceRequest reopen(Long requestId) {
        MaintenanceRequest original = requestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found with id: " + requestId));
        MaintenanceRequest reopened = new MaintenanceRequest();
        reopened.setTenantId(original.getTenantId());
        reopened.setCategory(original.getCategory());
        reopened.setLocationInUnit(original.getLocationInUnit());
        reopened.setDescription(original.getDescription());
        reopened.setPriority(original.getPriority());
        reopened.setPhotoUrl(original.getPhotoUrl());
        reopened.setPreferredDate(original.getPreferredDate());
        reopened.setPreferredTime(original.getPreferredTime());
        reopened.setAllowEntry(original.isAllowEntry());
        reopened.setStatus(Status.PENDING);
        reopened.setDateSubmitted(LocalDateTime.now());
        reopened.setParentRequestId(original.getRequestId());
        MaintenanceRequest saved = requestRepository.save(reopened);
        notificationService.create(
                saved.getTenantId(),
                saved.getRequestId(),
                "Your request has been reopened and is pending review."
        );
        sseService.broadcast("request-created", ev("request-created", saved.getRequestId()));
        return saved;
    }

    public MaintenanceRequest cancel(Long requestId) {
        MaintenanceRequest request = requestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found with id: " + requestId));
        if (request.getStatus() == Status.COMPLETED || request.getStatus() == Status.ARCHIVED || request.getStatus() == Status.CANCELLED) {
            throw new RuntimeException("Cannot cancel a request with status: " + request.getStatus());
        }
        request.setStatus(Status.CANCELLED);
        MaintenanceRequest saved = requestRepository.save(request);
        notificationService.create(
                saved.getTenantId(),
                saved.getRequestId(),
                "Your maintenance request has been cancelled."
        );
        sseService.broadcast("request-updated", ev("request-updated", saved.getRequestId()));
        return saved;
    }

    public List<MaintenanceRequest> getAll() {
        return requestRepository.findAll();
    }

    public Optional<MaintenanceRequest> getById(Long id) {
        return requestRepository.findById(id);
    }

    public List<MaintenanceRequest> getByTenant(Long tenantId) {
        return requestRepository.findByTenantId(tenantId);
    }

    public List<MaintenanceRequest> getByStaff(Long staffId) {
        return requestRepository.findByAssignedStaffId(staffId);
    }
}
