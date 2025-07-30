package com.team5.career_progression_app.service;

import com.team5.career_progression_app.dto.TemplateDTO;
import com.team5.career_progression_app.dto.AiGenerateTemplateRequestDTO;
import com.team5.career_progression_app.dto.AiGeneratedTemplateDTO;

import java.util.List;

public interface TemplateService {
    TemplateDTO createTemplate(TemplateDTO templateDTO);
    TemplateDTO updateTemplate(TemplateDTO templateDTO);
    List<TemplateDTO> getAllTemplates();
    TemplateDTO getTemplateById(int id);
    AiGeneratedTemplateDTO generateTemplateWithAI(AiGenerateTemplateRequestDTO request) throws Exception;
}
