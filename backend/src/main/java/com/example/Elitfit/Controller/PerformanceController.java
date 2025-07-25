package com.example.Elitfit.Controller;

import com.example.Elitfit.Dto.PerformanceDto;
import com.example.Elitfit.Entity.User;
import com.example.Elitfit.Repository.UserRepository;
import com.example.Elitfit.Service.PerformanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/performance")
@RequiredArgsConstructor
public class PerformanceController {

    private final PerformanceService performanceService;
    private final UserRepository userRepository;

    @GetMapping("/trainer")
    @PreAuthorize("hasRole('TRAINER')")
    public ResponseEntity<PerformanceDto> getPerformance(Authentication authentication) {
        // Get currently logged in user by email from JWT token
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Call service to get performance stats for this trainer user ID
        PerformanceDto performanceDto = performanceService.getPerformanceStatsByTrainerUserId(user.getId());

        return ResponseEntity.ok(performanceDto);
    }
}
