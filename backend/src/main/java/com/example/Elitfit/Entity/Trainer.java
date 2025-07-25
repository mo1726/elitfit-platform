package com.example.Elitfit.Entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Trainer {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String specialization;



    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;
}
