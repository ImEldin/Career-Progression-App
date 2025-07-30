package com.team5.career_progression_app.dto;

import com.team5.career_progression_app.model.Tag;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class TagDTO {
    private Integer id;
    private String name;

    public TagDTO(Tag tag) {
        this.id = tag.getId();
        this.name = tag.getName();
    }

    public TagDTO(Integer id, String name) {
        this.id = id;
        this.name = name;
    }
}