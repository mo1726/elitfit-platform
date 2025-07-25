package com.example.Elitfit.Controller;

import com.example.Elitfit.Dto.ClassDto;
import com.example.Elitfit.Entity.User;
import com.example.Elitfit.Repository.UserRepository;
import com.example.Elitfit.Service.ClassService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;

import java.util.List;

@RestController
@RequestMapping("/classes")
@RequiredArgsConstructor
public class ClassController {

    private final ClassService classService;
    private final UserRepository userRepository;

    // Create a new class (Admin only)
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/admin")
    public ResponseEntity<ClassDto> create(@RequestBody ClassDto dto) {
        return ResponseEntity.ok(classService.createClassAdmin(dto));
    }

    // Create a new class (Trainer only)
    @PreAuthorize("hasRole('TRAINER')")
    @PostMapping
    public ResponseEntity<ClassDto> create(@RequestBody ClassDto dto, Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        Long userId = user.getId();

        ClassDto created = classService.createClass(dto, userId);
        return ResponseEntity.ok(created);
    }

    // Update class (Admin or Trainer)
    @PreAuthorize("hasAnyRole('ADMIN', 'TRAINER')")
    @PutMapping("/{id}")
    public ResponseEntity<ClassDto> update(@PathVariable Long id, @RequestBody ClassDto dto) {
        return ResponseEntity.ok(classService.updateClass(id, dto));
    }

    // Get all classes (any authenticated user)
    @PreAuthorize("hasAnyRole('ADMIN', 'TRAINER', 'MEMBER')")
    @GetMapping
    public ResponseEntity<List<ClassDto>> getAll() {
        return ResponseEntity.ok(classService.getAllClasses());
    }

    // Get class by ID
    @PreAuthorize("hasAnyRole('ADMIN', 'TRAINER', 'MEMBER')")
    @GetMapping("/{id}")
    public ResponseEntity<ClassDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(classService.getClassById(id));
    }

    // Delete class (Admin only)
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        classService.deleteClass(id);
        return ResponseEntity.noContent().build();
    }

    // Get upcoming classes (Member only)
    @PreAuthorize("hasAnyRole('ADMIN', 'TRAINER', 'MEMBER')")
    @GetMapping("/upcoming")
    public ResponseEntity<List<ClassDto>> getUpcomingForMembers() {
        return ResponseEntity.ok(classService.getUpcomingClasses());
    }

    // Get classes for currently authenticated trainer
    @GetMapping("/trainer")
    @PreAuthorize("hasAnyRole('TRAINER', 'MEMBER')")
    public ResponseEntity<List<ClassDto>> getTrainerClasses(Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        Long userId = user.getId();
        List<ClassDto> classes = classService.getClassesByTrainerUserId(userId);
        return ResponseEntity.ok(classes);
    }

    // ClassController.java
    @GetMapping("/trainer/{userId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MEMBER')")
    public ResponseEntity<List<ClassDto>> getClassesByTrainerUserId(@PathVariable Long userId) {
        List<ClassDto> classes = classService.getClassesByTrainerUserId(userId);
        return ResponseEntity.ok(classes);
    }


}
