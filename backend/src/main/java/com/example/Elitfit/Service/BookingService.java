package com.example.Elitfit.Service;

import com.example.Elitfit.Dto.BookingDto;
import com.example.Elitfit.Dto.FeedbackDto;

import java.util.List;

public interface BookingService {
    BookingDto bookClass(BookingDto dto, String email);

    List<BookingDto> getAllBookings();
    List<BookingDto> getBookingsByUser(Long userId);
    void cancelBooking(Long id);
    List<BookingDto> getBookingsByUserEmail(String email);
    BookingDto updateBooking(Long id, BookingDto dto);
    void deleteBooking(Long id);
    void submitFeedback(FeedbackDto feedbackDto);


}
