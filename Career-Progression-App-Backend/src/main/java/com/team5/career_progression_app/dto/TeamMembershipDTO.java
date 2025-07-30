package com.team5.career_progression_app.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TeamMembershipDTO {
    private Long id;
    private Integer userId;
    private Integer teamId;
    private UserDTO user;
    private TeamDTO team;
}