package com.codeAnnotator.codeAnnotator.controller;

import com.codeAnnotator.codeAnnotator.DTO.CodeSnippetResponseDTO;
import com.codeAnnotator.codeAnnotator.entity.CodeSnippet;
import com.codeAnnotator.codeAnnotator.service.CodeSnippetService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@CrossOrigin("*")
@RequestMapping("/snippets")

//@RequiredArgsConstructor
public class CodeSnippetController {

    @Autowired
    private CodeSnippetService service;

    @PostMapping("/upload")
    public ResponseEntity<?> uploadCSV(@RequestParam("file") MultipartFile file, @RequestParam("type") CodeSnippet.CodeType type) {
        try {
            service.uploadCSV(file,type);
            return ResponseEntity.ok("CSV uploaded successfully.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Upload failed: " + e.getMessage());
        }
    }

    @GetMapping("/next")
    public ResponseEntity<CodeSnippetResponseDTO> getNextSnippet() {
        return service.getNextSnippet()
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.noContent().build());
    }

    @GetMapping("/next/{currentId}")
    public ResponseEntity<CodeSnippetResponseDTO> getNextExcludingCurrent(@PathVariable Long currentId) {
        return service.getNextSnippetExcluding(currentId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.noContent().build());
    }

}