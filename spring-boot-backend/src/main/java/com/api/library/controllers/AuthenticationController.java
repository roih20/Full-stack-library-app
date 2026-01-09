package com.api.library.controllers;

import com.api.library.dtos.LoginMemberDto;
import com.api.library.dtos.RegisterMemberDto;
import com.api.library.entities.Member;
import com.api.library.exceptions.DuplicateEmailException;
import com.api.library.responses.ErrorResponse;
import com.api.library.responses.LoginResponse;
import com.api.library.services.AuthenticationService;
import com.api.library.services.JwtService;
import lombok.RequiredArgsConstructor;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.jspecify.annotations.NonNull;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthenticationService authService;

    private final JwtService jwtService;

    @PostMapping("/signup")
    public ResponseEntity<@NonNull Object> signup(
            @RequestBody RegisterMemberDto request) {

        try {
            Member registeredMember = authService.signup(request);
            return ResponseEntity.ok(registeredMember);
        } catch (DuplicateEmailException ex) {
            ErrorResponse errorResponse = new ErrorResponse(ex.getMessage());
            return ResponseEntity.status(HttpStatus.CONFLICT).body(errorResponse);
        }

    }

    @PostMapping("/login")
    public ResponseEntity<@NonNull Object> login(
            @RequestBody LoginMemberDto request) {
        try {
            Member authenticated = authService.authenticate(request);
            Map<String, Object> extraClaims = new HashMap<>();
            List<String> role = authenticated.getAuthorities()
                    .stream().map(GrantedAuthority::getAuthority).toList();
            extraClaims.put("name", authenticated.getName());
            extraClaims.put("role", role);
            String jwtToken = jwtService.generateToken(extraClaims, authenticated);
            LoginResponse loginResponse = new LoginResponse(jwtToken);
            return ResponseEntity.ok(loginResponse);
        } catch (AuthenticationException ex) {
            ErrorResponse errorResponse = new ErrorResponse(ex.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
        }
    }

}
