package com.example.Elitfit.Dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PerformanceDto {
    private int totalBookings;
    private int attendedSessions;
    private int cancelledSessions;
    private double averageFeedbackScore;
}
