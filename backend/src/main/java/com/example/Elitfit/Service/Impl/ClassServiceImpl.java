package com.example.Elitfit.Service.Impl;

import com.example.Elitfit.Dto.ClassDto;
import com.example.Elitfit.Entity.FitnessClass;
import com.example.Elitfit.Entity.Trainer;
import com.example.Elitfit.Repository.ClassRepository;
import com.example.Elitfit.Repository.TrainerRepository;
import com.example.Elitfit.Service.ClassService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ClassServiceImpl implements ClassService {

    private final ClassRepository classRepo;
    private final TrainerRepository trainerRepo;
    private final ClassRepository classRepository;
    private final TrainerRepository trainerRepository;

    public ClassDto createClass(ClassDto dto, Long authenticatedUserId) {
        Trainer trainer = trainerRepo.findByUserId(authenticatedUserId)
                .orElseThrow(() -> new EntityNotFoundException("Trainer not found"));

        FitnessClass fc = FitnessClass.builder()
                .title(dto.getTitle())
                .description(dto.getDescription())
                .startTime(dto.getStartTime())
                .endTime(dto.getEndTime())
                .maxParticipants(dto.getMaxParticipants())
                .trainer(trainer)
                .build();

        fc = classRepo.save(fc);
        return mapToDto(fc);
    }
    @Override
    public ClassDto createClassAdmin(ClassDto dto) {
        if (dto.getTrainerId() == null) {
            throw new IllegalArgumentException("TrainerId must not be null for admin class creation");
        }
        Trainer trainer = trainerRepo.findById(dto.getTrainerId())
                .orElseThrow(() -> new EntityNotFoundException("Trainer not found"));

        FitnessClass fc = FitnessClass.builder()
                .title(dto.getTitle())
                .description(dto.getDescription())
                .startTime(dto.getStartTime())
                .endTime(dto.getEndTime())
                .maxParticipants(dto.getMaxParticipants())
                .trainer(trainer)
                .build();

        fc = classRepo.save(fc);
        return mapToDto(fc);
    }

    @Override
    public List<ClassDto> getAllClasses() {
        return classRepo.findAll().stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Override
    public ClassDto getClassById(Long id) {
        FitnessClass fc = classRepo.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Class not found"));
        return mapToDto(fc);
    }

    @Override
    public ClassDto updateClass(Long id, ClassDto dto) {
        FitnessClass fc = classRepo.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Class not found"));

        fc.setTitle(dto.getTitle());
        fc.setDescription(dto.getDescription());
        fc.setStartTime(dto.getStartTime());
        fc.setEndTime(dto.getEndTime());
        fc.setMaxParticipants(dto.getMaxParticipants());

        classRepo.save(fc);
        return mapToDto(fc);
    }

    @Override
    public void deleteClass(Long id) {
        classRepo.deleteById(id);
    }

    private ClassDto mapToDto(FitnessClass fc) {
        return ClassDto.builder()
                .id(fc.getId())
                .title(fc.getTitle())
                .description(fc.getDescription())
                .startTime(fc.getStartTime())
                .endTime(fc.getEndTime())
                .maxParticipants(fc.getMaxParticipants())
                .trainerId(fc.getTrainer().getId())
                .trainerName(fc.getTrainer().getUser().getName())
                .build();
    }
    @Override
    public List<ClassDto> getUpcomingClasses() {
        return classRepo.findUpcoming()
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }
    @Override
    public List<ClassDto> getClassesByTrainerUserId(Long userId) {
        List<FitnessClass> classes = classRepository.findByTrainer_User_Id(userId);
        return classes.stream().map(this::mapToDto).collect(Collectors.toList());
    }




    // ✅ NEW — cette méthode utilise trainer.id directement (BookClassPage envoie ceci)
    @Override
    public List<ClassDto> getClassesByTrainerId(Long trainerId) {
        Optional<Trainer> trainerOpt = trainerRepository.findById(trainerId);
        if (trainerOpt.isEmpty()) {
            return Collections.emptyList();
        }
        Trainer trainer = trainerOpt.get();
        List<FitnessClass> classes = classRepository.findByTrainer(trainer);
        return classes.stream().map(this::mapToDto).collect(Collectors.toList());
    }



}
