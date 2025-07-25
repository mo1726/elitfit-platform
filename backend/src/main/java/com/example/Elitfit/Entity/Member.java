package com.example.Elitfit.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Member {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    private User user;

    @ManyToOne
    private Trainer trainer;

    @ManyToOne
    private MembershipPlan membershipPlan;

    private LocalDate startDate;
    private LocalDate endDate;

    private boolean active;
    @Transient
    public boolean isActive() {
        return endDate != null && endDate.isAfter(LocalDate.now());
    }

}
