package com.example.Elitfit.Service.Impl;

import com.example.Elitfit.Dto.MembershipPlanDto;
import com.example.Elitfit.Entity.MembershipPlan;
import com.example.Elitfit.Repository.MembershipPlanRepository;
import com.example.Elitfit.Service.MembershipPlanService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MembershipPlanServiceImpl implements MembershipPlanService {

    private final MembershipPlanRepository repository;

    private MembershipPlanDto mapToDto(MembershipPlan plan) {
        return MembershipPlanDto.builder()
                .id(plan.getId())
                .name(plan.getName())
                .price(plan.getPrice())
                .durationInDays(plan.getDurationInDays())
                .description(plan.getDescription())
                .build();
    }

    private MembershipPlan mapToEntity(MembershipPlanDto dto) {
        return MembershipPlan.builder()
                .name(dto.getName())
                .price(dto.getPrice())
                .durationInDays(dto.getDurationInDays())
                .description(dto.getDescription())
                .build();
    }

    @Override
    public MembershipPlanDto create(MembershipPlanDto dto) {
        MembershipPlan plan = mapToEntity(dto);
        return mapToDto(repository.save(plan));
    }

    @Override
    public List<MembershipPlanDto> getAll() {
        return repository.findAll().stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Override
    public MembershipPlanDto getById(Long id) {
        return repository.findById(id).map(this::mapToDto)
                .orElseThrow(() -> new RuntimeException("Plan not found"));
    }

    @Override
    public MembershipPlanDto update(Long id, MembershipPlanDto dto) {
        MembershipPlan plan = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Plan not found"));
        plan.setName(dto.getName());
        plan.setPrice(dto.getPrice());
        plan.setDurationInDays(dto.getDurationInDays());
        plan.setDescription(dto.getDescription());
        return mapToDto(repository.save(plan));
    }

    @Override
    public void delete(Long id) {
        repository.deleteById(id);
    }
}
