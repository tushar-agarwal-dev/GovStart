package com.govstart.repository;

import com.govstart.model.Evaluation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface EvaluationRepository extends JpaRepository<Evaluation, Long> {
    List<Evaluation> findByProblemId(Long problemId);
    List<Evaluation> findByProblemIdAndStartupId(Long problemId, Long startupId);
    List<Evaluation> findByExpertId(Long expertId);
    Optional<Evaluation> findByProblemIdAndStartupIdAndExpertId(Long problemId, Long startupId, Long expertId);
}
