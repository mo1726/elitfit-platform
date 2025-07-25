    package com.example.Elitfit.Dto;

    import lombok.*;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public class TrainerDto {
        private Long id;
        private String specialization;
        private Long userId;
        private String name; // to display in frontend
    }
