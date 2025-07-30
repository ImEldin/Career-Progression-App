package com.team5.career_progression_app.dto;

import com.team5.career_progression_app.model.Team;
import com.team5.career_progression_app.model.TeamMembership;
import com.team5.career_progression_app.model.User;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TeamDTO {
    private Integer id;
    @NotBlank(message = "Team name must not be blank")
    private String name;
    @NotNull(message = "Lead ID must not be null")
    private Integer leadId;
    private String leadName;
    private List<UserDTO> members;

    public TeamDTO(Integer id, String name, Integer leadId) {
        this.id = id;
        this.name = name;
        this.leadId = leadId;
    }

    public TeamDTO(Team team) {
        this.id = team.getId();
        this.name = team.getName();
        this.leadId = team.getLead().getId();
        this.leadName = team.getLead().getFirstName() + " " + team.getLead().getLastName();
        this.members = new ArrayList<>();
        this.members.add(new UserDTO(team.getLead()));
        if (team.getMemberships() != null) {
            for (TeamMembership membership : team.getMemberships()) {
                User member = membership.getUser();
                this.members.add(new UserDTO(member));
            }
        }
    }
}