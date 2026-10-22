// package com.example.githubmetrics.controller;

// import com.example.githubmetrics.dto.TeamMetricsResponse;
// import com.example.githubmetrics.service.GitHubService;
// import org.springframework.web.bind.annotation.CrossOrigin;
// import org.springframework.web.bind.annotation.GetMapping;
// import org.springframework.web.bind.annotation.RequestMapping;
// import org.springframework.web.bind.annotation.RestController;

// @RestController
// @RequestMapping("/api/metrics")
// @CrossOrigin(origins = "http://localhost:5173") // Vite default
// public class MetricsController {

//     private final GitHubService gitHubService;

//     public MetricsController(GitHubService gitHubService) {
//         this.gitHubService = gitHubService;
//     }

//     @GetMapping("/team")
//     public TeamMetricsResponse getTeamMetrics() {
//         return gitHubService.getTeamMetrics();
//     }
// }

package com.example.githubmetrics.controller;

import com.example.githubmetrics.dto.TeamMetricsResponse;
import com.example.githubmetrics.service.GitHubService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/metrics")
@CrossOrigin(origins = "http://localhost:5173")
public class MetricsController {

   private final GitHubService gitHubService;

   public MetricsController(GitHubService gitHubService) {
      this.gitHubService = gitHubService;
   }

   @GetMapping("/team")
   public ResponseEntity<?> getTeamMetrics() {
      try {
         TeamMetricsResponse response = gitHubService.getTeamMetrics();
         return ResponseEntity.ok(response);
      } catch (Exception e) {
         e.printStackTrace(); // this will print the full stacktrace in the console
         return ResponseEntity
               .status(HttpStatus.INTERNAL_SERVER_ERROR)
               .body(Map.of(
                     "error", "Failed to fetch GitHub metrics",
                     "message", e.getMessage(),
                     "exception", e.getClass().getSimpleName()));
      }
   }

   // Simple health check
   @GetMapping("/health")
   public Map<String, String> health() {
      return Map.of("status", "UP");
   }

   @GetMapping("/participation")
   public ResponseEntity<?> getParticipation() {
      try {
         return ResponseEntity.ok(gitHubService.getParticipationStats());
      } catch (Exception e) {
         e.printStackTrace();
         return ResponseEntity
               .status(HttpStatus.INTERNAL_SERVER_ERROR)
               .body(Map.of(
                     "error", "Failed to fetch participation stats",
                     "message", e.getMessage()));
      }
   }

   @GetMapping("/contributors")
   public ResponseEntity<?> getContributors() {
      try {
         return ResponseEntity.ok(gitHubService.getContributorsStats());
      } catch (Exception e) {
         e.printStackTrace();
         return ResponseEntity
               .status(HttpStatus.INTERNAL_SERVER_ERROR)
               .body(Map.of(
                     "error", "Failed to fetch contributors stats",
                     "message", e.getMessage()));
      }
   }

}