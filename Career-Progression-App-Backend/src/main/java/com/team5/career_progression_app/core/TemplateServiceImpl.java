package com.team5.career_progression_app.core;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.team5.career_progression_app.dto.AiGenerateTemplateRequestDTO;
import com.team5.career_progression_app.dto.AiGeneratedTemplateDTO;
import com.team5.career_progression_app.dto.SkillDTO;
import com.team5.career_progression_app.dto.TemplateDTO;
import com.team5.career_progression_app.exception.ResourceNotFoundException;
import com.team5.career_progression_app.model.Skill;
import com.team5.career_progression_app.model.TaskTemplate;
import com.team5.career_progression_app.model.TemplateSkill;
import com.team5.career_progression_app.repository.SkillRepository;
import com.team5.career_progression_app.repository.TaskTemplateRepository;
import com.team5.career_progression_app.repository.TemplateSkillRepository;
import com.team5.career_progression_app.service.OpenAIService;
import com.team5.career_progression_app.service.SkillService;
import com.team5.career_progression_app.service.TemplateService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class TemplateServiceImpl implements TemplateService {
    private final TaskTemplateRepository taskTemplateRepository;
    private final SkillRepository skillRepository;
    private final TemplateSkillRepository templateSkillRepository;
    private final SkillService skillService;
    private final OpenAIService openAIService;
    private final ObjectMapper objectMapper;

    @Override
    public TemplateDTO createTemplate(TemplateDTO templateDTO) {
        TaskTemplate template = new TaskTemplate();
        template.setName(templateDTO.getName());
        template.setDescription(templateDTO.getDescription());
        template.setTaskRequirements(templateDTO.getRequirements());
        
        template = taskTemplateRepository.save(template);
        
        if (templateDTO.getSkillIds() != null && !templateDTO.getSkillIds().isEmpty()) {
            createTemplateSkills(template.getId(), templateDTO.getSkillIds());
        }
        
        return convertToDTO(template);
    }

    @Override
    public TemplateDTO updateTemplate(TemplateDTO templateDTO) {
        TaskTemplate template = taskTemplateRepository.findById(templateDTO.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Template not found with id: " + templateDTO.getId()));

        template.setName(templateDTO.getName());
        template.setDescription(templateDTO.getDescription());
        template.setTaskRequirements(templateDTO.getRequirements());
        
        template = taskTemplateRepository.save(template);
        
        deleteTemplateSkills(template.getId());
        
        if (templateDTO.getSkillIds() != null && !templateDTO.getSkillIds().isEmpty()) {
            createTemplateSkills(template.getId(), templateDTO.getSkillIds());
        }
        
        return convertToDTO(template);
    }

    @Override
    public List<TemplateDTO> getAllTemplates() {
        List<TaskTemplate> templates = taskTemplateRepository.findAll();
        return templates.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public TemplateDTO getTemplateById(int id) {
        TaskTemplate template = taskTemplateRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Template not found with id: " + id));
        return convertToDTO(template);
    }

    private void deleteTemplateSkills(int templateId) {
        templateSkillRepository.deleteByTemplateId(templateId);
    }

    private void createTemplateSkills(int templateId, List<Integer> skillIds) {
        TaskTemplate template = taskTemplateRepository.findById(templateId)
                .orElseThrow(() -> new ResourceNotFoundException("Template not found with id: " + templateId));

        List<Skill> skills = skillRepository.findAllById(skillIds);
        
        if (skills.size() != skillIds.size()) {
            throw new ResourceNotFoundException("One or more skills not found");
        }

        List<TemplateSkill> templateSkills = skills.stream()
                .map(skill -> {
                    TemplateSkill templateSkill = new TemplateSkill();
                    templateSkill.setTemplate(template);
                    templateSkill.setSkill(skill);
                    templateSkill.setLevel("1"); // Default level
                    return templateSkill;
                })
                .collect(Collectors.toList());

        templateSkillRepository.saveAll(templateSkills);
    }

    private TemplateDTO convertToDTO(TaskTemplate template) {
        TemplateDTO dto = new TemplateDTO();
        dto.setId(template.getId());
        dto.setName(template.getName());
        dto.setDescription(template.getDescription());
        dto.setRequirements(template.getTaskRequirements());
        
        if (template.getTemplateSkills() != null) {
            List<Integer> skillIds = template.getTemplateSkills().stream()
                    .map(ts -> ts.getSkill().getId())
                    .collect(Collectors.toList());
            dto.setSkillIds(skillIds);
        }
        
        return dto;
    }

    public AiGeneratedTemplateDTO generateTemplateWithAI(AiGenerateTemplateRequestDTO request) throws Exception {
        List<SkillDTO> skillsWithTypes = skillService.getAllSkills();

        List<String> allSkillNames = skillsWithTypes.stream()
                .map(SkillDTO::getName)
                .collect(Collectors.toList());
        String skillsList = String.join(", ", allSkillNames);

        String baseMessage = "You are an AI assistant for a career progression app. Your task is to generate a complete learning template based on keywords. " +
                "You MUST return a single, minified JSON object with no extra formatting or text outside the JSON. " +
                "The JSON object must have these exact keys: 'suggestedName' (string), 'suggestedDescription' (string, Markdown formatted), 'suggestedRequirements' (string, Markdown formatted), and 'suggestedSkills' (an array of strings). " +
                "The content should be in English. For 'suggestedDescription', include an overview, key topics, and links to resources. For 'suggestedRequirements', list prerequisites. " +
                "IMPORTANT: For 'suggestedSkills', first try to use skills from this existing list (these are examples of how a skill should look and be named): [" + skillsList + "]. " +
                "For 'suggestedSkills', always return an array of individual skill names, each as a separate string, and use only the skill name, without any category or prefix. Example: [\"Swift\", \"Closures\", \"Optionals\", \"Protocols\"]. Do not use any prefixes like 'Uncategorized:' or 'Programming Language:'. " +
                "If you believe a relevant skill is missing from this list, you are allowed to suggest a new skill, but only if it is truly important for the template and not already present. " +
                "Always use the same naming style as the examples. Do not create duplicates or synonyms of existing skills.";

        String aiResponse = openAIService.prompt(baseMessage, request.getKeywords());
        String cleanedJson = aiResponse.trim().replace("```json", "").replace("```", "");
        return objectMapper.readValue(cleanedJson, AiGeneratedTemplateDTO.class);
    }
}
