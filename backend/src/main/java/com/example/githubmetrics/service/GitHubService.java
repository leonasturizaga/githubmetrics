package com.example.githubmetrics.service;

import com.example.githubmetrics.dto.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class GitHubService {

    private final WebClient webClient;

    @Value("${github.owner}")
    private String owner;

    @Value("${github.repo}")
    private String repo;

    @Value("${github.base-branch}")
    private String baseBranch;

    public GitHubService(WebClient githubWebClient) {
        this.webClient = githubWebClient;
    }

    public TeamMetricsResponse getTeamMetrics() {
        List<Map<String, Object>> allPrs = fetchAllPullRequests();

        Map<String, List<Map<String, Object>>> byAuthor = allPrs.stream()
                .collect(Collectors.groupingBy(pr -> {
                    Map<String, Object> user = (Map<String, Object>) pr.get("user");
                    return (String) user.get("login");
                }));

        List<MemberMetricDto> members = byAuthor.entrySet().stream()
                .map(entry -> buildMemberMetric(entry.getKey(), entry.getValue()))
                .sorted(Comparator.comparingInt(MemberMetricDto::getMergedToDev).reversed())
                .toList();

        return TeamMetricsResponse.builder()
                .repo(owner + "/" + repo)
                .baseBranch(baseBranch)
                .members(members)
                .build();
    }

    private List<Map<String, Object>> fetchAllPullRequests() {
        List<Map<String, Object>> all = new ArrayList<>();
        int page = 1;
        boolean hasMore = true;

        while (hasMore) {
                     final int currentPage = page;   // ← this is the fix

                     List<Map<String, Object>> pageResult = webClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .path("/repos/{owner}/{repo}/pulls")
                            .queryParam("state", "all")
                            .queryParam("base", baseBranch)
                            .queryParam("per_page", 100)
                            .queryParam("page", currentPage)
                            .build(owner, repo))
                    .retrieve()
                    .bodyToMono(new ParameterizedTypeReference<List<Map<String, Object>>>() {})
                    .block();

            if (pageResult == null || pageResult.isEmpty()) {
                hasMore = false;
            } else {
                all.addAll(pageResult);
                page++;
                if (pageResult.size() < 100) hasMore = false;
            }
        }
        return all;
    }

    private MemberMetricDto buildMemberMetric(String username, List<Map<String, Object>> prs) {
        int total = prs.size();
        int merged = 0;
        int open = 0;
        long additions = 0;
        long deletions = 0;
        int filesSum = 0;
        String lastActivity = null;

        for (Map<String, Object> pr : prs) {
            String state = (String) pr.get("state");
            Boolean mergedFlag = (Boolean) pr.get("merged"); // sometimes present
            String mergedAt = (String) pr.get("merged_at");

            if ("open".equals(state)) {
                open++;
            }
            if (mergedAt != null || Boolean.TRUE.equals(mergedFlag)) {
                merged++;
            }

            // For real size we would call /pulls/{number}/files – keep simple for now
            // You can enrich later

            String updated = (String) pr.get("updated_at");
            if (lastActivity == null || (updated != null && updated.compareTo(lastActivity) > 0)) {
                lastActivity = updated;
            }
        }

        return MemberMetricDto.builder()
                .username(username)
                .totalPrs(total)
                .mergedToDev(merged)
                .openPrs(open)
                .totalAdditions(additions)      // placeholder – enrich later
                .totalDeletions(deletions)
                .avgFilesChanged(0)
                .lastActivity(lastActivity)
                .build();
    }
}