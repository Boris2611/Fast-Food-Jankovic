package com.jankovic.fastfood.service;

import com.jankovic.fastfood.entity.Review;
import com.jankovic.fastfood.repository.ReviewRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;

    public ReviewService(ReviewRepository reviewRepository) {
        this.reviewRepository = reviewRepository;
    }

    public Review addReview(Review review) {
        review.setCreatedAt(LocalDateTime.now());
        return reviewRepository.save(review);
    }

    public List<Review> getByMenuItem(Long menuItemId) {
        return reviewRepository.findByMenuItemId(menuItemId);
    }
}
