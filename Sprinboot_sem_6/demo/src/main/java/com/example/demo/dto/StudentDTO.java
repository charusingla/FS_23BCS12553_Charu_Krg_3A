package com.example.demo.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class StudentDTO {
    @NotBlank(message = "Name cannot be null")
    private String name;
    @NotBlank(message = "course cannot be null")
    private String course;
    @Email(message = "Invalid Email")
    private String email;
}