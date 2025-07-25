package com.example.Elitfit.Service.Impl;

import com.example.Elitfit.Dto.DietEntryDto;
import com.example.Elitfit.Dto.DietPlanDto;
import com.example.Elitfit.Dto.MemberShortDto;
import com.example.Elitfit.Dto.TrainerShortDto;
import com.example.Elitfit.Entity.*;
import com.example.Elitfit.Repository.*;
import com.example.Elitfit.Service.DietService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DietServiceImpl implements DietService {

    private final DietPlanRepository dietPlanRepository;
    private final DietEntryRepository dietEntryRepository;
    private final MemberRepository memberRepository;
    private final TrainerRepository trainerRepository;
    private final UserRepository userRepository;

    @Override
    public DietPlanDto createDietPlan(DietPlanDto dto) {
        System.out.println("▶ [createDietPlan] Incoming DTO: " + dto);

        Member member = memberRepository.findById(dto.getMember().getId())
                .orElseThrow(() -> {
                    System.out.println("❌ Member with ID " + dto.getMember().getId() + " not found.");
                    return new RuntimeException("Member not found");
                });

        // ✅ الحل: نستخدم findByUserId لأنه frontend يرسل userId
        Trainer trainer = trainerRepository.findByUserId(dto.getTrainer().getId())
                .orElseThrow(() -> {
                    System.out.println("❌ Trainer with USER ID " + dto.getTrainer().getId() + " not found.");
                    return new RuntimeException("Trainer not found");
                });

        DietPlan plan = new DietPlan();
        plan.setTitle(dto.getTitle());
        plan.setStartDate(dto.getStartDate());
        plan.setEndDate(dto.getEndDate());
        plan.setMember(member);
        plan.setTrainer(trainer);

        if (dto.getEntries() != null) {
            List<DietEntry> entries = dto.getEntries().stream().map(entryDto -> {
                DietEntry entry = new DietEntry();
                entry.setDay(entryDto.getDay());
                entry.setTime(entryDto.getTime());
                entry.setMeal(entryDto.getMeal());
                entry.setDietPlan(plan);
                return entry;
            }).collect(Collectors.toList());
            plan.setEntries(entries);
        }

        DietPlan savedPlan = dietPlanRepository.save(plan);
        System.out.println("✅ Diet plan saved: " + savedPlan.getId());

        return convertToDto(savedPlan);
    }

    @Override
    public DietPlan findByMemberId(Long memberId) {
        return dietPlanRepository.findFirstByMemberId(memberId).orElse(null);
    }




    @Override
    public DietPlanDto convertToDto(DietPlan plan) {
        DietPlanDto dto = new DietPlanDto();
        dto.setId(plan.getId());
        dto.setTitle(plan.getTitle());
        dto.setStartDate(plan.getStartDate());
        dto.setEndDate(plan.getEndDate());

        MemberShortDto memberDto = new MemberShortDto();
        memberDto.setId(plan.getMember().getId());
        memberDto.setName(plan.getMember().getUser().getName());
        dto.setMember(memberDto);

        TrainerShortDto trainerDto = new TrainerShortDto();
        trainerDto.setId(plan.getTrainer().getId());
        trainerDto.setName(plan.getTrainer().getUser().getName());
        dto.setTrainer(trainerDto);

        // ✅ This part is CRUCIAL:
        if (plan.getEntries() != null) {
            List<DietEntryDto> entryDtos = plan.getEntries().stream().map(entry -> {
                DietEntryDto entryDto = new DietEntryDto();
                entryDto.setId(entry.getId());
                entryDto.setDay(entry.getDay());
                entryDto.setTime(entry.getTime());
                entryDto.setMeal(entry.getMeal());
                entryDto.setDietPlanId(plan.getId());
                return entryDto;
            }).collect(Collectors.toList());
            dto.setEntries(entryDtos);
        }

        return dto;
    }


    @Override
    public DietPlan getDietPlanById(Long id) {
        return dietPlanRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Diet plan not found"));
    }


    @Override
    public DietEntry saveEntry(DietEntry entry) {
        return dietEntryRepository.save(entry);
    }

    @Override
    public List<DietPlan> getDietPlansByMember(Long userId) {
        return dietPlanRepository.findByMemberUserId(userId);
    }

    @Override
    public List<DietPlan> getDietPlansByTrainer(Long trainerUserId) {
        return dietPlanRepository.findByTrainerUserId(trainerUserId);
    }

    @Override
    public List<DietEntry> getEntriesByPlanId(Long planId) {
        return dietEntryRepository.findByDietPlanId(planId);
    }

    @Override
    public DietEntry updateDietEntry(Long entryId, String newMeal) {
        DietEntry entry = dietEntryRepository.findById(entryId)
                .orElseThrow(() -> new RuntimeException("Diet entry not found"));
        entry.setMeal(newMeal);
        return dietEntryRepository.save(entry);
    }

    @Override
    public Long getUserIdByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"))
                .getId();
    }
}
