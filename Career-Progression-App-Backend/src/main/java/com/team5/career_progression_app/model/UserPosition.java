package com.team5.career_progression_app.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "UserPosition")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserPosition {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "position_id", nullable = false)
    private Position position;

    @ManyToOne
    @JoinColumn(name = "position_level_id", nullable = false)
    private PositionLevel positionLevel;

    @Override
    public String toString() {
        return "UserPosition{" +
                "id=" + id +
                ", userId=" + user.getId() +
                ", positionId=" + position.getId() +
                ", positionLevel=" + positionLevel.getLevel() +
                '}';
    }
}
