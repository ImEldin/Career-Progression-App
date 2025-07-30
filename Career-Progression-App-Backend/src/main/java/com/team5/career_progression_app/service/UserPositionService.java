package com.team5.career_progression_app.service;

import com.team5.career_progression_app.dto.UserPositionDTO;
import com.team5.career_progression_app.model.PositionLevel;
import com.team5.career_progression_app.model.UserPosition;
import com.team5.career_progression_app.model.User;
import com.team5.career_progression_app.model.Position;
import com.team5.career_progression_app.repository.PositionLevelRepository;
import com.team5.career_progression_app.repository.UserPositionRepository;
import com.team5.career_progression_app.repository.UserRepository;
import com.team5.career_progression_app.repository.PositionRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserPositionService {

    private final UserPositionRepository userPositionRepository;
    private final PositionLevelRepository positionLevelRepository;
    private final UserRepository userRepository;
    private final PositionRepository positionRepository;

    public UserPositionService(UserPositionRepository userPositionRepository, PositionLevelRepository positionLevelRepository, UserRepository userRepository, PositionRepository positionRepository){
        this.userPositionRepository = userPositionRepository;
        this.positionLevelRepository = positionLevelRepository;
        this.userRepository = userRepository;
        this.positionRepository = positionRepository;
    }

    public List<UserPositionDTO> getUserPositionsForUser(Integer userId) {
        List<UserPosition> userPositions = userPositionRepository.findByUserId(userId);

        return userPositions.stream().map(userPosition -> {
            Integer currentLevel = userPosition.getPositionLevel().getLevel();
            Integer nextLevel = currentLevel + 1;
            String description = userPosition.getPositionLevel().getDescription();
            String nextDescription = null;

            PositionLevel nextPositionLevel = positionLevelRepository
                    .findByLevelAndPositionId(nextLevel, userPosition.getPosition().getId())
                    .orElse(null);

            if (nextPositionLevel != null) {
                nextDescription = nextPositionLevel.getDescription();
            }

            return new UserPositionDTO(
                    userPosition.getUser().getId(),
                    userPosition.getPosition().getId(),
                    currentLevel,
                    nextLevel,
                    description,
                    nextDescription);
        }).collect(Collectors.toList());
    }

    public UserPositionDTO addUserPosition(Integer userId, Integer positionId, Integer level) {
        User user = userRepository.findById(userId).orElseThrow();
        Position position = positionRepository.findById(positionId).orElseThrow();
        PositionLevel positionLevel = positionLevelRepository.findByLevelAndPositionId(level, positionId)
                .orElseThrow();

        List<UserPosition> existing = userPositionRepository.findByUserId(userId);
        userPositionRepository.deleteAll(existing);

        UserPosition userPosition = new UserPosition();
        userPosition.setUser(user);
        userPosition.setPosition(position);
        userPosition.setPositionLevel(positionLevel);
        userPositionRepository.save(userPosition);

        int nextLevel = level + 1;
        String description = positionLevel.getDescription();
        String nextDescription = positionLevelRepository
                .findByLevelAndPositionId(nextLevel, positionId)
                .map(PositionLevel::getDescription)
                .orElse(null);

        return new UserPositionDTO(userId, positionId, level, nextLevel, description, nextDescription);
    }
}