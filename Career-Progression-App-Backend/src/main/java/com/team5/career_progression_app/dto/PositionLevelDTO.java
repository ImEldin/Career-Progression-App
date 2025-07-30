package com.team5.career_progression_app.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PositionLevelDTO {
    private Integer id;
    private Integer level;
    private Integer positionId;
}
