package com.api.library.services;

import com.api.library.dtos.LoginMemberDto;
import com.api.library.dtos.RegisterMemberDto;
import com.api.library.entities.Member;
import com.api.library.exceptions.DuplicateEmailException;
import org.springframework.security.core.AuthenticationException;

public interface AuthenticationService {
    Member signup(RegisterMemberDto request) throws DuplicateEmailException;
    Member authenticate(LoginMemberDto request) throws AuthenticationException;
}
