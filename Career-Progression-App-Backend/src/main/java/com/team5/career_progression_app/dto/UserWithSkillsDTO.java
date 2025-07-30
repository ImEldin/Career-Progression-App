package com.team5.career_progression_app.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class UserWithSkillsDTO {
    private UserDTO user;
    private List<UserSkillDTO> skills;

    public UserWithSkillsDTO(UserDTO user, List<UserSkillDTO> skills) {
        this.user = user;
        this.skills = skills;
    }
}