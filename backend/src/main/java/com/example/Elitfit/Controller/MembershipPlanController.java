package com.example.Elitfit.Controller;

import com.example.Elitfit.Dto.MembershipPlanDto;
import com.example.Elitfit.Service.MembershipPlanService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/membership-plans")
@RequiredArgsConstructor
public class MembershipPlanController {

    private final MembershipPlanService membershipPlanService;

    // Only ADMINs can create or delete plans
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<MembershipPlanDto> create(@RequestBody MembershipPlanDto dto) {
        return ResponseEntity.ok(membershipPlanService.create(dto));
    }

    // Trainers and Admins can view plans

    @GetMapping
    public ResponseEntity<List<MembershipPlanDto>> getAll() {
        return ResponseEntity.ok(membershipPlanService.getAll());
    }

    // Members can view a specific plan
    @PreAuthorize("hasAnyRole('MEMBER', 'TRAINER', 'ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<MembershipPlanDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(membershipPlanService.getById(id));
    }


    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<MembershipPlanDto> update(@PathVariable Long id, @RequestBody MembershipPlanDto dto) {
        return ResponseEntity.ok(membershipPlanService.update(id, dto));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        membershipPlanService.delete(id);
        return ResponseEntity.ok().build();
    }

}
