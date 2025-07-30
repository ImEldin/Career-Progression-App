package com.team5.career_progression_app.dto;

import com.team5.career_progression_app.model.User;
import lombok.*;
import java.util.List;

@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {
    private Integer id;
    private String firstName;
    private String lastName;
    private String email;
    private String roleName;
    private boolean active;
    private String profilePictureUrl;
    private List<String> teamNames;
    private List<UserSkillDTO> skills;
    private RoleDTO role;

    public UserDTO(User user) {
        this.id = user.getId();
        this.firstName = user.getFirstName();
        this.lastName = user.getLastName();
        this.email = user.getEmail();
        this.roleName = user.getRole() != null ? user.getRole().getName() : null;
        this.active = user.isActive();
        this.profilePictureUrl = user.getProfilePictureUrl();
        this.teamNames = user.getTeamMemberships()
                .stream()
                .map(membership -> membership.getTeam().getName())
                .toList();
        this.skills = user.getUserSkills()
                .stream()
                .map(UserSkillDTO::new)
                .toList();
        if (user.getRole() != null) {
            this.role = new RoleDTO(user.getRole());
        } else {
            this.role = new RoleDTO(null, "NO_ROLE", List.of());
        }
    }
}
