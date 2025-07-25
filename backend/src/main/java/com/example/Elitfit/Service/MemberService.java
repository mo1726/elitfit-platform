package com.example.Elitfit.Service;

import com.example.Elitfit.Dto.MemberDto;
import com.example.Elitfit.Dto.MemberProfileDto;
import com.example.Elitfit.Entity.Member;

import java.util.List;

public interface MemberService {
    MemberDto subscribe(MemberDto dto); // free plans only
    MemberDto upgrade(MemberDto dto);   // after payment
    MemberDto getMyMembership(Long userId);
    List<MemberDto> getMembersWithoutPlan();
    MemberProfileDto getProfile(String email);
    MemberDto updateTrainer(Long userId, Long trainerId);
    void deactivateMember(Long userId);

}

