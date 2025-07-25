package com.example.Elitfit.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.Elitfit.Entity.User;


import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findById(Long id);


}
