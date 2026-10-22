package com.example.githubmetrics.controller;

import com.example.githubmetrics.dto.TeamMetricsResponse;
import com.example.githubmetrics.service.GitHubService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/metrics")
@CrossOrigin(origins = "http://localhost:5173") // Vite default
public class MetricsController {

    private final GitHubService gitHubService;

    public MetricsController(GitHubService gitHubService) {
        this.gitHubService = gitHubService;
    }

    @GetMapping("/team")
    public TeamMetricsResponse getTeamMetrics() {
        return gitHubService.getTeamMetrics();
    }
}