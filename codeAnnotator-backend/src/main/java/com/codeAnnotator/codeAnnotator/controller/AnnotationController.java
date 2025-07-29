package com.codeAnnotator.codeAnnotator.controller;

import com.codeAnnotator.codeAnnotator.DTO.AnnotationRequestDTO;
import com.codeAnnotator.codeAnnotator.service.AnnotationService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("annotations")
@CrossOrigin("*")
@RequiredArgsConstructor
public class AnnotationController {

    @Autowired
    private AnnotationService service;

    @PostMapping
    public ResponseEntity<String> submitAnnotation(@RequestBody AnnotationRequestDTO dto) {
        service.saveAnnotation(dto);
        return ResponseEntity.ok("Annotation submitted successfully.");
    }
}