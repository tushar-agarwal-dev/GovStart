package com.govstart.repository;

import com.govstart.model.Pilot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface PilotRepository extends JpaRepository<Pilot, Long> {
    List<Pilot> findByDepartmentId(Long departmentId);
    List<Pilot> findByStartupId(Long startupId);
    Optional<Pilot> findByProblemId(Long problemId);
    List<Pilot> findByStatus(String status);
}
