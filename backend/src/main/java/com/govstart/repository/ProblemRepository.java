package com.govstart.repository;

import com.govstart.model.Problem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProblemRepository extends JpaRepository<Problem, Long> {
    List<Problem> findByDepartmentId(Long departmentId);
    List<Problem> findByStatus(String status);
}
