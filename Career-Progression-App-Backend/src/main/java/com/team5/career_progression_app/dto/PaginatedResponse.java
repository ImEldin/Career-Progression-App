package com.team5.career_progression_app.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class PaginatedResponse<T> {
    private List<T> data;
    private int totalCount;
    private int page;
    private int size;
    private int totalPages;
}