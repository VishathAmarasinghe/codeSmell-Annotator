package com.codeAnnotator.codeAnnotator.DTO;

import lombok.Data;

@Data
public class SmellAnnotationDTO {
    private String smellType;
    private String category;
    private String suggestion;
    private String refactoredCode;
}