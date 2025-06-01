package com.jankovic.fastfood.controller;

import com.jankovic.fastfood.entity.MenuItem;
import com.jankovic.fastfood.entity.Review;
import com.jankovic.fastfood.entity.User;
import com.jankovic.fastfood.repository.MenuItemRepository;
import com.jankovic.fastfood.repository.ReviewRepository;
import com.jankovic.fastfood.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = {"http://localhost:3000", "http://192.168.8.139:3000"}, allowCredentials = "true")
public class ReviewController {

    @Autowired
    private ReviewRepository reviewRepo;
    @Autowired
    private UserRepository userRepo;
    @Autowired
    private MenuItemRepository menuItemRepo;

    @PostMapping
    public ResponseEntity<?> addReview(@RequestBody Review review) {
        Optional<User> userOpt = userRepo.findById(review.getUser().getId());
        Optional<MenuItem> itemOpt = menuItemRepo.findById(review.getMenuItem().getId());
        if (userOpt.isEmpty() || itemOpt.isEmpty()) return ResponseEntity.badRequest().body("Nevalidni podaci");
        review.setUser(userOpt.get());
        review.setMenuItem(itemOpt.get());
        review.setCreatedAt(LocalDateTime.now());
        return ResponseEntity.ok(reviewRepo.save(review));
    }

    @GetMapping("/menu-item/{menuItemId}")
    public ResponseEntity<List<Review>> getReviewsForMenuItem(@PathVariable Long menuItemId) {
        return ResponseEntity.ok(reviewRepo.findByMenuItemId(menuItemId));
    }
}
