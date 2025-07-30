package com.team5.career_progression_app.restController;

import com.team5.career_progression_app.dto.ApiResponse;
import com.team5.career_progression_app.dto.TeamDTO;
import com.team5.career_progression_app.service.TeamService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/teams")
@Validated
public class TeamController {
    private final TeamService teamService;

    public TeamController(TeamService teamService) {
        this.teamService = teamService;
    }

    @GetMapping
    public List<TeamDTO> getTeams() {
        return teamService.getTeams();
    }

    @GetMapping("/{teamId}")
    public TeamDTO getTeamById(@PathVariable int teamId) {
        return teamService.getTeamById(teamId);
    }

    @GetMapping("/names")
    public ApiResponse<List<String>> getAllTeamNames() {
        List<String> teamNames = teamService.getAllTeamNames();
        return new ApiResponse<>(true, "Team names fetched successfully", teamNames);
    }

    @PostMapping("/add")
    public ApiResponse<TeamDTO> addTeam(@Valid  @RequestBody TeamDTO teamDTO) {
        TeamDTO createdTeam = teamService.createTeam(teamDTO);
        return new ApiResponse<>(true, "New team created successfully", createdTeam);
    }
    @PutMapping("/update/{teamId}")
    public ApiResponse<TeamDTO> editTeam(@PathVariable int teamId, @Valid @RequestBody TeamDTO teamDTO) {
        teamService.deleteTeam(teamId);
        TeamDTO updatedTeam = teamService.createTeam(teamDTO);
        return new ApiResponse<>(true, "Team updated successfully", updatedTeam);
    }

    @DeleteMapping("/delete/{teamId}")
    public ResponseEntity<ApiResponse<Void>> deleteTeam(@PathVariable Integer teamId) {
        teamService.deleteTeam(teamId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Team deleted successfully", null));
    }

}


