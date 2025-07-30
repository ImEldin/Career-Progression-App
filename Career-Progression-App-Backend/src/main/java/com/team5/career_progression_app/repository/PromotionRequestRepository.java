package com.team5.career_progression_app.repository;

import com.team5.career_progression_app.model.PromotionRequest;
import com.team5.career_progression_app.model.PromotionStatus;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PromotionRequestRepository extends JpaRepository<PromotionRequest, Integer> {
    List<PromotionRequest> findByUserId(Integer userId);
    List<PromotionRequest> findByStatus(PromotionStatus status);
    List<PromotionRequest> findByStatusOrderByCreatedAtDesc(PromotionStatus status);
}