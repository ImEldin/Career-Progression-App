package com.team5.career_progression_app.service;

import com.team5.career_progression_app.dto.*;
import com.team5.career_progression_app.exception.*;
import com.team5.career_progression_app.model.*;
import com.team5.career_progression_app.repository.*;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class SkillService {

    private final SkillRepository skillRepository;
    private final SkillTypeRepository skillTypeRepository;
    private final TagRepository tagRepository;
    private final TemplateSkillRepository templateSkillRepository;
    private final TaskTemplateRepository taskTemplateRepository;
    private final UserSkillRepository userSkillRepository;
    private final UserRepository userRepository;

    public SkillService(SkillRepository skillRepository,
                       SkillTypeRepository skillTypeRepository,
                       TagRepository tagRepository,
                       TemplateSkillRepository templateSkillRepository,
                       TaskTemplateRepository taskTemplateRepository,
                       UserSkillRepository userSkillRepository,
                        UserRepository userRepository) {
        this.skillRepository = skillRepository;
        this.skillTypeRepository = skillTypeRepository;
        this.tagRepository = tagRepository;
        this.templateSkillRepository = templateSkillRepository;
        this.taskTemplateRepository = taskTemplateRepository;
        this.userSkillRepository = userSkillRepository;
        this.userRepository = userRepository;
    }

    public List<SkillDTO> getAllSkills() {
        return skillRepository.findAll().stream()
                .map(SkillDTO::new)
                .toList();
    }

    public List<SkillDTO> getSkillsByType(Integer skillTypeId) {
        return skillRepository.findBySkillTypeId(skillTypeId).stream()
                .map(SkillDTO::new)
                .toList();
    }

    public SkillDTO createSkill(SkillCreateDTO skillCreateDTO) {
        Skill skill = new Skill();
        skill.setName(skillCreateDTO.getName());

        if (skillCreateDTO.getTypeId() != null) {
            SkillType skillType = skillTypeRepository.findById(skillCreateDTO.getTypeId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Skill-Type with ID " + skillCreateDTO.getTypeId() + " not found"));
            skill.setSkillType(skillType);

            if (skillRepository.existsByNameAndSkillTypeId(skillCreateDTO.getName(), skillCreateDTO.getTypeId())) {
                throw new SkillAlreadyExistsException("Skill " + skillCreateDTO.getName() + " already exists in this category");
            }
        }

        if (skillCreateDTO.getTagIds() != null && !skillCreateDTO.getTagIds().isEmpty()) {
            List<Tag> tags = skillCreateDTO.getTagIds().stream()
                    .map(tagId -> tagRepository.findById(tagId)
                            .orElseThrow(() -> new ResourceNotFoundException("Tag not found with id: " + tagId)))
                    .toList();
            skill.setTags(tags);
        }

        Skill saved = skillRepository.save(skill);
        return new SkillDTO(saved);
    }

    public SkillDTO updateSkill(Integer id, SkillCreateDTO skillCreateDTO) {
        Skill skill = skillRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Skill not found with id: " + id));

        if (skillCreateDTO.getName() != null && !skill.getName().equals(skillCreateDTO.getName())) {
            skill.setName(skillCreateDTO.getName());
        }

        if (skillCreateDTO.getTypeId() != null) {
            SkillType skillType = skillTypeRepository.findById(skillCreateDTO.getTypeId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Skill-Type with ID " + skillCreateDTO.getTypeId() + " not found"));
            skill.setSkillType(skillType);
        }

        if (skillCreateDTO.getTagIds() != null) {
            List<Tag> tags = skillCreateDTO.getTagIds().stream()
                    .map(tagId -> tagRepository.findById(tagId)
                            .orElseThrow(() -> new ResourceNotFoundException("Tag not found with id: " + tagId)))
                    .toList();

            if (skill.getTags() == null) {
                skill.setTags(new ArrayList<>());
            } else {
                skill.getTags().clear();
            }

            skill.getTags().addAll(tags);
        }

        Skill saved = skillRepository.save(skill);
        return new SkillDTO(saved);
    }

    @Transactional
    public void deleteSkill(Integer id) {
        Skill skill = skillRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Skill not found with id: " + id));
        templateSkillRepository.deleteBySkillId(id);
        userSkillRepository.deleteBySkillId(id);
        skillRepository.delete(skill);
    }

    public List<TagDTO> getAllTags() {
        return tagRepository.findAll().stream()
                .map(TagDTO::new)
                .toList();
    }

    public TagDTO createTag(TagDTO tagDTO) {
        if (tagRepository.existsByName(tagDTO.getName())) {
            throw new ResourceNotFoundException("Tag already exists");
        }

        Tag tag = new Tag();
        tag.setName(tagDTO.getName());
        Tag saved = tagRepository.save(tag);
        return new TagDTO(saved);
    }

    public TagDTO updateTag(Integer id, TagDTO tagDTO) {
        Tag tag = tagRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tag not found with id: " + id));
        tag.setName(tagDTO.getName());
        Tag saved = tagRepository.save(tag);
        return new TagDTO(saved);
    }

    public void deleteTag(Integer id) {
        Tag tag = tagRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tag not found with id: " + id));
        tagRepository.delete(tag);
    }

    public List<SkillTypeDTO> getAllSkillTypes() {
        return skillTypeRepository.findAll().stream()
                .map(SkillTypeDTO::new)
                .toList();
    }

    public SkillTypeDTO createSkillType(SkillTypeDTO skillTypeDTO) {
        if (skillTypeRepository.existsByName(skillTypeDTO.getName())) {
            throw new ResourceNotFoundException("Skill type already exists");
        }

        SkillType skillType = new SkillType();
        skillType.setName(skillTypeDTO.getName());
        SkillType saved = skillTypeRepository.save(skillType);
        return new SkillTypeDTO(saved);
    }

    public List<TemplateSkillDTO> getSkillsForTemplate(Integer templateId) {
        return templateSkillRepository.findByTemplateId(templateId).stream()
                .map(TemplateSkillDTO::new)
                .toList();
    }

    public TemplateSkillDTO addSkillToTemplate(TemplateSkillCreateDTO templateSkillDTO) {
        TaskTemplate template = taskTemplateRepository.findById(templateSkillDTO.getTemplateId())
                .orElseThrow(() -> new ResourceNotFoundException("Template not found with id: " + templateSkillDTO.getTemplateId()));

        Skill skill = skillRepository.findById(templateSkillDTO.getSkillId())
                .orElseThrow(() -> new ResourceNotFoundException("Skill not found with id: " + templateSkillDTO.getSkillId()));

        if (templateSkillRepository.existsByTemplateIdAndSkillId(templateSkillDTO.getTemplateId(), templateSkillDTO.getSkillId())) {
            throw new SkillAlreadyExistsException("Skill already added to this template");
        }

        TemplateSkill templateSkill = new TemplateSkill();
        templateSkill.setTemplate(template);
        templateSkill.setSkill(skill);
        templateSkill.setLevel(templateSkillDTO.getLevel());

        TemplateSkill saved = templateSkillRepository.save(templateSkill);
        return new TemplateSkillDTO(saved);
    }

    public List<UserSkillDTO> getSkillsForUser(Integer userId) {
        return userSkillRepository.findByUserId(userId).stream()
                .map(this::convertToUserSkillDTO).toList();
    }

    public List<SkillDTO> getSkillsForUserSimple(Integer userId) {
        List<UserSkill> userSkills = userSkillRepository.findByUserId(userId);
        return userSkills.stream()
                .map(userSkill -> new SkillDTO(userSkill.getSkill()))
                .toList();
    }

    public UserSkillDTO addSkillToUser(UserSkillDTO userSkillDTO) {
        if (userSkillRepository.existsByUserIdAndSkillId(
                userSkillDTO.getUserId(), userSkillDTO.getSkillId())) {
            throw new SkillAlreadyExistsException("User already has this skill");
        }

        UserSkill userSkill = new UserSkill();
        userSkill.setUser(new User(userSkillDTO.getUserId()));
        userSkill.setSkill(new Skill(userSkillDTO.getSkillId()));
        userSkill.setLevel(userSkillDTO.getLevel());

        UserSkill saved = userSkillRepository.save(userSkill);
        return convertToUserSkillDTO(saved);
    }

    public SkillDTO addTagToSkill(Integer skillId, Integer tagId) {
        Skill skill = skillRepository.findById(skillId)
                .orElseThrow(() -> new ResourceNotFoundException("Skill not found"));

        Tag tag = tagRepository.findById(tagId)
                .orElseThrow(() -> new ResourceNotFoundException("Tag not found"));

        if (skill.getTags().contains(tag)) {
            throw new ResourceNotFoundException("Tag already assigned to skill");
        }

        skill.getTags().add(tag);
        skillRepository.save(skill);

        return convertToSkillDTO(skill);
    }

    public List<TagDTO> getTagsForSkill(Integer skillId) {
        Skill skill = skillRepository.findById(skillId)
                .orElseThrow(() -> new ResourceNotFoundException("Skill not found"));

        return skill.getTags().stream()
                .map(this::convertToTagDTO).toList();
    }

    public List<SkillDTO> findSimilarSkills(Integer skillId) {
        Skill skill = skillRepository.findById(skillId)
                .orElseThrow(() -> new ResourceNotFoundException("Skill not found"));

        if (skill.getTags().isEmpty()) {
            return Collections.emptyList();
        }

        List<Integer> tagIds = skill.getTags().stream()
                .map(Tag::getId)
                .toList();

        return skillRepository.findAllByTagIdsAndExcludeSkill(tagIds, skillId).stream()
                .map(this::convertToSkillDTO)
                .toList();
    }

    public List<UserWithSkillsDTO> findUsersWithSimilarSkills(Integer skillId, String level) {
        List<SkillDTO> similarSkills = findSimilarSkills(skillId);
        if (similarSkills.isEmpty()) {
            return Collections.emptyList();
        }

        List<Integer> similarSkillIds = similarSkills.stream()
                .map(SkillDTO::getId)
                .toList();

        List<UserSkill> userSkills;
        if (level == null || level.isEmpty()) {
            userSkills = userSkillRepository.findAllBySkillIds(similarSkillIds);
        } else {
            userSkills = userSkillRepository.findDetailedBySkillIdsAndLevel(
                    similarSkillIds, level);
        }

        Map<User, List<UserSkill>> usersWithSkills = userSkills.stream()
                .collect(Collectors.groupingBy(UserSkill::getUser));

        return usersWithSkills.entrySet().stream()
                .map(entry -> {
                    User user = entry.getKey();
                    List<UserSkillDTO> skillDTOs = entry.getValue().stream()
                            .map(this::convertToUserSkillDTO)
                            .toList();

                    return new UserWithSkillsDTO(
                            new UserDTO(user),
                            skillDTOs);
                })
                .toList();
    }

    private SkillTypeDTO convertToSkillTypeDTO(SkillType skillType) {
        return new SkillTypeDTO(skillType.getId(), skillType.getName());
    }

    private SkillDTO convertToSkillDTO(Skill skill) {
        return new SkillDTO(skill);
    }

    private UserSkillDTO convertToUserSkillDTO(UserSkill userSkill) {
        return new UserSkillDTO(userSkill);
    }

    private TagDTO convertToTagDTO(Tag tag) {
        return new TagDTO(tag.getId(), tag.getName());
    }

    @Transactional
    public void updateUserSkills(Integer userId, List<Integer> skillIds) {
        userSkillRepository.deleteByUserId(userId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));

        List<Skill> skills = skillRepository.findAllById(skillIds);

        List<UserSkill> userSkills = skills.stream().map(skill -> {
            UserSkill us = new UserSkill();
            us.setUser(user);         // attachovan entitet
            us.setSkill(skill);       // attachovan entitet
            us.setLevel("BEGINNER");
            return us;
        }).toList();

        userSkillRepository.saveAll(userSkills);
    }
}