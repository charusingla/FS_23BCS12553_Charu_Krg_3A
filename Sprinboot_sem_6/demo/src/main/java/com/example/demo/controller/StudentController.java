package com.example.demo.controller;

import com.example.demo.dto.StudentDTO;
import com.example.demo.entity.Student;
import java.util.List;

import com.example.demo.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/students")
public class StudentController {
    private final StudentService service;

    public StudentController(StudentService service){
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<Student> createStudent(
            @Valid @RequestBody StudentDTO dto){
        Student student = service.createStudent(dto);
        return new ResponseEntity<>(student, HttpStatus.CREATED);
    }

    @GetMapping
    public List<Student> getAllStudents(){
        return service.getAllStudents();
    }


}