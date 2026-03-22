package com.prepsight.service;

import com.prepsight.dto.AuthRequest;
import com.prepsight.dto.AuthResponse;
import com.prepsight.dto.RegisterRequest;
import com.prepsight.model.Role;
import com.prepsight.model.User;
import com.prepsight.repository.UserRepository;
import com.prepsight.security.JwtService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final JwtService jwtService;

    @Value("${app.admin.username:Ganesh B}")
    private String staticAdminUsername;

    @Value("${app.admin.email:2315049@nec.edu.in}")
    private String staticAdminEmail;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager,
                       UserDetailsService userDetailsService,
                       JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.userDetailsService = userDetailsService;
        this.jwtService = jwtService;
    }

    public void register(RegisterRequest request) {
        if (Role.ADMIN.equals(request.getRole())) {
            throw new IllegalArgumentException("ADMIN accounts are managed by system credentials only");
        }

        if (userRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("Username already exists");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already exists");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole());

        userRepository.save(user);
    }

    public AuthResponse login(AuthRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        User user = userRepository.findByUsername(request.getUsername())
                .or(() -> userRepository.findByEmail(request.getUsername()))
                .orElseThrow(() -> new IllegalArgumentException("Invalid username or password"));

        if (!user.isActive()) {
            throw new IllegalArgumentException("User account is blocked");
        }

        if (Role.ADMIN.equals(user.getRole())) {
            boolean isStaticAdmin = staticAdminUsername.equals(user.getUsername())
                && staticAdminEmail.equalsIgnoreCase(user.getEmail());
            if (!isStaticAdmin) {
            throw new IllegalArgumentException("Invalid username or password");
            }
        }

        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getUsername());
        String token = jwtService.generateToken(userDetails);

        return new AuthResponse(token, user.getUsername(), user.getRole().name());
    }
}
