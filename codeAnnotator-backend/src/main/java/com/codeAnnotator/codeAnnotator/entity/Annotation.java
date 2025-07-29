package com.codeAnnotator.codeAnnotator.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "annotation")
public class Annotation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String annotator;

    private int startLine;
    private int endLine;

    @Enumerated(EnumType.STRING)
    private Status status; // submitted, skipped, rejected, clean

    @ManyToOne
    @JoinColumn(name = "code_snippet_id")
    private CodeSnippet codeSnippet;

    @OneToMany(mappedBy = "annotation", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<SmellAnnotation> annotations = new ArrayList<>();

    @CreationTimestamp
    private Timestamp createdAt;

    public enum Status {
        SUBMITTED,
        SKIPPED,
        REJECTED,
        CLEAN
    }

    // Getters & setters
}
