package com.example.Elitfit.Dto;

import com.example.Elitfit.Entity.Role;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class UserDto {
    private Long id;
    private String name;
    private String email;
    private Role role;
    private String planName;
    private String trainerName;
}
