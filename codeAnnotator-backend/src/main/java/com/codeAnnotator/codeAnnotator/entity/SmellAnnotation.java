package com.codeAnnotator.codeAnnotator.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "smell_annotation")
public class SmellAnnotation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String smellType;
    private String category;

    @Lob
    private String suggestion;

    @Lob
    private String refactoredCode;

    @ManyToOne
    @JoinColumn(name = "annotation_id")
    private Annotation annotation;

}
