package com.govstart.repository;

import com.govstart.model.StatusTransitionLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface StatusTransitionLogRepository extends JpaRepository<StatusTransitionLog, Long> {
    List<StatusTransitionLog> findByProblemIdOrderByChangedAtDesc(Long problemId);
}
