package com.example.Elitfit.Service.Impl;

import com.example.Elitfit.Dto.PerformanceDto;
import com.example.Elitfit.Entity.Booking;
import com.example.Elitfit.Entity.BookingStatus;
import com.example.Elitfit.Repository.BookingRepository;
import com.example.Elitfit.Repository.TrainerRepository;
import com.example.Elitfit.Service.PerformanceService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PerformanceServiceImpl implements PerformanceService {

    private final BookingRepository bookingRepo;
    private final TrainerRepository trainerRepo;

    @Override
    public PerformanceDto getPerformanceStatsByTrainerUserId(Long trainerUserId) {
        // Fetch all bookings for trainer's classes
        List<Booking> bookings = bookingRepo.findByFitnessClass_Trainer_User_Id(trainerUserId);

        int totalBookings = bookings.size();



        int cancelled = (int) bookings.stream()
                .filter(b -> b.getStatus() == BookingStatus.CANCELLED)
                .count();

        double averageFeedback = bookings.stream()
                .filter(b -> b.getFeedbackScore() != null)
                .mapToInt(Booking::getFeedbackScore)
                .average()
                .orElse(0.0);

        return PerformanceDto.builder()
                .totalBookings(totalBookings)
                .cancelledSessions(cancelled)
                .averageFeedbackScore(averageFeedback)
                .build();
    }
}
