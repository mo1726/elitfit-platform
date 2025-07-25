package com.example.Elitfit.Dto;

import com.example.Elitfit.Entity.BookingStatus;
import lombok.*;

import java.time.LocalDateTime;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookingDto {
    private Long id;
    private Long userId;
    private String userName;
    private String trainername;
    private Long classId;
    private String classTitle;
    private LocalDateTime bookedAt;
    private String specialization;
    private BookingStatus status;
}
