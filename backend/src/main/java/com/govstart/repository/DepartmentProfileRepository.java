package com.govstart.repository;

import com.govstart.model.DepartmentProfile;
import com.govstart.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface DepartmentProfileRepository extends JpaRepository<DepartmentProfile, Long> {
    Optional<DepartmentProfile> findByUser(User user);
    Optional<DepartmentProfile> findByUserId(Long userId);
}
