package com.healthhub.service;

import com.healthhub.model.Patient;
import com.healthhub.repository.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PatientService {

    @Autowired
    private PatientRepository repository;

    public Patient createPatient(Patient patient) {
        return repository.save(patient);
    }

    public List<Patient> getAllPatients() {
        return repository.findAll();
    }

    public Patient getPatient(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Patient not found"));
    }

    public Patient updatePatient(Long id, Patient newPatient) {
        Patient patient = getPatient(id);

        patient.setName(newPatient.getName());
        patient.setEmail(newPatient.getEmail());
        patient.setAge(newPatient.getAge());

        return repository.save(patient);
    }

    public void deletePatient(Long id) {
        repository.deleteById(id);
    }

    // JPQL
    public List<Patient> findPatientsAboveAge(int age) {
        return repository.findPatientsAboveAge(age);
    }

    // Pagination
    public Page<Patient> getPatientsPaginated(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return repository.findAll(pageable);
    }

    // Fetch optimization
    public List<Patient> getPatientsWithRecords() {
        return repository.findAllWithRecords();
    }
}