package com.team5.career_progression_app.service;

import com.team5.career_progression_app.dto.ReviewDTO;
import com.team5.career_progression_app.exception.ResourceNotFoundException;
import com.team5.career_progression_app.exception.UnauthorizedException;
import com.team5.career_progression_app.model.*;
import com.team5.career_progression_app.repository.ReviewRepository;
import com.team5.career_progression_app.repository.TeamRepository;
import com.team5.career_progression_app.repository.UserRepository;

import lombok.AllArgsConstructor;

import org.springframework.stereotype.Service;

import java.util.List;

@AllArgsConstructor
@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;
    private final TeamRepository teamRepository;

    public List<ReviewDTO> getReviewsByUserId(Integer userId) {
        List<Review> reviews = reviewRepository.findByUserId(userId);
        return reviews.stream()
                .map(ReviewDTO::new).toList();
    }

    public List<ReviewDTO> getReviewsByReviewerId(Integer reviewerId) {
        List<Review> reviews = reviewRepository.findByReviewerId(reviewerId);
        return reviews.stream()
                .map(ReviewDTO::new).toList();
    }

    public ReviewDTO createReview(ReviewDTO reviewDTO, Integer reviewerId) {
        User user = userRepository.findById(reviewDTO.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + reviewDTO.getUserId()));
        
        User reviewer = userRepository.findById(reviewerId)
                .orElseThrow(() -> new ResourceNotFoundException("Reviewer not found with id: " + reviewerId));

        boolean isAuthorized = teamRepository.existsByLeadIdAndMembershipsUser(reviewerId, user);
        
        if (!isAuthorized) {
            throw new UnauthorizedException("You are not authorized to review this user");
        }

        Review review = new Review();
        review.setFeedback(reviewDTO.getFeedback());
        review.setUser(user);
        review.setReviewer(reviewer);

        Review savedReview = reviewRepository.save(review);
        return new ReviewDTO(savedReview);
    }
}