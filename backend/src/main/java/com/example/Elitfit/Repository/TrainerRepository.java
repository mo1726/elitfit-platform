package com.example.Elitfit.Repository;


import com.example.Elitfit.Entity.Trainer;
import com.example.Elitfit.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TrainerRepository extends JpaRepository<Trainer, Long> {


    Optional<Trainer> findByUser(User user);
    Optional<Trainer> findByUserId(Long userId);

}
