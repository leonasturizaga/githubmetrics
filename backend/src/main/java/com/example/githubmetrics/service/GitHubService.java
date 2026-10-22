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
         final int currentPage = page; // ← this is the fix

         List<Map<String, Object>> pageResult = webClient.get()
               .uri(uriBuilder -> uriBuilder
                     .path("/repos/{owner}/{repo}/pulls")
                     .queryParam("state", "all")
                     .queryParam("base", baseBranch)
                     .queryParam("per_page", 100)
                     .queryParam("page", currentPage)
                     .build(owner, repo))
               .retrieve()
               .bodyToMono(new ParameterizedTypeReference<List<Map<String, Object>>>() {
               })
               .block();

         if (pageResult == null || pageResult.isEmpty()) {
            hasMore = false;
         } else {
            all.addAll(pageResult);
            page++;
            if (pageResult.size() < 100)
               hasMore = false;
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
            .totalAdditions(additions) // placeholder – enrich later
            .totalDeletions(deletions)
            .avgFilesChanged(0)
            .lastActivity(lastActivity)
            .build();
   }

public ParticipationStatsDto getParticipationStats() {
    Map<String, Object> response = webClient.get()
            .uri("/repos/{owner}/{repo}/stats/participation", owner, repo)
            .retrieve()
            .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {})
            .block();

    if (response == null) {
        throw new RuntimeException("Empty response from GitHub participation stats");
    }

    List<Integer> all = (List<Integer>) response.get("all");
    List<Integer> ownerCommits = (List<Integer>) response.get("owner");

    int totalAll = all.stream().mapToInt(Integer::intValue).sum();
    int totalOwner = ownerCommits.stream().mapToInt(Integer::intValue).sum();

    double percentage = totalAll == 0 ? 0.0 : (totalOwner * 100.0) / totalAll;

    return ParticipationStatsDto.builder()
            .all(all)
            .owner(ownerCommits)
            .totalAllCommits(totalAll)
            .totalOwnerCommits(totalOwner)
            .ownerParticipationPercentage(Math.round(percentage * 100.0) / 100.0)
            .build();
}

public List<ContributorStatsDto> getContributorsStats() {
    List<Map<String, Object>> response = webClient.get()
            .uri("/repos/{owner}/{repo}/stats/contributors", owner, repo)
            .retrieve()
            .bodyToMono(new ParameterizedTypeReference<List<Map<String, Object>>>() {})
            .block();

    if (response == null || response.isEmpty()) {
        return List.of();
    }

    return response.stream()
            .map(item -> {
                Map<String, Object> author = (Map<String, Object>) item.get("author");
                String username = author != null ? (String) author.get("login") : "unknown";
                int total = ((Number) item.get("total")).intValue();

                return ContributorStatsDto.builder()
                        .username(username)
                        .totalCommits(total)
                        .weeks((List<Map<String, Object>>) item.get("weeks"))
                        .build();
            })
            .sorted((a, b) -> Integer.compare(b.getTotalCommits(), a.getTotalCommits()))
            .toList();
}

// ====================== ACCURATE ENDPOINTS ======================

public AccurateMetricsResponse getAccurateMetrics() {
    List<Map<String, Object>> allPrs = fetchAllPullRequests(); // reuse existing method
    List<PrDetailDto> prDetails = enrichPullRequests(allPrs);

    List<CommitAuthorDto> commitAuthors = fetchCommitAuthors();

    int totalCommits = commitAuthors.stream()
            .mapToInt(CommitAuthorDto::getTotalCommits)
            .sum();

    // Owner percentage (assuming the first or matching owner)
    int ownerCommits = commitAuthors.stream()
            .filter(c -> c.getUsername().equalsIgnoreCase(owner))
            .mapToInt(CommitAuthorDto::getTotalCommits)
            .findFirst()
            .orElse(0);

    double ownerPct = totalCommits == 0 ? 0.0 :
            Math.round((ownerCommits * 10000.0) / totalCommits) / 100.0;

    return AccurateMetricsResponse.builder()
            .repo(owner + "/" + repo)
            .baseBranch(baseBranch)
            .commitAuthors(commitAuthors)
            .pullRequests(prDetails)
            .totalCommits(totalCommits)
            .ownerCommitPercentage(ownerPct)
            .build();
}

