package com.team5.career_progression_app.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "Users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "last_name")
    private String lastName;

    @Column(name = "email")
    private String email;

    @Column(name = "active")
    private boolean active;

    @Column(name = "profile_picture_url")
    private String profilePictureUrl;

    @ManyToOne
    @JoinColumn(name = "role_id")
    private Role role;

    @OneToMany(mappedBy = "user")
    private List<Review> reviews;

    @OneToMany(mappedBy = "recipient")
    private List<OnDemandReport> receivedReports;

    @OneToMany(mappedBy = "recipient")
    private List<Notification> notifications;

    @OneToMany(mappedBy = "user")
    private List<PromotionRequest> promotionRequests;

    @OneToMany(mappedBy = "lead")
    private List<Team> teams;

    @OneToMany(mappedBy = "user")
    private List<TeamMembership> teamMemberships;

    @OneToMany(mappedBy = "user")
    private List<UserPosition> userPositions;

    @OneToMany(mappedBy = "assignedTo")
    private List<Task> assignedTasks;

    @OneToMany(mappedBy = "user")
    private List<TaskComment> comments;

    @OneToMany(mappedBy = "author")
    private List<TaskComment> taskComments;

    @OneToMany(mappedBy = "user")
    private List<UserSkill> userSkills;

    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", firstName='" + firstName + '\'' +
                ", lastName='" + lastName + '\'' +
                ", email='" + email + '\'' +
                ", role=" + role.getId() +
                '}';
    }

    public User(Integer id) {
        this.id = id;
    }
}
