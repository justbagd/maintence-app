package com.example.maintenance.service;

import com.example.maintenance.model.Role;
import com.example.maintenance.model.User;
import com.example.maintenance.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<User> getAll() {
        return userRepository.findAll();
    }

    public Optional<User> getById(Long id) {
        return userRepository.findById(id);
    }

    public List<User> getByRole(Role role) {
        return userRepository.findByRole(role);
    }

    public User save(User user) {
        return userRepository.save(user);
    }
}
