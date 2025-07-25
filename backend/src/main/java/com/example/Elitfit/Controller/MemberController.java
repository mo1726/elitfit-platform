package com.example.Elitfit.Controller;

import com.example.Elitfit.Dto.ActivateMembershipRequest;
import com.example.Elitfit.Dto.MemberDto;
import com.example.Elitfit.Dto.MemberProfileDto;
import com.example.Elitfit.Entity.Member;
import com.example.Elitfit.Entity.User;
import com.example.Elitfit.Repository.MemberRepository;
import com.example.Elitfit.Repository.UserRepository;
import com.example.Elitfit.Service.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/member")
@RequiredArgsConstructor
public class MemberController {

    private final MemberService memberService;
    private final MemberRepository memberRepository;
    private final UserRepository userRepository;


    // ✅ Subscribe as member
    @PostMapping("/subscribe")
    public ResponseEntity<?> subscribe(@RequestBody MemberDto dto) {
        try {
            return ResponseEntity.ok(memberService.subscribe(dto));
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // ✅ Upgrade plan
    // ترقية العضوية - فقط ADMIN
    @PostMapping("/upgrade")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> upgrade(@RequestBody MemberDto dto) {
        if (dto.getUserId() == null) {
            return ResponseEntity.badRequest().body("User ID is required");
        }
        try {
            MemberDto updated = memberService.upgrade(dto);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/profile")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<MemberProfileDto> getProfile(Authentication auth) {
        String email = auth.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Member member = memberRepository.findByUser(user).orElse(null);

        MemberProfileDto profile = MemberProfileDto.builder()
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

        return ResponseEntity.ok(profile);
    }
    @GetMapping("/active")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<MemberDto>> getActiveMembersNearExpiry() {
        LocalDate today = LocalDate.now();
        LocalDate after7Days = today.plusDays(7);
        List<Member> members = memberRepository.findByEndDateBetweenAndActiveTrue(today, after7Days);

        List<MemberDto> dtos = members.stream().map(member -> {
            MemberDto dto = new MemberDto();
            dto.setId(member.getId());
            dto.setUserId(member.getUser().getId());  // تعيين userId هنا
            dto.setTrainerId(member.getTrainer() != null ? member.getTrainer().getId() : null);
            dto.setPlanId(member.getMembershipPlan() != null ? member.getMembershipPlan().getId() : null);
            dto.setStartDate(member.getStartDate());
            dto.setEndDate(member.getEndDate());
            dto.setActive(member.isActive());
            dto.setMembershipPlanName(member.getMembershipPlan() != null ? member.getMembershipPlan().getName() : null);
            return dto;
        }).toList();

        return ResponseEntity.ok(dtos);
    }



    @PutMapping("/activate/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> activateMembership(
            @PathVariable Long userId,
            @RequestBody ActivateMembershipRequest request) {

        Member member = memberRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("Member not found"));

        member.setActive(true);

        if (request.getEndDate() != null && !request.getEndDate().isEmpty()) {
            member.setEndDate(LocalDate.parse(request.getEndDate()));
        }

        memberRepository.save(member);
        return ResponseEntity.ok("Membership activated manually with end date.");
    }

    @PutMapping("/deactivate/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deactivateMember(@PathVariable Long userId) {
        try {
            memberService.deactivateMember(userId);
            return ResponseEntity.ok("Member deactivated successfully");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }


    // ✅ Get member by userId (for ADMIN or TRAINER only)
    @GetMapping("/{userId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TRAINER')")
    public ResponseEntity<MemberDto> getMembership(@PathVariable Long userId) {
        return ResponseEntity.ok(memberService.getMyMembership(userId));
    }

    // ✅ Get current member info (safe even if no plan)
    @GetMapping("/me")
    @PreAuthorize("hasRole('MEMBER') or hasRole('TRAINER')")
    public ResponseEntity<MemberDto> getMyMembershipAsMember(Authentication auth) {
        String email = auth.getName();
        User user = userRepository.findByEmail(email).orElseThrow();

        return memberRepository.findByUser(user)
                .map(member -> {
                    MemberDto dto = MemberDto.builder()
                            .id(member.getId())
                            .userId(user.getId())
                            .trainerId(member.getTrainer() != null ? member.getTrainer().getId() : null)
                            .planId(member.getMembershipPlan() != null ? member.getMembershipPlan().getId() : null)
                            .active(member.isActive())
                            .startDate(member.getStartDate())
                            .endDate(member.getEndDate())
                            .membershipPlanName(member.getMembershipPlan() != null ? member.getMembershipPlan().getName() : null)
                            .build();
                    return ResponseEntity.ok(dto);
                })
                .orElseGet(() -> {
                    MemberDto empty = MemberDto.builder()
                            .userId(user.getId())
                            .active(false)
                            .build();
                    return ResponseEntity.ok(empty);
                });
    }

    // ✅ Get members assigned to current trainer
    // MemberController.java
    @GetMapping("/my-members")
    @PreAuthorize("hasRole('TRAINER')")
    public ResponseEntity<List<MemberDto>> getMembersForTrainer(Authentication auth) {
        String email = auth.getName();
        User trainerUser = userRepository.findByEmail(email).orElseThrow();
        List<Member> members = memberRepository.findByTrainerUserId(trainerUser.getId());

        List<MemberDto> dtos = members.stream().map(m -> MemberDto.builder()
                .id(m.getId())
                .userId(m.getUser().getId())
                .trainerId(trainerUser.getId())
                .name(m.getUser().getName())
                .build()).toList();

        return ResponseEntity.ok(dtos);
    }





    // ✅ List of pending members (ADMIN only)
    @GetMapping("/pending")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Member>> getPendingMemberships() {
        return ResponseEntity.ok(memberRepository.findByActiveFalse());
    }


    // ✅ Get members without any plan (ADMIN only)
    @GetMapping("/members-without-plan")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<MemberDto>> getMembersWithoutPlan() {
        return ResponseEntity.ok(memberService.getMembersWithoutPlan());
    }


    // ✅ Check if member is active
    @GetMapping("/isActive/{userId}")
    public ResponseEntity<Boolean> checkIfActive(@PathVariable Long userId) {
        return ResponseEntity.ok(memberRepository.findByUserId(userId)
                .map(Member::isActive)
                .orElse(false));
    }
    @PutMapping("/trainer/{userId}")
    @PreAuthorize("hasRole('MEMBER')")
    public ResponseEntity<MemberDto> updateTrainer(
            @PathVariable Long userId,
            @RequestBody Map<String, Long> body) {

        Long trainerId = body.get("trainerId");
        MemberDto updatedMember = memberService.updateTrainer(userId, trainerId);
        return ResponseEntity.ok(updatedMember);
    }

}
