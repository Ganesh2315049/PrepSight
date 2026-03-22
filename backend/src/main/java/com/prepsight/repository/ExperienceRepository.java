package com.prepsight.repository;

import com.prepsight.model.Experience;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ExperienceRepository extends JpaRepository<Experience, Long> {
    List<Experience> findByCompanyNameContainingIgnoreCase(String companyName);
    List<Experience> findByUserUsername(String username);
    List<Experience> findByUserUsernameAndCompanyNameContainingIgnoreCase(String username, String companyName);
    Optional<Experience> findByIdAndUserUsername(Long id, String username);
    int countByUserId(Long userId);
}
