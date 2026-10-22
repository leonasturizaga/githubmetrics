package com.example.githubmetrics.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CommitAuthorDto {
    private String username;
    private int totalCommits;
    private long totalAdditions;
    private long totalDeletions;
}