package com.team5.career_progression_app.core;

import com.team5.career_progression_app.dto.TeamDTO;
import com.team5.career_progression_app.dto.UserDTO;
import com.team5.career_progression_app.exception.ResourceNotFoundException;
import com.team5.career_progression_app.model.Team;
import com.team5.career_progression_app.model.TeamMembership;
import com.team5.career_progression_app.model.User;
import com.team5.career_progression_app.repository.TeamMembershipRepository;
import com.team5.career_progression_app.repository.TeamRepository;
import com.team5.career_progression_app.repository.UserRepository;
import com.team5.career_progression_app.service.TeamService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;


@Service
@AllArgsConstructor
public class TeamServiceImpl implements TeamService {

    private final TeamRepository teamRepository;
    private final UserRepository userRepository;
    private final TeamMembershipRepository teamMembershipRepository;

    @Override
    public List<TeamDTO> getTeams() {
        return teamRepository.findAll().stream()
                .map(TeamDTO::new)
                .toList();
    }

    @Override
    public List<String> getAllTeamNames() {
        return teamRepository.getAllTeamNames();
    }

    @Override
    public TeamDTO createTeam(TeamDTO teamDTO){
        User teamLead = userRepository.findById(teamDTO.getLeadId()).orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Team team = new Team();

        List<TeamMembership> memberships = new ArrayList<>();

        for(UserDTO memberDTO : teamDTO.getMembers()){
            if(!memberDTO.getId().equals(teamDTO.getLeadId())){
                User member = userRepository.findById(memberDTO.getId()).orElseThrow(() -> new ResourceNotFoundException("User not found"));
                memberships.add(new TeamMembership(team, member));
            }
        }

        team.setName(teamDTO.getName());
        team.setLead(teamLead);
        team = teamRepository.save(team);
        teamMembershipRepository.saveAll(memberships);

        return new TeamDTO(team);
    }

    @Transactional
    @Override
    public void deleteTeam(Integer teamId){
        Team team = teamRepository.findById(teamId).orElseThrow(() -> new ResourceNotFoundException("Team not found"));
        teamMembershipRepository.deleteAllByTeam(team);
        teamRepository.delete(team);
    }

    @Override
    public TeamDTO getTeamById(Integer teamId) {
        Team team = teamRepository.findById(teamId).orElseThrow(() -> new ResourceNotFoundException("Team not found"));
        return new TeamDTO(team);
    }
} 

