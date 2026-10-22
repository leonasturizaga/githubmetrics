// TeamMetricsResponse.java
package com.example.githubmetrics.dto;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class TeamMetricsResponse {
    private String repo;
    private String baseBranch;
    private List<MemberMetricDto> members;
}