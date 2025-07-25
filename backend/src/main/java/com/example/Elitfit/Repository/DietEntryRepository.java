package com.example.Elitfit.Repository;

import com.example.Elitfit.Entity.DietEntry;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DietEntryRepository extends JpaRepository<DietEntry, Long> {
    List<DietEntry> findByDietPlanId(Long planId);
}
