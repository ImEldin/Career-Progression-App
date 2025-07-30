package com.team5.career_progression_app.restController;

import com.team5.career_progression_app.dto.*;
import com.team5.career_progression_app.service.SkillService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/skills")
public class SkillController {

    private final SkillService skillService;

    public SkillController(SkillService skillService) {
        this.skillService = skillService;
    }

    @GetMapping
    public List<SkillDTO> getAllSkills() {
        return skillService.getAllSkills();
    }

    @PostMapping
    public SkillDTO createSkill(@RequestBody SkillCreateDTO skillCreateDTO) {
        return skillService.createSkill(skillCreateDTO);
    }

    @PutMapping("/{id}")
    public SkillDTO updateSkill(@PathVariable Integer id, @RequestBody SkillCreateDTO skillCreateDTO) {
        return skillService.updateSkill(id, skillCreateDTO);
    }

    @DeleteMapping("/{id}")
    public void deleteSkill(@PathVariable Integer id) {
        skillService.deleteSkill(id);
    }

    @GetMapping("/tags")
    public List<TagDTO> getAllTags() {
        return skillService.getAllTags();
    }

    @PostMapping("/tags")
    public TagDTO createTag(@RequestBody TagDTO tagDTO) {
        return skillService.createTag(tagDTO);
    }

    @PutMapping("/tags/{id}")
    public TagDTO updateTag(@PathVariable Integer id, @RequestBody TagDTO tagDTO) {
        return skillService.updateTag(id, tagDTO);
    }

    @DeleteMapping("/tags/{id}")
    public void deleteTag(@PathVariable Integer id) {
        skillService.deleteTag(id);
    }

    @GetMapping("/types")
    public List<SkillTypeDTO> getAllSkillTypes() {
        return skillService.getAllSkillTypes();
    }

    @PostMapping("/types")
    public SkillTypeDTO createSkillType(@RequestBody SkillTypeDTO skillTypeDTO) {
        return skillService.createSkillType(skillTypeDTO);
    }

    @GetMapping("/templates/{templateId}/skills")
    public List<TemplateSkillDTO> getSkillsForTemplate(@PathVariable Integer templateId) {
        return skillService.getSkillsForTemplate(templateId);
    }

    @PostMapping("/templates/skills")
    public TemplateSkillDTO addSkillToTemplate(@RequestBody TemplateSkillCreateDTO templateSkillDTO) {
        return skillService.addSkillToTemplate(templateSkillDTO);
    }

    @GetMapping("/types/{skillTypeId}/skills")
    public List<SkillDTO> getSkillsByType(@PathVariable Integer skillTypeId) {
        return skillService.getSkillsByType(skillTypeId);
    }

    @GetMapping("/{skillId}/tags")
    public List<TagDTO> getTagsForSkill(@PathVariable Integer skillId) {
        return skillService.getTagsForSkill(skillId);
    }

    @PostMapping("/{skillId}/tags/{tagId}")
    public SkillDTO addTagToSkill(
            @PathVariable Integer skillId,
            @PathVariable Integer tagId) {
        return skillService.addTagToSkill(skillId, tagId);
    }

    @GetMapping("/{skillId}/similar-skills")
    public List<SkillDTO> findSimilarSkills(@PathVariable Integer skillId) {
        return skillService.findSimilarSkills(skillId);
    }

    @GetMapping("/{skillId}/similar-users")
    public List<UserWithSkillsDTO> findUsersWithSimilarSkills(
            @PathVariable Integer skillId,
            @RequestParam(required = false, defaultValue = "1") String level) {
        return skillService.findUsersWithSimilarSkills(skillId, level);
    }

    @GetMapping("/users/{userId}/skills")
    public List<UserSkillDTO> getSkillsForUser(@PathVariable Integer userId) {
        return skillService.getSkillsForUser(userId);
    }

    @GetMapping("/user/{userId}")
    public List<SkillDTO> getSkillsForUserSimple(@PathVariable Integer userId) {
        return skillService.getSkillsForUserSimple(userId);
    }

    @PostMapping("/users/skills")
    public UserSkillDTO addSkillToUser(@RequestBody UserSkillDTO userSkillDTO) {
        return skillService.addSkillToUser(userSkillDTO);
    }

    @PutMapping("/users/{userId}/skills")
    public void updateSkillsForUser(
            @PathVariable Integer userId,
            @RequestBody List<Integer> skillIds) {
        skillService.updateUserSkills(userId, skillIds);
    }
}
