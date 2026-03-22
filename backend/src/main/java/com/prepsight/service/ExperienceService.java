package com.prepsight.service;

import com.prepsight.model.Experience;
import com.prepsight.model.User;
import com.prepsight.repository.ExperienceRepository;
import com.prepsight.repository.UserRepository;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ExperienceService {

    private final ExperienceRepository experienceRepository;
    private final UserRepository userRepository;

    public ExperienceService(ExperienceRepository experienceRepository, UserRepository userRepository) {
        this.experienceRepository = experienceRepository;
        this.userRepository = userRepository;
    }

    public Experience addExperience(Experience experience, Authentication authentication) {
        User owner = getCurrentUser(authentication);
        experience.setUser(owner);
        return experienceRepository.save(experience);
    }

    public List<Experience> getAllExperiences(String company, String sort, Authentication authentication) {
        boolean sortLatest = "latest".equalsIgnoreCase(sort);
        List<Experience> filtered = (company != null && !company.isBlank())
            ? experienceRepository.findByCompanyNameContainingIgnoreCase(company)
            : experienceRepository.findAll();

        if (sortLatest) {
            filtered.sort((a, b) -> b.getId().compareTo(a.getId()));
        }

        return filtered;
    }

    public Experience updateExperience(Long id, Experience updatedExperience, Authentication authentication) {
        Experience existing = getExperienceForWrite(id, authentication);

        existing.setCompanyName(updatedExperience.getCompanyName());
        existing.setRole(updatedExperience.getRole());
        existing.setTopics(updatedExperience.getTopics());
        existing.setDifficulty(updatedExperience.getDifficulty());
        existing.setRating(updatedExperience.getRating());
        existing.setFeedback(updatedExperience.getFeedback());

        return experienceRepository.save(existing);
    }

    public void deleteExperience(Long id, Authentication authentication) {
        Experience existing = getExperienceForWrite(id, authentication);
        experienceRepository.delete(existing);
    }

    public Map<String, Integer> analyzeTopics(Authentication authentication) {
        List<Experience> experiences = getAccessibleExperiences(authentication);
        Map<String, Integer> topicCount = new HashMap<>();

        for (Experience experience : experiences) {
            String topics = experience.getTopics();
            if (topics == null || topics.isBlank()) {
                continue;
            }

            String[] topicArray = topics.split(",");
            for (String topic : topicArray) {
                String cleanedTopic = topic.trim();
                if (!cleanedTopic.isEmpty()) {
                    topicCount.put(cleanedTopic, topicCount.getOrDefault(cleanedTopic, 0) + 1);
                }
            }
        }

        return topicCount;
    }

    public Map<String, Integer> analyzeDifficulty(Authentication authentication) {
        List<Experience> experiences = getAccessibleExperiences(authentication);
        Map<String, Integer> difficultyCount = new HashMap<>();

        for (Experience experience : experiences) {
            String difficulty = experience.getDifficulty();
            if (difficulty == null || difficulty.isBlank()) {
                continue;
            }
            String cleanedDifficulty = difficulty.trim();
            difficultyCount.put(cleanedDifficulty, difficultyCount.getOrDefault(cleanedDifficulty, 0) + 1);
        }

        return difficultyCount;
    }

    private User getCurrentUser(Authentication authentication) {
        String username = authentication.getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + username));
    }

    private Experience getExperienceForWrite(Long id, Authentication authentication) {
        if (hasRole(authentication, "ROLE_ADMIN")) {
            return experienceRepository.findById(id)
                    .orElseThrow(() -> new IllegalArgumentException("Experience not found with id: " + id));
        }

        if (hasRole(authentication, "ROLE_VIEWER")) {
            throw new AccessDeniedException("Viewer cannot modify experiences");
        }

        return experienceRepository.findByIdAndUserUsername(id, authentication.getName())
                .orElseThrow(() -> new AccessDeniedException("You can only modify your own experiences"));
    }

    private List<Experience> getAccessibleExperiences(Authentication authentication) {
        if (hasRole(authentication, "ROLE_ADMIN")) {
            return experienceRepository.findAll(Sort.by(Sort.Direction.DESC, "id"));
        }
        return experienceRepository.findByUserUsername(authentication.getName());
    }

    private boolean hasRole(Authentication authentication, String role) {
        return authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .anyMatch(role::equals);
    }
}
