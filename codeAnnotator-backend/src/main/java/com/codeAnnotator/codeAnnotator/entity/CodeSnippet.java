package com.codeAnnotator.codeAnnotator.entity;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.sql.Timestamp;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "code_snippet")
public class CodeSnippet {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String codeType;
    private String codeName;
    private String repository;
    private String commitHash;
    private String path;
    private int startLine;
    private int endLine;
    private String link;

    @Lob
    private String code;

    private String languages;

    @Enumerated(EnumType.STRING)
    private CodeType type;

    private int annotationCount = 0;

    @CreationTimestamp
    private Timestamp createdAt;

    @OneToMany(mappedBy = "codeSnippet", cascade = CascadeType.ALL)
    private List<Annotation> annotations;

    public enum CodeType {
        OPENSOURCE,
        PROPRIETARY
    }
}
