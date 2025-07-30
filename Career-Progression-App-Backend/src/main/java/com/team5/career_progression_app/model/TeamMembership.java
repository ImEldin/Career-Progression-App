package com.team5.career_progression_app.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "TeamMembership")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TeamMembership {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "team_id")
    private Team team;

    public TeamMembership(Team team, User user) {
        this.team = team;
        this.user = user;
    }

    @Override
    public String toString() {
        return "TeamMembership{" +
                "id=" + id +
                ", userId=" + user.getId() +
                ", teamId=" + team.getId() +
                '}';
    }
}
