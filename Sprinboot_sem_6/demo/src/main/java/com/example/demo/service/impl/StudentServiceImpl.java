package com.example.demo.service.impl;

import com.example.demo.entity.Student;
import com.example.demo.service.StudentService;
import com.example.demo.dto.StudentDTO;
import java.util.List;
import com.example.demo.repository.StudentRepository;
import org.springframework.stereotype.Service;

@Service
public class StudentServiceImpl implements StudentService {
    private final StudentRepository repository;

    public StudentServiceImpl(StudentRepository repository) {
        this.repository = repository;
    }

    @Override
    public Student createStudent(StudentDTO dto) {
        Student student = new Student();
        student.setName(dto.getName());
        student.setCourse(dto.getCourse());
        student.setEmail(dto.getEmail());

        return repository.save(student);
    }

    @Override
    public List<Student> getAllStudents() {
        return repository.findAll();
    }
}