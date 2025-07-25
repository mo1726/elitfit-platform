package com.example.Elitfit.Repository;

import com.example.Elitfit.Entity.DietPlan;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface DietPlanRepository extends JpaRepository<DietPlan, Long> {
    List<DietPlan> findByMemberUserId(Long userId);
    List<DietPlan> findByTrainerUserId(Long userId);
    Optional<DietPlan> findFirstByMemberId(Long memberId);


}
