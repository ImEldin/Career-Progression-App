package com.team5.career_progression_app.restController;

import com.team5.career_progression_app.dto.ReviewDTO;
import com.team5.career_progression_app.service.ReviewService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/reviews")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @GetMapping("/user/{userId}")
    public List<ReviewDTO> getReviewsByUserId(@PathVariable Integer userId) {
        return reviewService.getReviewsByUserId(userId);
    }

    @GetMapping("/reviewer/{reviewerId}")
    public List<ReviewDTO> getReviewsByReviewerId(@PathVariable Integer reviewerId) {
        return reviewService.getReviewsByReviewerId(reviewerId);
    }

    @PostMapping
    public ResponseEntity<ReviewDTO> createReview(
            @RequestBody ReviewDTO reviewDTO,
            @RequestParam Integer reviewerId) {
        return new ResponseEntity<>(
                reviewService.createReview(reviewDTO, reviewerId), 
                HttpStatus.CREATED);
    }
}