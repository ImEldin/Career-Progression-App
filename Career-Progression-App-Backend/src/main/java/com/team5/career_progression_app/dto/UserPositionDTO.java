package com.team5.career_progression_app.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserPositionDTO {
    private Integer userId;
    private Integer positionId;
    private Integer currentLevel;
    private Integer nextLevel;
    private String description;
    private String nextDescription;
}
