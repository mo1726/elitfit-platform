package com.example.Elitfit.Service.Impl;


import com.example.Elitfit.Dto.MemberDto;
import com.example.Elitfit.Dto.MemberProfileDto;
import com.example.Elitfit.Entity.Member;

import com.example.Elitfit.Entity.MembershipPlan;
import com.example.Elitfit.Entity.Trainer;
import com.example.Elitfit.Entity.User;
import com.example.Elitfit.Repository.MemberRepository;
import com.example.Elitfit.Repository.MembershipPlanRepository;
import com.example.Elitfit.Repository.TrainerRepository;
import com.example.Elitfit.Repository.UserRepository;
import com.example.Elitfit.Service.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
public class MemberServiceImpl implements MemberService {

    private final MemberRepository memberRepository;
    private final UserRepository userRepository;
    private final TrainerRepository trainerRepository;
    private final MembershipPlanRepository planRepository;


    @Override
    public MemberDto subscribe(MemberDto dto) {
        Optional<Member> existing = memberRepository.findByUserId(dto.getUserId());

        if (existing.isPresent()) {
            // ✅ Update existing member (instead of throwing error)
            Member member = existing.get();
            member.setMembershipPlan(planRepository.findById(dto.getPlanId()).orElseThrow());
            member.setStartDate(dto.getStartDate());
            member.setActive(true); // 🔥 re-activate
            memberRepository.save(member);
            return mapToDto(member);
        }

        // 🆕 New member subscription
        Member newMember = new Member();
        newMember.setUser(userRepository.findById(dto.getUserId()).orElseThrow());
        newMember.setMembershipPlan(planRepository.findById(dto.getPlanId()).orElseThrow());
        newMember.setStartDate(dto.getStartDate());
        newMember.setActive(true);

        memberRepository.save(newMember);
        return mapToDto(newMember);
    }

    public MemberDto updateTrainer(Long userId, Long trainerId) {
        Member member = memberRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Member not found"));

        if (trainerId == null) {
            member.setTrainer(null);  // if you want to allow clearing trainer
        } else {
            Trainer trainer = trainerRepository.findById(trainerId)
                    .orElseThrow(() -> new RuntimeException("Trainer not found with id: " + trainerId));
            member.setTrainer(trainer);
        }

        memberRepository.save(member);
        return mapToDto(member);
    }

    @Override
    public void deactivateMember(Long userId) {
        Optional<Member> memberOpt = memberRepository.findByUserId(userId);
        if (memberOpt.isEmpty()) {
            throw new IllegalArgumentException("Member not found for the given user ID");
        }

        Member member = memberOpt.get();
        member.setActive(false);
        member.setMembershipPlan(null); // Optional: also remove the plan
        member.setEndDate(null);        // Optional: reset end date
        memberRepository.save(member);
    }



    @Override
    public MemberProfileDto getProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Member member = memberRepository.findByUser(user).orElse(null);

        return MemberProfileDto.builder()
                .userId(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .trainerId(member != null && member.getTrainer() != null ? member.getTrainer().getId() : null)
                .planId(member != null && member.getMembershipPlan() != null ? member.getMembershipPlan().getId() : null)
                .startDate(member != null ? member.getStartDate() : null)
                .endDate(member != null ? member.getEndDate() : null)
                .active(member != null && member.isActive())
                .membershipPlanName(member != null && member.getMembershipPlan() != null ? member.getMembershipPlan().getName() : null)
                .build();
    }




    @Override
    public MemberDto upgrade(MemberDto dto) {
        Long userId = dto.getUserId();
        if (userId == null) {
            throw new IllegalArgumentException("User ID must be provided");
        }

        Member member = memberRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalStateException("Member not found for upgrade"));

        // تحديث الخطة وتواريخ البداية والنهاية
        MembershipPlan newPlan = planRepository.findById(dto.getPlanId())
                .orElseThrow(() -> new IllegalArgumentException("Plan not found"));

        member.setMembershipPlan(newPlan);
        member.setStartDate(dto.getStartDate());
        member.setEndDate(dto.getEndDate());
        member.setActive(dto.isActive());

        Member updatedMember = memberRepository.save(member);

        return mapToDto(updatedMember);
    }


    @Override
    public MemberDto getMyMembership(Long userId) {
        Member member = memberRepository.findByUserIdWithPlan(userId)
                .orElseThrow(() -> new RuntimeException("Member not found"));

        return MemberDto.builder()
                .userId(member.getUser().getId())
                .trainerId(member.getTrainer() != null ? member.getTrainer().getId() : null)
                .planId(member.getMembershipPlan() != null ? member.getMembershipPlan().getId() : null)
                .startDate(member.getStartDate())
                .endDate(member.getEndDate())
                .active(member.isActive())
                .membershipPlanName(member.getMembershipPlan() != null ? member.getMembershipPlan().getName() : null)
                .build();
    }


    public List<MemberDto> getMembersWithoutPlan() {
        return memberRepository.findByMembershipPlanIsNull()
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }


    private MemberDto mapToDto(Member member) {
        return MemberDto.builder()
                .id(member.getId())
                .userId(member.getUser().getId())
                .trainerId(member.getTrainer() != null ? member.getTrainer().getId() : null)
                .planId(member.getMembershipPlan() != null ? member.getMembershipPlan().getId() : null)
                .startDate(member.getStartDate())
                .endDate(member.getEndDate())
                .active(member.isActive())
                .membershipPlanName(member.getMembershipPlan() != null ? member.getMembershipPlan().getName() : null)
                .build();
    }



}