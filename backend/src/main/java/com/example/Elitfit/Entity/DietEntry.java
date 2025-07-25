package com.example.Elitfit.Entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DietEntry {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String day; // e.g. Monday
    private String time; // e.g. Breakfast
    private String meal; // e.g. 2 eggs and toast

    @ManyToOne
    @JoinColumn(name = "diet_plan_id")
    private DietPlan dietPlan;
}
