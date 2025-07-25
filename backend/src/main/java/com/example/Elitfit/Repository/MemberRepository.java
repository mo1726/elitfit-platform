package com.example.Elitfit.Repository;

import com.example.Elitfit.Entity.Member;
import com.example.Elitfit.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface MemberRepository extends JpaRepository<Member, Long> {

    @Query("SELECT m FROM Member m LEFT JOIN FETCH m.membershipPlan WHERE m.user.id = :userId")
    Optional<Member> findByUserIdWithPlan(@Param("userId") Long userId);
    @Query("SELECT m FROM Member m WHERE m.trainer.user.id = :trainerUserId")
    List<Member> findByTrainerUserId(@Param("trainerUserId") Long trainerUserId);
    List<Member> findByTrainer(User trainer);
    Optional<Member> findById(Long id); // inherited from JpaRepository

    // الطرق الأخرى تبقى كما هي
    Optional<Member> findByUserId(Long userId);
    List<Member> findByActiveFalse();
    List<Member> findByMembershipPlanIsNull();
    Optional<Member> findByUser(com.example.Elitfit.Entity.User user);
    List<Member> findByEndDateBetweenAndActiveTrue(LocalDate start, LocalDate end);

}
