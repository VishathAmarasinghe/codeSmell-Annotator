package com.codeAnnotator.codeAnnotator.repository;

import com.codeAnnotator.codeAnnotator.entity.CodeSnippet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CodeSnippetRepository extends JpaRepository<CodeSnippet, Long> {}
