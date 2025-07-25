package com.example.Elitfit.Dto;

import lombok.Data;

@Data
public class FeedbackDto {
    private Long bookingId;
    private Integer feedbackScore;
    private String feedbackText;
}
