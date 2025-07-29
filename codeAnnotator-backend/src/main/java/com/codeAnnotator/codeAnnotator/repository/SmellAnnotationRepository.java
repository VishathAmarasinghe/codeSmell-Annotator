package com.codeAnnotator.codeAnnotator.repository;


import com.codeAnnotator.codeAnnotator.entity.SmellAnnotation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SmellAnnotationRepository extends JpaRepository<SmellAnnotation, Long> {}
