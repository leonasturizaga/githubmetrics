package com.example.githubmetrics.dto;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class ParticipationStatsDto {
    private List<Integer> all;      // commits per week (last 52 weeks)
    private List<Integer> owner;    // owner commits per week
    private int totalAllCommits;
    private int totalOwnerCommits;
    private double ownerParticipationPercentage;
}