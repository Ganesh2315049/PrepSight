package com.prepsight.service;

import com.prepsight.dto.AdminUserRequest;
import com.prepsight.dto.AdminUserResponse;
import com.prepsight.dto.AdminUserUpdateRequest;
import com.prepsight.model.User;
import com.prepsight.repository.ExperienceRepository;
import com.prepsight.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminUserService {

    private final UserRepository userRepository;
    private final ExperienceRepository experienceRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.admin.username:Ganesh B}")
    private String staticAdminUsername;

    @Value("${app.admin.email:2315049@nec.edu.in}")
    private String staticAdminEmail;

    public AdminUserService(UserRepository userRepository,
                            ExperienceRepository experienceRepository,
                            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.experienceRepository = experienceRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<AdminUserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    public AdminUserResponse addUser(AdminUserRequest request) {
        validateUniqueFields(request.getUsername(), request.getEmail(), null);

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole());
        user.setActive(request.isActive());

        return toResponse(userRepository.save(user));
    }

    public AdminUserResponse updateUser(Long id, AdminUserUpdateRequest request) {
        User existing = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        validateUniqueFields(request.getUsername(), request.getEmail(), id);

        existing.setUsername(request.getUsername());
        existing.setEmail(request.getEmail());
        existing.setRole(request.getRole());
        existing.setActive(request.isActive());

        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            existing.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        guardStaticAdmin(existing);

        return toResponse(userRepository.save(existing));
    }

    public AdminUserResponse updateUserRole(Long id, String roleName) {
        User existing = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        try {
            existing.setRole(Enum.valueOf(com.prepsight.model.Role.class, roleName.toUpperCase()));
        } catch (IllegalArgumentException ex) {
            throw new IllegalArgumentException("Invalid role. Allowed: ADMIN, USER, VIEWER");
        }

        guardStaticAdmin(existing);

        return toResponse(userRepository.save(existing));
    }

    public AdminUserResponse updateUserStatus(Long id, boolean active) {
        User existing = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        existing.setActive(active);
        guardStaticAdmin(existing);

        return toResponse(userRepository.save(existing));
    }

    public void deleteUser(Long id) {
        User existing = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (isStaticAdmin(existing)) {
            throw new IllegalArgumentException("Static ADMIN account cannot be deleted");
        }

        userRepository.delete(existing);
    }

    private void validateUniqueFields(String username, String email, Long currentUserId) {
        userRepository.findByUsername(username)
                .filter(found -> !found.getId().equals(currentUserId))
                .ifPresent(found -> {
                    throw new IllegalArgumentException("Username already exists");
                });

        userRepository.findByEmail(email)
                .filter(found -> !found.getId().equals(currentUserId))
                .ifPresent(found -> {
                    throw new IllegalArgumentException("Email already exists");
                });
    }

    private void guardStaticAdmin(User user) {
        if (!isStaticAdmin(user)) {
            return;
        }

        if (!user.isActive()) {
            throw new IllegalArgumentException("Static ADMIN account cannot be blocked");
        }

        if (!"ADMIN".equals(user.getRole().name())) {
            throw new IllegalArgumentException("Static ADMIN role cannot be changed");
        }
    }

    private boolean isStaticAdmin(User user) {
        return staticAdminUsername.equals(user.getUsername())
                && staticAdminEmail.equalsIgnoreCase(user.getEmail());
    }

    private AdminUserResponse toResponse(User user) {
        return new AdminUserResponse(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getRole().name(),
                user.isActive(),
                experienceRepository.countByUserId(user.getId())
        );
    }
}
