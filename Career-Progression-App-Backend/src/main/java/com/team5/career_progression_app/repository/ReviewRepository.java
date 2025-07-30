package com.team5.career_progression_app.repository;

import com.team5.career_progression_app.model.Review;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Integer> {
    List<Review> findByUserId(Integer userId);
    List<Review> findByReviewerId(Integer reviewerId);
    List<Review> findByUserIdAndReviewerId(Integer userId, Integer reviewerId);
}
