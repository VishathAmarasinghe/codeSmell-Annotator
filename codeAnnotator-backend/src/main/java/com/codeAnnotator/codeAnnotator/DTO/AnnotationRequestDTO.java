package com.codeAnnotator.codeAnnotator.DTO;

import lombok.Data;

import java.util.List;

@Data
public class AnnotationRequestDTO {
    private String annotator;
    private String type;
    private List<String> languages;
    private int startLine;
    private int endLine;
    private String code;
    private String status;
    private Long codeSnippetId;
    private List<SmellAnnotationDTO> annotations;
}