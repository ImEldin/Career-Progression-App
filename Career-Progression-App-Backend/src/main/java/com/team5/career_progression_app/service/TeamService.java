package com.team5.career_progression_app.service;

import com.team5.career_progression_app.dto.TeamDTO;
import com.team5.career_progression_app.model.Team;

import java.util.List;

public interface TeamService {
    List<TeamDTO> getTeams();
    List<String> getAllTeamNames();

    TeamDTO createTeam(TeamDTO teamDTO);
    void deleteTeam(Integer teamId);
    TeamDTO getTeamById(Integer teamId);
}
