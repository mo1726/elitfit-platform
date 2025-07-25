package com.example.Elitfit.Entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Booking {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private User user;

    @ManyToOne
    private FitnessClass fitnessClass;

    private LocalDateTime bookedAt;

    @Enumerated(EnumType.STRING)
    private BookingStatus status;


    @Column(name = "feedback_score")
    private Integer feedbackScore;

    @Column(name = "feedback_text", columnDefinition = "TEXT")
    private String feedbackText;

}

