package com.example.Elitfit.Dto;

import com.example.Elitfit.Entity.Role;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthRequest {
    private String name;
    private String email;
    private String password;
    private Role role; // optional: ADMIN, TRAINER, MEMBER
}