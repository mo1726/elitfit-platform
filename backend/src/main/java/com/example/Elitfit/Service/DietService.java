package com.example.Elitfit.Service;

import com.example.Elitfit.Dto.DietPlanDto;
import com.example.Elitfit.Entity.DietEntry;
import com.example.Elitfit.Entity.DietPlan;

import java.util.List;

public interface DietService {

    // Use DTO for creation from frontend
    DietPlanDto createDietPlan(DietPlanDto plan);



    List<DietPlan> getDietPlansByMember(Long userId);

    List<DietPlan> getDietPlansByTrainer(Long trainerUserId);

    List<DietEntry> getEntriesByPlanId(Long planId);

    DietEntry updateDietEntry(Long entryId, String newMeal);

    Long getUserIdByEmail(String email);
    DietEntry saveEntry(DietEntry entry);
    DietPlan getDietPlanById(Long id);
    DietPlanDto convertToDto(DietPlan plan); // باش تستعملها فالـ controller
    DietPlan findByMemberId(Long memberId);

}
