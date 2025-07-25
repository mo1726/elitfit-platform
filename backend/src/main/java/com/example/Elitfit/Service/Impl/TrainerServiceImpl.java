package com.example.Elitfit.Service.Impl;

import com.example.Elitfit.Dto.MemberDto;
import com.example.Elitfit.Dto.TrainerDto;
import com.example.Elitfit.Entity.Member;
import com.example.Elitfit.Entity.Trainer;
import com.example.Elitfit.Entity.User;
import com.example.Elitfit.Repository.MemberRepository;
import com.example.Elitfit.Repository.TrainerRepository;
import com.example.Elitfit.Repository.UserRepository;
import com.example.Elitfit.Service.TrainerService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TrainerServiceImpl implements TrainerService {

    private final TrainerRepository trainerRepository;
    private final UserRepository userRepository;
    private final MemberRepository memberRepository; // Added for member fetching

    @Override
    public TrainerDto createTrainer(TrainerDto dto) {
        User user = userRepository.findById(dto.getUserId()).orElseThrow();

        Trainer trainer = Trainer.builder()
                .specialization(dto.getSpecialization())
                .user(user)
                .build();

        trainerRepository.save(trainer);
        return toDto(trainer);
    }

    @Override
    public TrainerDto updateTrainer(Long id, TrainerDto dto) {
        Trainer trainer = trainerRepository.findById(id).orElseThrow();

        trainer.setSpecialization(dto.getSpecialization());

        if (dto.getUserId() != null) {
            User user = userRepository.findById(dto.getUserId()).orElseThrow();
            trainer.setUser(user);
        }

        trainerRepository.save(trainer);
        return toDto(trainer);
    }

    @Override
    public void deleteTrainer(Long id) {
        trainerRepository.deleteById(id);
    }

    @Override
    public TrainerDto getTrainerById(Long id) {
        return toDto(trainerRepository.findById(id).orElseThrow());
    }

    @Override
    public TrainerDto getTrainerByUserId(Long userId) {
        return toDto(trainerRepository.findByUserId(userId).orElseThrow());
    }

    @Override
    public List<TrainerDto> getAllTrainers() {
        return trainerRepository.findAll().stream()
                .map(trainer -> TrainerDto.builder()
                        .id(trainer.getId())
                        .specialization(trainer.getSpecialization())
                        .userId(trainer.getUser().getId())
                        .name(trainer.getUser().getName())
                        .build())
                .collect(Collectors.toList());
    }

    @Override
    public List<MemberDto> getMembersByTrainerUserId(Long trainerUserId) {
        List<Member> members = memberRepository.findByTrainerUserId(trainerUserId);
        return members.stream()
                .map(this::mapToMemberDto)
                .collect(Collectors.toList());
    }

    private MemberDto mapToMemberDto(Member member) {
        return MemberDto.builder()
                .id(member.getId())
                .userId(member.getUser().getId())
                .name(member.getUser().getName())
                .email(member.getUser().getEmail())
                .trainerId(member.getTrainer() != null ? member.getTrainer().getId() : null)
                .planId(member.getMembershipPlan() != null ? member.getMembershipPlan().getId() : null)
                .startDate(member.getStartDate())
                .endDate(member.getEndDate())
                .active(member.isActive())
                .membershipPlanName(member.getMembershipPlan() != null ? member.getMembershipPlan().getName() : null)
                .build();
    }

    private TrainerDto toDto(Trainer trainer) {
        return TrainerDto.builder()
                .id(trainer.getId())
                .specialization(trainer.getSpecialization())
                .userId(trainer.getUser() != null ? trainer.getUser().getId() : null)
                .name(trainer.getUser() != null ? trainer.getUser().getName() : null)
                .build();
    }
}
