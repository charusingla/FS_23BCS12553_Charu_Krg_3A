package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Student {
@Id
@GeneratedValue(strategy=GenerationType.IDENTITY)
private int id;

    private String name;
    private String email;
    private String course;
}