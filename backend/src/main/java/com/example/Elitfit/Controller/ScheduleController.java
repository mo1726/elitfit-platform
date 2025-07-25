package com.example.Elitfit.Controller;

import com.example.Elitfit.Dto.BookingDto;
import com.example.Elitfit.Entity.Booking;
import com.example.Elitfit.Entity.User;
import com.example.Elitfit.Repository.BookingRepository;
import com.example.Elitfit.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.core.Authentication;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/schedule")
@RequiredArgsConstructor
public class ScheduleController {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;

    @PreAuthorize("hasRole('TRAINER')")
    @GetMapping("/trainer")
    public ResponseEntity<List<BookingDto>> getTrainerSchedule(Authentication authentication) {
        String email = authentication.getName();
        User trainerUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Assuming Booking entity has FitnessClass which has Trainer which has User
        List<Booking> bookings = bookingRepository.findByFitnessClass_Trainer_User_Id(trainerUser.getId());

        List<BookingDto> bookingDtos = bookings.stream()
                .map(booking -> mapToDto(booking))
                .collect(Collectors.toList());

        return ResponseEntity.ok(bookingDtos);
    }

    private BookingDto mapToDto(Booking booking) {
        return BookingDto.builder()
                .id(booking.getId())
                .userId(booking.getUser().getId())
                .userName(booking.getUser().getName())
                .classId(booking.getFitnessClass().getId())
                .classTitle(booking.getFitnessClass().getTitle())
                .bookedAt(booking.getBookedAt())
                .status(booking.getStatus())
                .build();
    }
}
