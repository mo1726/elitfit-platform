package com.example.Elitfit.Repository;

import com.example.Elitfit.Entity.FitnessClass;
import com.example.Elitfit.Entity.Trainer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ClassRepository extends JpaRepository<FitnessClass, Long> {

    @Query("SELECT c FROM FitnessClass c WHERE c.endTime > CURRENT_TIMESTAMP ORDER BY c.startTime ASC")
    List<FitnessClass> findUpcoming();


    List<FitnessClass> findByTrainer(Trainer trainer);

    List<FitnessClass> findByTrainer_User_Id(Long userId);


}
