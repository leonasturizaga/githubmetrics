// MemberMetricDto.java
package com.example.githubmetrics.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class MemberMetricDto {
    private String username;
    private int totalPrs;
    private int mergedToDev;
    private int openPrs;
    private long totalAdditions;
    private long totalDeletions;
    private double avgFilesChanged;
    private String lastActivity;
}