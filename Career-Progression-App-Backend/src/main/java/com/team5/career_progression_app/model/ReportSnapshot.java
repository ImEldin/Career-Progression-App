package com.team5.career_progression_app.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "ReportSnapshot")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ReportSnapshot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "report_data")
    private String reportData;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    @Override
    public String toString() {
        return "ReportSnapshot{" +
                "id=" + id +
                ", createdAt=" + createdAt +
                ", reportData='" + reportData + '\'' +
                '}';
    }
}
