package com.team5.career_progression_app.dto;

import com.team5.career_progression_app.model.TaskComment;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class TaskCommentDTO {
    private Integer id;
    private String message;
    private LocalDateTime createdAt;
    private Integer taskId;
    private String taskTitle;
    private Integer authorId;
    private String authorName;

    public TaskCommentDTO(TaskComment comment) {
        this.id = comment.getId();
        this.message = comment.getMessage();
        this.createdAt = comment.getCreatedAt();
        this.taskId = comment.getTask().getId();
        this.taskTitle = comment.getTask().getTitle();
        this.authorId = comment.getAuthor().getId();
        this.authorName = comment.getAuthor().getFirstName() + " " + comment.getAuthor().getLastName();
    }
}