package com.example.Elitfit.Dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MemberProfileDto {
    private Long userId;
    private String name;
    private String email;
    private Long trainerId;
    private Long planId;
    private LocalDate startDate;
    private LocalDate endDate;
    private boolean active;
    private String membershipPlanName;
}
