package com.jankovic.fastfood.controller;

import com.jankovic.fastfood.entity.User;
import com.jankovic.fastfood.security.JwtUtil;
import com.jankovic.fastfood.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/user")
@CrossOrigin(origins = {"http://localhost:3000", "http://192.168.8.139:3000"}, allowCredentials = "true")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @GetMapping("/me")
    public ResponseEntity<?> getLoggedInUser(HttpServletRequest request) {
        String token = request.getHeader("Authorization");
        if (token == null || !token.startsWith("Bearer ")) {
            return ResponseEntity.status(401).body("Token nedostaje ili je neispravan");
        }

        token = token.substring(7);

        if (!jwtUtil.validateToken(token)) {
            return ResponseEntity.status(401).body("Token nije validan");
        }

        String email = jwtUtil.extractEmail(token);
        Optional<User> user = userService.findByEmail(email);

        if (user.isPresent()) {
            return ResponseEntity.ok(user.get());
        } else {
            return ResponseEntity.status(404).body("Korisnik nije pronađen");
        }
    }
}
