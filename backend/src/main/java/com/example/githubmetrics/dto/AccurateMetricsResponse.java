package com.example.githubmetrics.dto;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class AccurateMetricsResponse {
    private String repo;
    private String baseBranch;
    private List<CommitAuthorDto> commitAuthors;
    private List<PrDetailDto> pullRequests;
    private int totalCommits;
    private double ownerCommitPercentage; // based on real data
}