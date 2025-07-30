package com.team5.career_progression_app.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Entity
@Table(name = "Role")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Role {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "name", unique = true)
    private String name;

    @OneToMany(mappedBy = "role")
    private List<User> usersWithRole;

    @OneToMany(mappedBy = "role", fetch = FetchType.EAGER)
    private List<RolePermission> rolePermissions;

    public Set<Permission> getPermissions() {
        return rolePermissions.stream()
                .map(RolePermission::getPermission)
                .collect(Collectors.toSet());
    }

    @Override
    public String toString() {
        return "Role{" +
                "id=" + id +
                ", name='" + name + '\'' +
                '}';
    }
}