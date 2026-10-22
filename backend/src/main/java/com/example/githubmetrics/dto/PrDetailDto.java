package com.example.githubmetrics.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PrDetailDto {
    private int number;
    private String title;
    private String author;
    private String state;
    private boolean merged;
    private String createdAt;
    private String mergedAt;
    private String headBranch;
    private int commits;
    private int filesChanged;
    private int additions;
    private int deletions;
}