package com.healthhub.controller;

import com.healthhub.model.Patient;
import com.healthhub.service.PatientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/patients")
public class PatientController {

    @Autowired
    private PatientService service;

    @PostMapping
    public Patient createPatient(@RequestBody Patient patient) {
        return service.createPatient(patient);
    }

    @GetMapping
    public List<Patient> getAllPatients() {
        return service.getAllPatients();
    }

    @GetMapping("/{id}")
    public Patient getPatient(@PathVariable Long id) {
        return service.getPatient(id);
    }

    @PutMapping("/{id}")
    public Patient updatePatient(@PathVariable Long id, @RequestBody Patient patient) {
        return service.updatePatient(id, patient);
    }

    @DeleteMapping("/{id}")
    public void deletePatient(@PathVariable Long id) {
        service.deletePatient(id);
    }

    // JPQL
    @GetMapping("/age/{age}")
    public List<Patient> getPatientsAboveAge(@PathVariable int age) {
        return service.findPatientsAboveAge(age);
    }

    // Pagination
    @GetMapping("/paginated")
    public Page<Patient> getPaginated(@RequestParam int page, @RequestParam int size) {
        return service.getPatientsPaginated(page, size);
    }

    // Fetch optimization
    @GetMapping("/with-records")
    public List<Patient> getPatientsWithRecords() {
        return service.getPatientsWithRecords();
    }
}