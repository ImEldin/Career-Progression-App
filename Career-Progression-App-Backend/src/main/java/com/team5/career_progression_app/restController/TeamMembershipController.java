package com.team5.career_progression_app.restController;

import com.team5.career_progression_app.dto.TeamDTO;
import com.team5.career_progression_app.dto.TeamMembershipDTO;
import com.team5.career_progression_app.dto.UserDTO;
import com.team5.career_progression_app.service.TeamMembershipService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/team-memberships")
public class TeamMembershipController {

    private final TeamMembershipService teamMembershipService;

    public TeamMembershipController(TeamMembershipService teamMembershipService) {
        this.teamMembershipService = teamMembershipService;
    }

    @GetMapping
    public ResponseEntity<List<TeamMembershipDTO>> getAll() {
        return ResponseEntity.ok(teamMembershipService.getAllTeamMemberships());
    }

    @GetMapping("/team/{teamId}/users")
    public ResponseEntity<List<UserDTO>> getTeamUsers(@PathVariable Integer teamId) {
        return ResponseEntity.ok(teamMembershipService.getUsersByTeamId(teamId));
    }

    @GetMapping("/user/{userId}/teams")
    public ResponseEntity<List<TeamDTO>> getUserTeams(@PathVariable Integer userId) {
        return ResponseEntity.ok(teamMembershipService.getTeamsByUserId(userId));
    }

    @PostMapping
    public ResponseEntity<TeamMembershipDTO> create(@RequestBody TeamMembershipDTO dto) {
        return ResponseEntity.ok(teamMembershipService.createTeamMembership(dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        teamMembershipService.deleteTeamMembership(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/teams")
    public ResponseEntity<List<TeamDTO>> getAllTeams() {
        return ResponseEntity.ok(teamMembershipService.getAllTeams());
    }
}