package com.prepsight.config;

import com.prepsight.model.Role;
import com.prepsight.model.User;
import com.prepsight.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class AdminBootstrapService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.admin.username:Ganesh B}")
    private String adminUsername;

    @Value("${app.admin.email:2315049@nec.edu.in}")
    private String adminEmail;

    @Value("${app.admin.password:Ganesh@123}")
    private String adminPassword;

    public AdminBootstrapService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @EventListener(ApplicationReadyEvent.class)
    public void bootstrapAdmin() {
        User admin = userRepository.findByUsername(adminUsername)
            .or(() -> userRepository.findByEmail(adminEmail))
            .orElseGet(User::new);
        admin.setUsername(adminUsername);
        admin.setEmail(adminEmail);
        admin.setRole(Role.ADMIN);
        admin.setPassword(passwordEncoder.encode(adminPassword));
        userRepository.save(admin);
    }
}
