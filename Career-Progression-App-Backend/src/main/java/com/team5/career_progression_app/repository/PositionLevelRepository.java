package com.team5.career_progression_app.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.team5.career_progression_app.model.PositionLevel;

public interface PositionLevelRepository extends JpaRepository<PositionLevel, Integer> {
    Optional<PositionLevel> findByLevelAndPositionId(Integer level, Integer positionId);
}