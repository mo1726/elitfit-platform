package com.example.Elitfit.Service;

import com.example.Elitfit.Dto.MembershipPlanDto;

import java.util.List;

public interface MembershipPlanService {
    MembershipPlanDto create(MembershipPlanDto dto);
    List<MembershipPlanDto> getAll();
    MembershipPlanDto getById(Long id);
    MembershipPlanDto update(Long id, MembershipPlanDto dto);
    void delete(Long id);
}
