package com.team5.career_progression_app.restController;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.team5.career_progression_app.dto.PositionDTO;
import com.team5.career_progression_app.service.PositionService;

@RestController
@RequestMapping("/positions")
public class PositionController {
    private final PositionService positionService;

    public PositionController(PositionService positionService){
        this.positionService = positionService;
    }

    @GetMapping
    public List<PositionDTO> getAllPositions(){
        return positionService.getAllPositions();
    }

    @PostMapping
    public ResponseEntity<PositionDTO> createPosition(@RequestBody PositionDTO positionDTO) {
        return new ResponseEntity<>(positionService.createPosition(positionDTO), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PositionDTO> updatePosition(@PathVariable int id, @RequestBody PositionDTO positionDTO) {
        return ResponseEntity.ok(positionService.updatePosition(id, positionDTO));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PositionDTO> getPositionById(@PathVariable int id) {
        return ResponseEntity.ok(positionService.getPositionById(id));
    }
}
