package com.codeAnnotator.codeAnnotator.repository;

import com.codeAnnotator.codeAnnotator.entity.Annotation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AnnotationRepository extends JpaRepository<Annotation, Long> {}