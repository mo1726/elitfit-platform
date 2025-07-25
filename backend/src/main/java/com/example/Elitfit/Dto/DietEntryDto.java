package com.example.Elitfit.Dto;

import lombok.Data;

@Data
public class DietEntryDto {
    private Long id;
    private String day;
    private String time; // Replaces mealType
    private String meal;
    private Long dietPlanId;
}
