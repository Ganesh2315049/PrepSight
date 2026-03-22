package com.prepsight.controller;

import com.prepsight.model.Experience;
import com.prepsight.service.ExperienceService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/experiences")
@CrossOrigin(origins = "http://localhost:3000")
public class ExperienceController {

    private final ExperienceService experienceService;

    public ExperienceController(ExperienceService experienceService) {
        this.experienceService = experienceService;
    }

    @PostMapping
    public Experience addExperience(@RequestBody Experience experience, Authentication authentication) {
        return experienceService.addExperience(experience, authentication);
    }

    @GetMapping
    public List<Experience> getAllExperiences(
            @RequestParam(required = false) String company,
            @RequestParam(required = false) String sort,
            Authentication authentication) {
        return experienceService.getAllExperiences(company, sort, authentication);
    }

    @PutMapping("/{id}")
    public Experience updateExperience(@PathVariable Long id, @RequestBody Experience experience, Authentication authentication) {
        return experienceService.updateExperience(id, experience, authentication);
    }

    @DeleteMapping("/{id}")
    public void deleteExperience(@PathVariable Long id, Authentication authentication) {
        experienceService.deleteExperience(id, authentication);
    }

    @GetMapping("/analysis/topics")
    public Map<String, Integer> analyzeTopics(Authentication authentication) {
        return experienceService.analyzeTopics(authentication);
    }

    @GetMapping("/analysis/difficulty")
    public Map<String, Integer> analyzeDifficulty(Authentication authentication) {
        return experienceService.analyzeDifficulty(authentication);
    }
}
