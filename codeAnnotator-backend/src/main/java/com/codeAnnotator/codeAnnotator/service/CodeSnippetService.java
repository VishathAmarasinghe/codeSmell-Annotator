package com.codeAnnotator.codeAnnotator.service;

import com.codeAnnotator.codeAnnotator.DTO.CodeSnippetResponseDTO;
import com.codeAnnotator.codeAnnotator.DTO.SmellAnnotationDTO;
import com.codeAnnotator.codeAnnotator.entity.CodeSnippet;
import com.codeAnnotator.codeAnnotator.repository.CodeSnippetRepository;
import com.opencsv.CSVReader;
import com.opencsv.exceptions.CsvValidationException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CodeSnippetService {


    @Autowired
    private CodeSnippetRepository codeSnippetRepo;

    public void uploadCSV(MultipartFile file, CodeSnippet.CodeType type) throws Exception {
        try (
                BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream()));
                CSVReader csvReader = new CSVReader(reader)
        ) {
            String[] headers = csvReader.readNext(); // skip header row
            String[] tokens;

            while ((tokens = csvReader.readNext()) != null) {
                if (tokens.length < 10) {
                    System.out.println("Skipping invalid row: " + String.join(" | ", tokens));
                    continue;
                }

                CodeSnippet snippet = new CodeSnippet();
                snippet.setCodeType(tokens[0]);
                snippet.setCodeName(tokens[1].isBlank() ? null : tokens[1]);
                snippet.setRepository(tokens[2]);
                snippet.setCommitHash(tokens[3]);
                snippet.setPath(tokens[4]);
                snippet.setStartLine(Integer.parseInt(tokens[5]));
                snippet.setEndLine(Integer.parseInt(tokens[6]));
                snippet.setLink(tokens[7]);
                snippet.setCode(tokens[8]);
                snippet.setLanguages(tokens[9]);
                snippet.setType(type);

                codeSnippetRepo.save(snippet);
            }
        } catch (CsvValidationException e) {
            throw new RuntimeException("CSV parsing failed: " + e.getMessage());
        }
    }

    public Optional<CodeSnippetResponseDTO> getNextSnippet() {
        return codeSnippetRepo.findAll().stream()// Skip current
                .sorted(Comparator.comparingInt(CodeSnippet::getAnnotationCount))
                .findFirst()
                .map(snippet -> {
                    // Convert snippet to DTO
                    CodeSnippetResponseDTO dto = toDto(snippet);

                    // Analyze with OpenAI and attach suggestions
                    List<SmellAnnotationDTO> smells = OpenAIAgent.analyzeCode(snippet.getCode());

                    if (smells.isEmpty()) {
                        dto.setAiComment("No");
                    } else {
                        dto.setAiSuggestions(smells);
                    }
                    return dto;
                });
    }

    public Optional<CodeSnippetResponseDTO> getNextSnippetExcluding(Long currentId) {
        return codeSnippetRepo.findAll().stream()
                .filter(snippet -> !snippet.getId().equals(currentId)) // exclude current
                .sorted(Comparator.comparingInt(CodeSnippet::getAnnotationCount)) // by annotationCount ascending
                .findFirst()
                .map(snippet -> {
                    // Convert snippet to DTO
                    CodeSnippetResponseDTO dto = toDto(snippet);

                    // Analyze with OpenAI and attach suggestions
                    List<SmellAnnotationDTO> smells = OpenAIAgent.analyzeCode(snippet.getCode());

                    if (smells.isEmpty()) {
                        dto.setAiComment("No");
                    } else {
                        dto.setAiSuggestions(smells);
                    }
                    return dto;
                });
    }


    private CodeSnippetResponseDTO toDto(CodeSnippet codeSnippet) {
        CodeSnippetResponseDTO dto = new CodeSnippetResponseDTO();
        dto.setId(codeSnippet.getId());
        dto.setCode(codeSnippet.getCode());
        dto.setStartLine(codeSnippet.getStartLine());
        dto.setEndLine(codeSnippet.getEndLine());
        dto.setLanguages(codeSnippet.getLanguages());
        dto.setType(codeSnippet.getType().name());
        return dto;
    }
}