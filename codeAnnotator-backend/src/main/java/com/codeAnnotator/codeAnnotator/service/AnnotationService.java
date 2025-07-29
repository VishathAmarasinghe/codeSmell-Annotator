package com.codeAnnotator.codeAnnotator.service;

import com.codeAnnotator.codeAnnotator.DTO.AnnotationRequestDTO;
import com.codeAnnotator.codeAnnotator.DTO.SmellAnnotationDTO;
import com.codeAnnotator.codeAnnotator.entity.Annotation;
import com.codeAnnotator.codeAnnotator.entity.CodeSnippet;
import com.codeAnnotator.codeAnnotator.entity.SmellAnnotation;
import com.codeAnnotator.codeAnnotator.repository.AnnotationRepository;
import com.codeAnnotator.codeAnnotator.repository.CodeSnippetRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AnnotationService {

    @Autowired
    private AnnotationRepository annotationRepo;

    @Autowired
    private CodeSnippetRepository codeSnippetRepo;

    @Transactional
    public void saveAnnotation(AnnotationRequestDTO dto) {
        CodeSnippet snippet = codeSnippetRepo.findById(dto.getCodeSnippetId())
                .orElseThrow(() -> new RuntimeException("CodeSnippet not found"));

        Annotation annotation = new Annotation();
        annotation.setAnnotator(dto.getAnnotator());
        annotation.setStartLine(dto.getStartLine());
        annotation.setEndLine(dto.getEndLine());
        annotation.setStatus(Annotation.Status.valueOf(dto.getStatus().toUpperCase()));
        annotation.setCodeSnippet(snippet);

        for (SmellAnnotationDTO smellDto : dto.getAnnotations()) {
            SmellAnnotation smell = new SmellAnnotation();
            smell.setSmellType(smellDto.getSmellType());
            smell.setCategory(smellDto.getCategory());
            smell.setSuggestion(smellDto.getSuggestion());
            smell.setRefactoredCode(smellDto.getRefactoredCode());
            smell.setAnnotation(annotation);
            annotation.getAnnotations().add(smell);
        }

        annotationRepo.save(annotation);
        snippet.setAnnotationCount(snippet.getAnnotationCount() + 1);
        codeSnippetRepo.save(snippet);
    }
}