package com.example.maintenance.repository;

import com.example.maintenance.model.Role;
import com.example.maintenance.model.User;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicLong;

@Repository
public class UserRepository {

    private final List<User> users = new ArrayList<>();
    private final AtomicLong idCounter = new AtomicLong(7);

    public UserRepository() {
        User tenant = new User(1L, "Kevin Lu", "tenant@demo.com", "password", Role.TENANT);
        tenant.setApartmentNumber("304");
        tenant.setLeaseStart(LocalDate.of(2024, 1, 1));
        tenant.setLeaseEnd(LocalDate.of(2026, 12, 31));
        users.add(tenant);

        User staff = new User(2L, "John Smith", "maintenance@demo.com", "password", Role.STAFF);
        staff.setSkillType("Plumbing");
        staff.setAvailable(true);
        users.add(staff);

        User staff2 = new User(4L, "Jane Doe", "jane@demo.com", "password", Role.STAFF);
        staff2.setSkillType("Electrical");
        staff2.setAvailable(true);
        users.add(staff2);

        User staff3 = new User(5L, "Carlos Rivera", "carlos@demo.com", "password", Role.STAFF);
        staff3.setSkillType("HVAC");
        staff3.setAvailable(true);
        users.add(staff3);

        User admin = new User(6L, "Michael Chen", "admin@demo.com", "password", Role.ADMIN);
        users.add(admin);
    }

    public List<User> findAll() {
        return users;
    }

    public Optional<User> findById(Long id) {
        return users.stream().filter(u -> u.getId().equals(id)).findFirst();
    }

    public Optional<User> findByEmail(String email) {
        return users.stream().filter(u -> u.getEmail().equalsIgnoreCase(email)).findFirst();
    }

    public List<User> findByRole(Role role) {
        List<User> result = new ArrayList<>();
        for (User u : users) {
            if (u.getRole() == role) result.add(u);
        }
        return result;
    }

    public User save(User user) {
        if (user.getId() == null) {
            user.setId(idCounter.getAndIncrement());
            users.add(user);
        } else {
            for (int i = 0; i < users.size(); i++) {
                if (users.get(i).getId().equals(user.getId())) {
                    users.set(i, user);
                    return user;
                }
            }
            users.add(user);
        }
        return user;
    }
}
