package com.example.Elitfit.Controller;

import com.example.Elitfit.Dto.MemberDto;
import com.example.Elitfit.Dto.TrainerDto;
import com.example.Elitfit.Entity.User;
import com.example.Elitfit.Repository.UserRepository;
import com.example.Elitfit.Service.TrainerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;

import java.util.List;

@RestController
@RequestMapping("/trainers")
@RequiredArgsConstructor
public class TrainerController {

    private final TrainerService trainerService;
    private final UserRepository  userRepository;

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<TrainerDto> create(@RequestBody TrainerDto dto) {
        return ResponseEntity.ok(trainerService.createTrainer(dto));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<TrainerDto> update(@PathVariable Long id, @RequestBody TrainerDto dto) {
        return ResponseEntity.ok(trainerService.updateTrainer(id, dto));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        trainerService.deleteTrainer(id);
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'TRAINER', 'MEMBER')")
    @GetMapping
    public ResponseEntity<List<TrainerDto>> getAll() {
        return ResponseEntity.ok(trainerService.getAllTrainers());
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'TRAINER', 'MEMBER')")
    @GetMapping("/{id}")
    public ResponseEntity<TrainerDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(trainerService.getTrainerById(id));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<TrainerDto> getByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(trainerService.getTrainerByUserId(userId));
    }
    @GetMapping("/members")
    @PreAuthorize("hasRole('TRAINER')")
    public ResponseEntity<List<MemberDto>> getAllMembersByTrainer(Authentication authentication) {
        // authentication.getName() is likely username/email, not userId
        String username = authentication.getName();

        // Lookup User entity by username (email)
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Long trainerUserId = user.getId();

        List<MemberDto> members = trainerService.getMembersByTrainerUserId(trainerUserId);
        return ResponseEntity.ok(members);
    }



}
