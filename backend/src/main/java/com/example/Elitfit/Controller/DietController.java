package com.example.Elitfit.Controller;

import com.example.Elitfit.Dto.DietEntryDto;
import com.example.Elitfit.Dto.DietPlanDto;
import com.example.Elitfit.Entity.DietEntry;
import com.example.Elitfit.Entity.DietPlan;
import com.example.Elitfit.Entity.User;
import com.example.Elitfit.Entity.Member;
import com.example.Elitfit.Repository.UserRepository;
import com.example.Elitfit.Repository.MemberRepository;
import com.example.Elitfit.Service.DietService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;

import java.util.List;

@RestController
@RequestMapping("/diet")
@RequiredArgsConstructor
public class DietController {

    private final DietService dietService;
    private final UserRepository userRepository;
    private final MemberRepository memberRepository;

    // ✅ Create diet plan
    @PostMapping("/plan")
    @PreAuthorize("hasRole('TRAINER')")
    public ResponseEntity<DietPlanDto> createPlan(@RequestBody DietPlanDto plan) {
        return ResponseEntity.ok(dietService.createDietPlan(plan));
    }

    // ✅ Create meal entry
    @PostMapping("/entry")
    @PreAuthorize("hasRole('TRAINER')")
    public ResponseEntity<DietEntry> createEntry(@RequestBody DietEntryDto dto) {
        DietEntry entry = new DietEntry();
        entry.setDay(dto.getDay());
        entry.setTime(dto.getTime());
        entry.setMeal(dto.getMeal());

        DietPlan plan = new DietPlan();
        plan.setId(dto.getDietPlanId());
        entry.setDietPlan(plan);

        return ResponseEntity.ok(dietService.saveEntry(entry));
    }

    // ✅ Get full plan by plan ID (used by trainer edit view)
    @GetMapping("/plan/{id}")
    @PreAuthorize("hasRole('TRAINER')")
    public ResponseEntity<DietPlanDto> getPlanById(@PathVariable Long id) {
        DietPlan plan = dietService.getDietPlanById(id);
        return ResponseEntity.ok(dietService.convertToDto(plan));
    }

    // ✅ NEW: Allow MEMBER to fetch their OWN diet plan using token
    @GetMapping("/plan/me")
    @PreAuthorize("hasRole('MEMBER')")
    public ResponseEntity<DietPlanDto> getMyPlan(Authentication authentication) {
        Long userId = extractUserId(authentication);

        Member member = memberRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("No member profile found"));

        DietPlan plan = dietService.findByMemberId(member.getId());
        if (plan == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(dietService.convertToDto(plan));
    }

    // ✅ List of plans for a specific trainer
    @GetMapping("/plan/trainer")
    @PreAuthorize("hasRole('TRAINER')")
    public ResponseEntity<List<DietPlan>> getTrainerPlans(Authentication authentication) {
        Long userId = extractUserId(authentication);
        return ResponseEntity.ok(dietService.getDietPlansByTrainer(userId));
    }

    // ✅ Entries by plan ID
    @GetMapping("/entries/{planId}")
    @PreAuthorize("hasAnyRole('TRAINER', 'MEMBER')")
    public ResponseEntity<List<DietEntry>> getEntries(@PathVariable Long planId) {
        return ResponseEntity.ok(dietService.getEntriesByPlanId(planId));
    }

    // ✅ Update individual entry
    @PutMapping("/entry/{entryId}")
    @PreAuthorize("hasRole('TRAINER')")
    public ResponseEntity<DietEntry> updateEntry(@PathVariable Long entryId, @RequestBody UpdateMealRequest request) {
        return ResponseEntity.ok(dietService.updateDietEntry(entryId, request.getMeal()));
    }

    // ✅ Get plan by member ID (used by trainers only)
    @GetMapping("/plan/member/{memberId}")
    @PreAuthorize("hasRole('TRAINER')")
    public ResponseEntity<DietPlanDto> getPlanByMemberId(@PathVariable Long memberId) {
        DietPlan plan = dietService.findByMemberId(memberId);
        if (plan != null) {
            return ResponseEntity.ok(dietService.convertToDto(plan));
        }
        return ResponseEntity.notFound().build();
    }

    // ✅ Utility: Extract user ID from token
    private Long extractUserId(Authentication authentication) {
        if (authentication == null || authentication.getName() == null) {
            throw new RuntimeException("Unauthenticated access");
        }
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
        return user.getId();
    }

    // ✅ Inner class for meal update
    @Data
    public static class UpdateMealRequest {
        private String meal;
    }
}
