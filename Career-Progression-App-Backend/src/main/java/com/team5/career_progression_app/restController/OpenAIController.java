package com.team5.career_progression_app.restController;

import com.team5.career_progression_app.dto.PromptRequestDTO;
import com.team5.career_progression_app.service.OpenAIService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/v1/openai")
public class OpenAIController {

    private final OpenAIService openAIService;

    public OpenAIController(OpenAIService openAIService) {
        this.openAIService = openAIService;
    }

    @PostMapping("/prompt")
    public String getPrompt(@RequestBody PromptRequestDTO request) {
        return openAIService.prompt(request.getBaseMessage(), request.getUserRequest());
    }
} 