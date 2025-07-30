package com.team5.career_progression_app.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "PositionLevel", uniqueConstraints = @UniqueConstraint(columnNames = {"level", "position_id"}))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PositionLevel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "level", nullable = false)
    private Integer level;

    @Column(name = "description")
    private String description;

    @ManyToOne
    @JoinColumn(name = "position_id", nullable = false)
    private Position position;

    @OneToMany(mappedBy = "positionLevel")
    private List<UserPosition> userPositions;

    @Override
    public String toString() {
        return "PositionLevel{" +
                "id=" + id +
                ", level=" + level +
                ", description='" + description + '\'' +
                ", positionId=" + position.getId() +
                '}';
    }
}
