package com.team5.career_progression_app.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.team5.career_progression_app.dto.TeamDTO;
import com.team5.career_progression_app.dto.TeamMembershipDTO;
import com.team5.career_progression_app.dto.UserDTO;
import com.team5.career_progression_app.exception.ResourceNotFoundException;
import com.team5.career_progression_app.exception.UserAlreadyInTeamException;
import com.team5.career_progression_app.model.Team;
import com.team5.career_progression_app.model.TeamMembership;
import com.team5.career_progression_app.model.User;
import com.team5.career_progression_app.repository.TeamMembershipRepository;
import com.team5.career_progression_app.repository.TeamRepository;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class TeamMembershipService {
    private final TeamMembershipRepository teamMembershipRepository;
    private final TeamRepository teamRepository;

    public List<TeamMembershipDTO> getAllTeamMemberships() {
        return teamMembershipRepository.findAll().stream()
                .map(this::convertToDTO).toList();
    }

    public List<UserDTO> getUsersByTeamId(Integer teamId) {
        return teamMembershipRepository.findMembershipsWithUsersByTeamId(teamId).stream()
                .map(membership -> new UserDTO(membership.getUser())).toList();
    }

    public List<TeamDTO> getTeamsByUserId(Integer userId) {
        return teamMembershipRepository.findMembershipsWithTeamsByUserId(userId).stream()
                .map(membership -> convertTeamToDTO(membership.getTeam())).toList();
    }

    @Transactional
    public TeamMembershipDTO createTeamMembership(TeamMembershipDTO teamMembershipDTO) {
        if (teamMembershipRepository.existsByUserIdAndTeamId(
                teamMembershipDTO.getUserId(),
                teamMembershipDTO.getTeamId())) {
            throw new UserAlreadyInTeamException("User is already a member of this team");
        }

        TeamMembership membership = new TeamMembership();
        membership.setUser(new User(teamMembershipDTO.getUserId()));
        membership.setTeam(new Team(teamMembershipDTO.getTeamId()));

        TeamMembership saved = teamMembershipRepository.save(membership);
        return convertToDTO(saved);
    }

    @Transactional
    public void deleteTeamMembership(Integer id) {
        if (!teamMembershipRepository.existsById(id)) {
            throw new ResourceNotFoundException("Team membership not found with id: " + id);
        }
        teamMembershipRepository.deleteById(id);
    }

    public List<TeamDTO> getAllTeams() {
        return teamRepository.findAll().stream()
                .map(this::convertTeamToDTO)
                .toList();
    }

    private TeamMembershipDTO convertToDTO(TeamMembership membership) {
        return new TeamMembershipDTO(
                membership.getId(),
                membership.getUser().getId(),
                membership.getTeam().getId(),
                new UserDTO(membership.getUser()),
                convertTeamToDTO(membership.getTeam()));
    }

    private TeamDTO convertTeamToDTO(Team team) {
        return new TeamDTO(
                team.getId(),
                team.getName(),
                team.getLead().getId());
    }
}
