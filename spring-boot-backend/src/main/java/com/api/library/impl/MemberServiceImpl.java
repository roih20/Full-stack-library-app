package com.api.library.impl;

import com.api.library.dtos.BorrowedBookDto;
import com.api.library.dtos.MemberDto;
import com.api.library.dtos.UpdateMemberPasswordDto;
import com.api.library.entities.Member;
import com.api.library.exceptions.InvalidPasswordException;
import com.api.library.exceptions.MemberNotFoundException;
import com.api.library.repositories.BorrowHistoryRepository;
import com.api.library.repositories.MemberRepository;
import com.api.library.services.JwtService;
import com.api.library.services.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MemberServiceImpl implements MemberService {

    private final MemberRepository memberRepository;
    private final BorrowHistoryRepository borrowHistoryRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;

    @Override
    public Page<MemberDto> getAllMembers(Pageable pageable) {
        return memberRepository.findAll(pageable)
                .map(member -> MemberDto.builder()
                        .id(member.getId()).email(member.getEmail())
                        .name(member.getName()).build());
    }

    @Override
    public MemberDto getMemberById(Integer id) throws MemberNotFoundException {
        Member member = memberRepository.findById(id)
                .orElseThrow(() -> new MemberNotFoundException("Member not found"));
        return new MemberDto(member.getId(), member.getName(), member.getEmail());
    }

    @Override
    public Page<BorrowedBookDto> borrowedBooks(String jwt, Pageable pageable) {
        Member member = extractMemberInfo(jwt);

        return borrowHistoryRepository.findByMemberId(member.getId(), pageable)
                .map(history -> BorrowedBookDto.builder()
                        .isbn(history.getBook().getIsbn()).title(history.getBook().getTitle())
                        .author(history.getBook().getAuthor()).borrowedDate(history.getBorrowedDate())
                        .returnedDate(history.getReturnedDate())
                        .build());
    }

    @Override
    public void updatePassword(String jwt, UpdateMemberPasswordDto request) throws InvalidPasswordException {

        Member member = extractMemberInfo(jwt);

        if (!passwordEncoder.matches(request.getOldPassword(), member.getPassword())) {
            throw new InvalidPasswordException("Password doesn't match");
        }

        member.setPassword(passwordEncoder.encode(request.getNewPassword()));
        memberRepository.save(member);

    }

    @Override
    public void deleteMember(Integer id) throws MemberNotFoundException {

        memberRepository.findById(id)
                .orElseThrow(() -> new MemberNotFoundException("Member not found"));

        memberRepository.deleteById(id);

    }

    private Member extractMemberInfo(String jwt) {
        String jwtToken = jwt.substring(7);
        String userEmail = jwtService.extractUsername(jwtToken);
        return memberRepository.findByEmail(userEmail).orElseThrow();
    }

}
