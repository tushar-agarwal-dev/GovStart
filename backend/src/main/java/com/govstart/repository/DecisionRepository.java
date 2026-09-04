package com.govstart.repository;

import com.govstart.model.Decision;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface DecisionRepository extends JpaRepository<Decision, Long> {
    Optional<Decision> findByPilotId(Long pilotId);
}
