package com.govstart.repository;

import com.govstart.model.ExpertProfile;
import com.govstart.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface ExpertProfileRepository extends JpaRepository<ExpertProfile, Long> {
    Optional<ExpertProfile> findByUser(User user);
    Optional<ExpertProfile> findByUserId(Long userId);
}
