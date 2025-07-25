package com.example.Elitfit.Service;

import com.example.Elitfit.Dto.MemberDto;
import com.example.Elitfit.Dto.TrainerDto;

import java.util.List;

public interface TrainerService {
    TrainerDto createTrainer(TrainerDto dto);
    TrainerDto updateTrainer(Long id, TrainerDto dto);
    void deleteTrainer(Long id);
    TrainerDto getTrainerById(Long id);
    TrainerDto getTrainerByUserId(Long userId);
    List<TrainerDto> getAllTrainers();
    List<MemberDto> getMembersByTrainerUserId(Long trainerUserId);
}
