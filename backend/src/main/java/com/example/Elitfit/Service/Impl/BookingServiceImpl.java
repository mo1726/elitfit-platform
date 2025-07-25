package com.example.Elitfit.Service.Impl;

import com.example.Elitfit.Dto.BookingDto;
import com.example.Elitfit.Dto.FeedbackDto;
import com.example.Elitfit.Entity.Booking;
import com.example.Elitfit.Entity.BookingStatus;
import com.example.Elitfit.Entity.FitnessClass;
import com.example.Elitfit.Entity.User;
import com.example.Elitfit.Repository.BookingRepository;
import com.example.Elitfit.Repository.ClassRepository;
import com.example.Elitfit.Repository.UserRepository;
import com.example.Elitfit.Service.BookingService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepo;
    private final UserRepository userRepo;
    private final ClassRepository classRepo;

    @Override
    public BookingDto bookClass(BookingDto dto, String email) {
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        FitnessClass fc = classRepo.findById(dto.getClassId())
                .orElseThrow(() -> new EntityNotFoundException("Class not found"));

        long bookingCount = bookingRepo.countByFitnessClassId(fc.getId());
        if (bookingCount >= fc.getMaxParticipants()) {
            throw new RuntimeException("Class is full");
        }

        Booking booking = Booking.builder()
                .user(user)
                .fitnessClass(fc)
                .bookedAt(LocalDateTime.now())
                .status(BookingStatus.BOOKED)
                .build();

        return mapToDto(bookingRepo.save(booking));
    }


    @Override
    public List<BookingDto> getAllBookings() {
        return bookingRepo.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<BookingDto> getBookingsByUser(Long userId) {
        return bookingRepo.findByUserId(userId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }



    @Override
    public List<BookingDto> getBookingsByUserEmail(String email) {
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));

        return getBookingsByUser(user.getId());
    }



    @Override
    public void deleteBooking(Long id) {
        Booking booking = bookingRepo.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Booking not found"));
        bookingRepo.delete(booking);
    }

    @Override
    public void cancelBooking(Long id) {
        Booking booking = bookingRepo.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Booking not found"));
        booking.setStatus(BookingStatus.CANCELLED);
        bookingRepo.save(booking);
    }

    @Override
    public BookingDto updateBooking(Long id, BookingDto dto) {
        Booking booking = bookingRepo.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Booking not found"));

        if (dto.getStatus() != null) {
            booking.setStatus(dto.getStatus());
        }
        if (dto.getClassId() != null) {
            FitnessClass fc = classRepo.findById(dto.getClassId())
                    .orElseThrow(() -> new EntityNotFoundException("Class not found"));
            booking.setFitnessClass(fc);
        }
        Booking updated = bookingRepo.save(booking);
        return mapToDto(updated);
    }
    @Override
    public void submitFeedback(FeedbackDto feedbackDto) {
        Booking booking = bookingRepo.findById(feedbackDto.getBookingId())
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        Integer score = feedbackDto.getFeedbackScore();
        if (score == null || score < 1 || score > 5) {
            throw new IllegalArgumentException("Feedback score must be between 1 and 5");
        }

        booking.setFeedbackScore(score);
        booking.setFeedbackText(feedbackDto.getFeedbackText());

        bookingRepo.save(booking);
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
