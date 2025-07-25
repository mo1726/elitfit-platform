package com.example.Elitfit.Service;

import com.example.Elitfit.Dto.ClassDto;
import java.util.List;

public interface ClassService {
    // Add authenticatedUserId param here
    ClassDto createClass(ClassDto dto, Long authenticatedUserId);
    ClassDto createClassAdmin(ClassDto dto);
    List<ClassDto> getAllClasses();
    ClassDto getClassById(Long id);
    ClassDto updateClass(Long id, ClassDto dto);
    void deleteClass(Long id);
    List<ClassDto> getUpcomingClasses();
    List<ClassDto> getClassesByTrainerUserId(Long trainerUserId);
    List<ClassDto> getClassesByTrainerId(Long trainerId); // already exists


}
