package com.example.maintenance.repository;

import com.example.maintenance.model.*;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicLong;

@Repository
public class MaintenanceRequestRepository {

    private final List<MaintenanceRequest> requests = new ArrayList<>();
    private final AtomicLong idCounter = new AtomicLong(1);

    public MaintenanceRequestRepository() {
    }

    public List<MaintenanceRequest> findAll() {
        return requests;
    }

    public Optional<MaintenanceRequest> findById(Long id) {
        return requests.stream().filter(r -> r.getRequestId().equals(id)).findFirst();
    }

    public List<MaintenanceRequest> findByTenantId(Long tenantId) {
        List<MaintenanceRequest> result = new ArrayList<>();
        for (MaintenanceRequest r : requests) {
            if (r.getTenantId().equals(tenantId)) result.add(r);
        }
        return result;
    }

    public List<MaintenanceRequest> findByAssignedStaffId(Long staffId) {
        List<MaintenanceRequest> result = new ArrayList<>();
        for (MaintenanceRequest r : requests) {
            if (staffId.equals(r.getAssignedStaffId())) result.add(r);
        }
        return result;
    }

    public List<MaintenanceRequest> findByStatus(Status status) {
        List<MaintenanceRequest> result = new ArrayList<>();
        for (MaintenanceRequest r : requests) {
            if (r.getStatus() == status) result.add(r);
        }
        return result;
    }

    public MaintenanceRequest save(MaintenanceRequest request) {
        if (request.getRequestId() == null) {
            request.setRequestId(idCounter.getAndIncrement());
            requests.add(request);
        } else {
            for (int i = 0; i < requests.size(); i++) {
                if (requests.get(i).getRequestId().equals(request.getRequestId())) {
                    requests.set(i, request);
                    return request;
                }
            }
            requests.add(request);
        }
        return request;
    }
}
