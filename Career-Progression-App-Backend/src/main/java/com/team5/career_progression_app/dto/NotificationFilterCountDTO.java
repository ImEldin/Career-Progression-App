package com.team5.career_progression_app.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class NotificationFilterCountDTO {
    private String filter;
    private Integer count;
}
