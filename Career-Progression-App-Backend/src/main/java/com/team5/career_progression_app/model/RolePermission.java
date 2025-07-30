package com.team5.career_progression_app.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "RolePermission")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RolePermission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "role_id", nullable = false)
    private Role role;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "permission_id", nullable = false)
    private Permission permission;

    @Override
    public String toString() {
        return "RolePermission{" +
                "id=" + id +
                ", roleId=" + (role != null ? role.getId() : "null") +
                ", permissionId=" + (permission != null ? permission.getId() : "null") +
                '}';
    }
}