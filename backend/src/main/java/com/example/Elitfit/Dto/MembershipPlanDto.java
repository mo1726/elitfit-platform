package com.example.Elitfit.Dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MembershipPlanDto {
    private Long id;
    private String name;
    private double price;
    private int durationInDays;
    private String description;
}
