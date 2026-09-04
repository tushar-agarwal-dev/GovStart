package com.govstart.repository;

import com.govstart.model.PilotUpdate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PilotUpdateRepository extends JpaRepository<PilotUpdate, Long> {
    List<PilotUpdate> findByPilotIdOrderBySubmittedAtDesc(Long pilotId);
}
