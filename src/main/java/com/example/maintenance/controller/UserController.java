package com.example.maintenance.controller;

import com.example.maintenance.model.Role;
import com.example.maintenance.model.User;
import com.example.maintenance.model.UserResponse;
import com.example.maintenance.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // GET /api/users
    @GetMapping
    public List<UserResponse> getAllUsers() {
        List<UserResponse> result = new ArrayList<>();
        for (User u : userService.getAll()) result.add(UserResponse.from(u));
        return result;
    }

    // GET /api/users/{id}
    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getUserById(@PathVariable Long id) {
        return userService.getById(id)
                .map(u -> ResponseEntity.ok(UserResponse.from(u)))
                .orElse(ResponseEntity.notFound().build());
    }

    // GET /api/users/role/{role}
    @GetMapping("/role/{role}")
    public List<UserResponse> getUsersByRole(@PathVariable String role) {
        List<UserResponse> result = new ArrayList<>();
        for (User u : userService.getByRole(Role.valueOf(role.toUpperCase()))) {
            result.add(UserResponse.from(u));
        }
        return result;
    }

    // POST /api/users
    @PostMapping
    public ResponseEntity<UserResponse> createUser(@RequestBody User user) {
        return ResponseEntity.ok(UserResponse.from(userService.save(user)));
    }
}
