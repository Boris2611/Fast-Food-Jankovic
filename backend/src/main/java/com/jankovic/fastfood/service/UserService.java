package com.jankovic.fastfood.service;

import com.jankovic.fastfood.entity.User;
import com.jankovic.fastfood.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public User register(User user) {
        if (user.getRole() == null || user.getRole().isEmpty()) {
            user.setRole("KUPAC");  // default rola
        }
        // Šifrujemo lozinku
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setVerified(false);
        return userRepository.save(user);
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }
}