private List<PrDetailDto> enrichPullRequests(List<Map<String, Object>> prs) {
    List<PrDetailDto> result = new ArrayList<>();

    for (Map<String, Object> pr : prs) {
        int number = ((Number) pr.get("number")).intValue();
        String author = ((Map<String, Object>) pr.get("user")).get("login").toString();
        String state = (String) pr.get("state");
        boolean merged = pr.get("merged_at") != null;
        String createdAt = (String) pr.get("created_at");
        String mergedAt = (String) pr.get("merged_at");
        String headBranch = ((Map<String, Object>) pr.get("head")).get("ref").toString();

        // Get files changed + lines
        List<Map<String, Object>> files = webClient.get()
                .uri("/repos/{owner}/{repo}/pulls/{number}/files", owner, repo, number)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<List<Map<String, Object>>>() {})
                .block();

        int additions = 0;
        int deletions = 0;
        int filesChanged = files != null ? files.size() : 0;

        if (files != null) {
            for (Map<String, Object> f : files) {
                additions += ((Number) f.getOrDefault("additions", 0)).intValue();
                deletions += ((Number) f.getOrDefault("deletions", 0)).intValue();
            }
        }

        // Get number of commits in the PR
        List<Map<String, Object>> commits = webClient.get()
                .uri("/repos/{owner}/{repo}/pulls/{number}/commits", owner, repo, number)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<List<Map<String, Object>>>() {})
                .block();

        int commitCount = commits != null ? commits.size() : 0;

        result.add(PrDetailDto.builder()
                .number(number)
                .title((String) pr.get("title"))
                .author(author)
                .state(state)
                .merged(merged)
                .createdAt(createdAt)
                .mergedAt(mergedAt)
                .headBranch(headBranch)
                .commits(commitCount)
                .filesChanged(filesChanged)
                .additions(additions)
                .deletions(deletions)
                .build());
    }

    return result;
}

private List<CommitAuthorDto> fetchCommitAuthors() {
    Map<String, CommitAuthorDto> map = new HashMap<>();
    int page = 1;
    boolean hasMore = true;

    while (hasMore) {
        final int currentPage = page;

        List<Map<String, Object>> commits = webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/repos/{owner}/{repo}/commits")
                        .queryParam("per_page", 100)
                        .queryParam("page", currentPage)
                        .build(owner, repo))
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<List<Map<String, Object>>>() {})
                .block();

        if (commits == null || commits.isEmpty()) {
            hasMore = false;
        } else {
            for (Map<String, Object> c : commits) {
                Map<String, Object> authorObj = (Map<String, Object>) c.get("author");
                if (authorObj == null) continue;

                String login = (String) authorObj.get("login");
                if (login == null) continue;

                // Get stats from commit
                Map<String, Object> stats = (Map<String, Object>) c.get("stats");
                int additions = stats != null ? ((Number) stats.getOrDefault("additions", 0)).intValue() : 0;
                int deletions = stats != null ? ((Number) stats.getOrDefault("deletions", 0)).intValue() : 0;

                map.compute(login, (k, existing) -> {
                    if (existing == null) {
                        return CommitAuthorDto.builder()
                                .username(login)
                                .totalCommits(1)
                                .totalAdditions(additions)
                                .totalDeletions(deletions)
                                .build();
                    } else {
                        existing.setTotalCommits(existing.getTotalCommits() + 1);
                        existing.setTotalAdditions(existing.getTotalAdditions() + additions);
                        existing.setTotalDeletions(existing.getTotalDeletions() + deletions);
                        return existing;
                    }
                });
            }
            page++;
            if (commits.size() < 100) hasMore = false;
        }
    }

    return map.values().stream()
            .sorted((a, b) -> Integer.compare(b.getTotalCommits(), a.getTotalCommits()))
            .toList();
}



}