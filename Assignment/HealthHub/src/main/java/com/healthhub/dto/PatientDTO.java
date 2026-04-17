package com.healthhub.dto;

import jakarta.validation.constraints.*;

public class PatientDTO {

    @NotBlank(message = "Name is required")
    private String name;

    @Email(message = "Invalid email")
    private String email;

    @Min(value = 1, message = "Age must be positive")
    private int age;

    // getters and setters
}