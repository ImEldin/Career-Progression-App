package com.team5.career_progression_app.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "OnDemandReport")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OnDemandReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "data")
    private String data;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @ManyToOne
    @JoinColumn(name = "recipient_id")
    private User recipient;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    @Override
    public String toString() {
        return "OnDemandReport{" +
                "id=" + id +
                ", data='" + data + '\'' +
                ", createdAt=" + createdAt +
                ", recipientId=" + recipient.getId() +
                '}';
    }
}
