package com.team5.career_progression_app.service;

import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.models.chat.completions.ChatCompletionCreateParams;
import org.springframework.stereotype.Service;

@Service
public class OpenAIService {
    OpenAIClient client = OpenAIOkHttpClient.builder()
    // Configures using the OPENAI_API_KEY, OPENAI_ORG_ID, OPENAI_PROJECT_ID and OPENAI_BASE_URL environment variables
    .fromEnv()
    .apiKey("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")
    .build();

    public String prompt(String baseMessage, String userRequest) {
        ChatCompletionCreateParams.Builder createParamsBuilder =
                ChatCompletionCreateParams.builder()
                        .model("gpt-4.1-mini")
                        .maxCompletionTokens(8192);

        ChatCompletionCreateParams createParams = createParamsBuilder
                .addSystemMessage(baseMessage)
                .addUserMessage(userRequest)
                .build();

        StringBuilder prompt = new StringBuilder();

        client.chat().completions().create(createParams).choices().stream()
                .flatMap(choice -> choice.message().content().stream())
                .forEach(prompt::append);

        return prompt.toString();
    }

    public String generateAnalysis(String prompt) {
        ChatCompletionCreateParams.Builder createParamsBuilder =
                ChatCompletionCreateParams.builder()
                        .model("gpt-4.1-mini")
                        .maxCompletionTokens(8192);

        ChatCompletionCreateParams createParams = createParamsBuilder
                .addSystemMessage("You are an HR assistant analyzing employee promotion requests. Provide comprehensive, professional analysis with clear recommendations.")
                .addUserMessage(prompt)
                .build();

        StringBuilder response = new StringBuilder();

        client.chat().completions().create(createParams).choices().stream()
                .flatMap(choice -> choice.message().content().stream())
                .forEach(response::append);

        return response.toString();
    }
} 