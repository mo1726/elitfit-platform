package com.example.Elitfit.Controller;

import com.example.Elitfit.Dto.BookingDto;
import com.example.Elitfit.Dto.FeedbackDto;
import com.example.Elitfit.Service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;

import java.util.List;

@RestController
@RequestMapping("/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @PostMapping
    @PreAuthorize("hasRole('MEMBER')")
    public ResponseEntity<BookingDto> book(@RequestBody BookingDto dto, Authentication authentication) {
        String email = authentication.getName(); // email from JWT token
        return ResponseEntity.ok(bookingService.bookClass(dto, email));
    }



    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<List<BookingDto>> getAll() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    @PreAuthorize("hasRole('MEMBER')")
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<BookingDto>> getByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(bookingService.getBookingsByUser(userId));
    }

    @PreAuthorize("hasRole('MEMBER')")
    @DeleteMapping("/cancel/{id}")
    public ResponseEntity<Void> cancel(@PathVariable Long id) {
        bookingService.cancelBooking(id);
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasRole('MEMBER')")
    @GetMapping("/member")
    public ResponseEntity<List<BookingDto>> getBookingsForCurrentMember(Authentication authentication) {
        String email = authentication.getName();
        List<BookingDto> bookings = bookingService.getBookingsByUserEmail(email);
        return ResponseEntity.ok(bookings);
    }
    @PreAuthorize("hasRole('MEMBER')")
    @PutMapping("/{id}")
    public ResponseEntity<BookingDto> updateBooking(@PathVariable Long id, @RequestBody BookingDto dto) {
        return ResponseEntity.ok(bookingService.updateBooking(id, dto));
    }

    @PreAuthorize("hasRole('MEMBER')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBooking(@PathVariable Long id) {
        bookingService.deleteBooking(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/feedback")
    public ResponseEntity<?> submitFeedback(@RequestBody FeedbackDto feedbackDto) {
        try {
            bookingService.submitFeedback(feedbackDto);
            return ResponseEntity.ok("Feedback submitted successfully");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }


}
