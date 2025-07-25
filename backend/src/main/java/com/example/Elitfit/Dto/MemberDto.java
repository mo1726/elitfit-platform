package com.example.Elitfit.Dto;

import lombok.*;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MemberDto {
    private Long id;
    private Long userId;
    private String name;
    private String email;
    private Long trainerId;
    private Long planId;
    private LocalDate startDate;
    private LocalDate endDate;
    private boolean active;
    private String membershipPlanName; // ✅ هذا هو اللي ناقص
}
