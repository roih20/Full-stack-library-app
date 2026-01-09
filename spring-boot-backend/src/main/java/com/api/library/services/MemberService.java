package com.api.library.services;


import com.api.library.dtos.BorrowedBookDto;
import com.api.library.dtos.MemberDto;
import com.api.library.dtos.UpdateMemberPasswordDto;
import com.api.library.exceptions.InvalidPasswordException;
import com.api.library.exceptions.MemberNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;


public interface MemberService {

    Page<MemberDto> getAllMembers(Pageable pageable);
    MemberDto getMemberById(Integer id) throws MemberNotFoundException;
    Page<BorrowedBookDto> borrowedBooks(String jwt, Pageable pageable);
    void updatePassword(String jwt, UpdateMemberPasswordDto request) throws InvalidPasswordException;
    void deleteMember(Integer id) throws MemberNotFoundException;
}
