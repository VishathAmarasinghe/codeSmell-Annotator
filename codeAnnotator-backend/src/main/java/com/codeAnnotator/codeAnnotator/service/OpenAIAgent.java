package com.codeAnnotator.codeAnnotator.service;

import com.codeAnnotator.codeAnnotator.DTO.SmellAnnotationDTO;
import com.codeAnnotator.codeAnnotator.config.OpenAIConfig;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import okhttp3.*;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.*;
import java.util.concurrent.TimeUnit;

public class OpenAIAgent {

    private static final String OPENAI_API_URL = "https://api.openai.com/v1/responses"; // as per your request
    private static final MediaType JSON = MediaType.parse("application/json");

    private static OpenAIConfig openAIConfig;

    @Autowired
    public OpenAIAgent(OpenAIConfig openAIConfig) {
        this.openAIConfig = openAIConfig;
    }

    private static final ObjectMapper mapper = new ObjectMapper();

    private static final OkHttpClient client = new OkHttpClient.Builder()
            .connectTimeout(30, TimeUnit.SECONDS)
            .readTimeout(60, TimeUnit.SECONDS)
            .writeTimeout(60, TimeUnit.SECONDS)
            .build();

    public static List<SmellAnnotationDTO> analyzeCode(String code) {
        try {
            // Construct the input message
            String prompt = buildPrompt(code);

            System.out.println("prommot is "+prompt);

            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("model", "gpt-4.1");
            requestBody.put("input", prompt);

            String jsonRequest = mapper.writeValueAsString(requestBody);

            // Build request
            Request request = new Request.Builder()
                    .url(OPENAI_API_URL)
                    .addHeader("Authorization", "Bearer " + openAIConfig.getApiKey())
                    .addHeader("Content-Type", "application/json")
                    .post(RequestBody.create(jsonRequest, JSON))
                    .build();

            // Send request and process response
            try (Response response = client.newCall(request).execute()) {
                if (!response.isSuccessful() || response.body() == null) {
                    System.err.println("API error: " + response.code() + " - " + response.message());
                    return List.of();
                }

                String responseBody = response.body().string();
                System.out.println("Raw Response:\n" + responseBody);

                // Assume full response is the JSON array we expect
                JsonNode root = mapper.readTree(responseBody);
                String text = root.path("output").get(0)
                        .path("content").get(0)
                        .path("text").asText();

                if (text.trim().equalsIgnoreCase("No")) {
                    return List.of(); // No issues found
                }

// Now parse the embedded JSON array string
                JsonNode annotationArray = mapper.readTree(text);
                List<SmellAnnotationDTO> result = new ArrayList<>();

                for (JsonNode node : annotationArray) {
                    SmellAnnotationDTO dto = new SmellAnnotationDTO();
                    dto.setSmellType(node.path("smellType").asText());
                    dto.setCategory(node.path("category").asText());
                    dto.setSuggestion(node.path("suggestion").asText());
                    dto.setRefactoredCode(node.path("refactoredCode").asText());
                    result.add(dto);
                }
                return result;
            }

        } catch (Exception e) {
            e.printStackTrace();
            return List.of();
        }
    }

    private static String buildPrompt(String code) {
        return """
You are an expert in software design and code quality. Analyze the following Java code snippet for known code smells and anti-patterns.

Focus only on:

- Code Smells: Feature Envy, Long Method, Blob, Data Class
- Anti-patterns: God Class, Spaghetti Code, Swiss Army Knife, Magic Numbers

Code Smells
Feature Envy:
A function or method that relies too heavily on another object’s data or methods instead of its own.
Example in JavaScript: A utility function that accesses multiple nested properties of a passed-in object, doing more with it than the object itself.

Long Method:
A function that performs too many operations, making it hard to read, test, or maintain.

Blob (God Object):
An object or module that contains a large amount of data but performs little or no meaningful behavior.

Data Class:
A class or interface that exists solely to hold data, without any associated behavior or logic.

Anti-Patterns
God Class:
A single component or class that handles many unrelated responsibilities, making it difficult to understand or change.

Spaghetti Code:
Poorly structured code with tangled control flow, making it difficult to follow or maintain.

Swiss Army Knife:
A function or component that tries to do too many different things, often through large blocks of conditionals or flags.

Magic Numbers:
Hardcoded values used directly in code without explanation, reducing readability and maintainability.

if code smells and anti patterns have slightly then make it as having. 

Return a response ONLY as a JSON array of objects with these fields:
- smellType
- category
- suggestion
- refactoredCode

if no code smell or anti patten then print exactly "No" 

Code:
""" + code;
    }
}
