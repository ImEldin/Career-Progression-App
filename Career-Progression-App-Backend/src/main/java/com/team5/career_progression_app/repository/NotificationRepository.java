package com.team5.career_progression_app.repository;

import com.team5.career_progression_app.model.Notification;
import com.team5.career_progression_app.model.NotificationType;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Integer> {
    List<Notification> findByRecipientIdOrderByCreatedAtDesc(Integer userId);
    List<Notification> findByRecipientIdAndReadFalseOrderByCreatedAtDesc(Integer userId);
    List<Notification> findByRecipientIdAndTypeOrderByCreatedAtDesc(Integer userId, NotificationType type);
    Integer countByRecipientId(Integer userId);
    Integer countByRecipientIdAndReadFalse(Integer userId);
    Integer countByRecipientIdAndType(Integer userId, NotificationType type);
}
