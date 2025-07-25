package com.example.Elitfit.Service;

import com.example.Elitfit.Dto.PerformanceDto;

public interface PerformanceService {
    PerformanceDto getPerformanceStatsByTrainerUserId(Long trainerUserId);
}
