package com.api.library.impl;

import com.api.library.dtos.LoginMemberDto;
import com.api.library.dtos.RegisterMemberDto;
import com.api.library.entities.Member;
import com.api.library.entities.Role;
import com.api.library.exceptions.DuplicateEmailException;
import com.api.library.repositories.MemberRepository;
import com.api.library.services.AuthenticationService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthenticationServiceImpl implements AuthenticationService {

    private final PasswordEncoder passwordEncoder;

    private final MemberRepository memberRepository;

    private final AuthenticationManager authManager;

    @Override
    public Member signup(RegisterMemberDto request) throws DuplicateEmailException {

        Member existingMember = memberRepository.findByEmail(request.getEmail()).orElse(null);

        if (existingMember != null) {
            throw new DuplicateEmailException("Duplicate email");
        }

        Member member = Member.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.ROLE_USER)
                .build();
        return memberRepository.save(member);
    }

    @Override
    public Member authenticate(LoginMemberDto request) throws AuthenticationException {
        authManager.authenticate(new UsernamePasswordAuthenticationToken(
                request.getEmail(),
                request.getPassword()
        ));
        return memberRepository.findByEmail(request.getEmail()).orElseThrow();
    }
}
