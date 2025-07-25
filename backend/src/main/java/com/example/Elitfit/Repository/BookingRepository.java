    package com.example.Elitfit.Repository;

    import com.example.Elitfit.Entity.Booking;
    import org.springframework.data.jpa.repository.JpaRepository;
    import org.springframework.data.jpa.repository.Query;

    import java.util.List;

    public interface BookingRepository extends JpaRepository<Booking, Long> {

        List<Booking> findByUserId(Long userId);

        long countByFitnessClassId(Long classId);

        @Query("SELECT b FROM Booking b JOIN FETCH b.user JOIN FETCH b.fitnessClass")
        List<Booking> findAllWithUserAndClass();

        List<Booking> findByFitnessClass_Trainer_User_Id(Long trainerUserId);



    }
