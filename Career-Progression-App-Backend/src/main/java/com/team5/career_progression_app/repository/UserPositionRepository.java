package com.team5.career_progression_app.repository;

import com.team5.career_progression_app.model.UserPosition;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface UserPositionRepository extends JpaRepository<UserPosition, Integer> {
    List<UserPosition> findByUserId(Integer userId);
}
