package com.team5.career_progression_app.restController;

import com.team5.career_progression_app.dto.UserPositionDTO;
import com.team5.career_progression_app.service.UserPositionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.ResponseEntity;

import java.util.List;

@RestController
@RequestMapping("/userPositions")
public class UserPositionController {

    @Autowired
    private UserPositionService userPositionService;

    @GetMapping
    public List<UserPositionDTO> getUserPositions(@RequestParam Integer userId) {
        return userPositionService.getUserPositionsForUser(userId);
    }

    @PostMapping
    public ResponseEntity<UserPositionDTO> addUserPosition(@RequestBody AddUserPositionRequest request) {
        UserPositionDTO dto = userPositionService.addUserPosition(request.getUserId(), request.getPositionId(), request.getLevel());
        return ResponseEntity.ok(dto);
    }

    public static class AddUserPositionRequest {
        private Integer userId;
        private Integer positionId;
        private Integer level;

        public Integer getUserId() { return userId; }
        public void setUserId(Integer userId) { this.userId = userId; }
        public Integer getPositionId() { return positionId; }
        public void setPositionId(Integer positionId) { this.positionId = positionId; }
        public Integer getLevel() { return level; }
        public void setLevel(Integer level) { this.level = level; }
    }
}