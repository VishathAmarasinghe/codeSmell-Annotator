package com.codeAnnotator.codeAnnotator.DTO;

import lombok.Data;

import java.util.List;

@Data
public class CodeSnippetResponseDTO {
    private Long id;
    private String code;
    private int startLine;
    private int endLine;
    private String languages;
    private String type;
    private String aiComment;
    private List<SmellAnnotationDTO> aiSuggestions;
}