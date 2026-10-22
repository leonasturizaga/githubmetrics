package com.example.githubmetrics.dto;

import lombok.Builder;
import lombok.Data;
import java.util.List;
import java.util.Map;

@Data
@Builder
public class ContributorStatsDto {
    private String username;
    private int totalCommits;
    private List<Map<String, Object>> weeks; // optional detail
}