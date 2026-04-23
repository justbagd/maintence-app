package com.example.maintenance.service;

import com.example.maintenance.model.User;
import com.example.maintenance.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;

    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User login(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));
        if (!user.getPassword().equals(password)) {
            throw new RuntimeException("Invalid credentials");
        }
        return user;
    }

    public User register(User user) {
        boolean emailTaken = userRepository.findByEmail(user.getEmail()).isPresent();
        if (emailTaken) {
            throw new RuntimeException("Email is already in use: " + user.getEmail());
        }
        return userRepository.save(user);
    }
}
