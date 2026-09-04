package com.govstart.repository;

import com.govstart.model.StartupProfile;
import com.govstart.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface StartupProfileRepository extends JpaRepository<StartupProfile, Long> {
    Optional<StartupProfile> findByUser(User user);
    Optional<StartupProfile> findByUserId(Long userId);
}
