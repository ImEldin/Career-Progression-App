package com.team5.career_progression_app.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.team5.career_progression_app.dto.PositionDTO;
import com.team5.career_progression_app.exception.ResourceNotFoundException;
import com.team5.career_progression_app.model.Position;
import com.team5.career_progression_app.repository.PositionRepository;

@Service
public class PositionService {

    private final PositionRepository positionRepository;

    public PositionService(PositionRepository positionRepository){
        this.positionRepository = positionRepository;
    }

    public List<PositionDTO> getAllPositions(){
        List<Position> positions = positionRepository.findAll();

        return positions.stream().map(position -> new PositionDTO(position.getId(), position.getName())).toList();
    }

    public PositionDTO createPosition(PositionDTO dto) {
        Position position = new Position();
        position.setName(dto.getName());
        Position saved = positionRepository.save(position);
        return new PositionDTO(saved.getId(), saved.getName());
    }

    public PositionDTO updatePosition(int id, PositionDTO dto) {
        Position position = positionRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Position with ID " + id + " not found"));

        position.setName(dto.getName());
        Position updated = positionRepository.save(position);
        return new PositionDTO(updated.getId(), updated.getName());
    }

    public PositionDTO getPositionById(int id) {
        Position position = positionRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Position with ID " + id + " not found"));

        return new PositionDTO(position.getId(), position.getName());
    }
}
