package com.healthhub.repository;

import com.healthhub.model.Patient;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PatientRepository extends JpaRepository<Patient, Long> {

    // JPQL Query
    @Query("SELECT p FROM Patient p WHERE p.age > :age")
    List<Patient> findPatientsAboveAge(@Param("age") int age);

    // Pagination
    Page<Patient> findAll(Pageable pageable);

    // Fix N+1 problem
    @Query("SELECT p FROM Patient p JOIN FETCH p.records")
    List<Patient> findAllWithRecords();
}