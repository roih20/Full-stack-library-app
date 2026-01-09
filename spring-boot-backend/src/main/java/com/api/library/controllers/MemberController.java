package com.api.library.controllers;

import com.api.library.dtos.BorrowedBookDto;
import com.api.library.dtos.MemberDto;
import com.api.library.dtos.UpdateMemberPasswordDto;
import com.api.library.exceptions.InvalidPasswordException;
import com.api.library.exceptions.MemberNotFoundException;
import com.api.library.responses.ErrorResponse;
import com.api.library.responses.Message;
import com.api.library.services.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.data.web.PagedModel;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/members")
@RequiredArgsConstructor
public class MemberController {

    private final MemberService memberService;

    @GetMapping("/admin")
    public ResponseEntity<PagedModel<MemberDto>> getAllMembers(
            @PageableDefault(size = 10) Pageable pageable
            ) {
        Page<MemberDto> members = memberService.getAllMembers(pageable);
        return ResponseEntity.ok(new PagedModel<>(members));
    }

    @GetMapping("/admin/id/{id}")
    public ResponseEntity<Object> getMemberById(
            @PathVariable(name = "id") Integer id
    ) {
        try {
            MemberDto member = memberService.getMemberById(id);
            return ResponseEntity.ok(member);
        } catch (MemberNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ErrorResponse(ex.getMessage()));
        }
    }

    @GetMapping("/borrow-history")
    public ResponseEntity<PagedModel<BorrowedBookDto>> getBorrowHistory(
            @RequestHeader("Authorization") String jwt,
            @PageableDefault(size = 10) Pageable pageable
    ) {
        Page<BorrowedBookDto> borrowedBook = memberService.borrowedBooks(jwt , pageable);
        return ResponseEntity.ok(new PagedModel<>(borrowedBook));
    }

    @PostMapping("/change-password")
    public ResponseEntity<Object> changePassword(
            @RequestHeader("Authorization") String jwt,
            @RequestBody UpdateMemberPasswordDto request
    ) {

        try {
            memberService.updatePassword(jwt, request);
            return ResponseEntity.ok(new Message("Password updated successfully"));
        } catch (InvalidPasswordException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse(ex.getMessage()));
        }

    }

    @DeleteMapping("/admin/delete/{id}")
    public ResponseEntity<Object> deleteMember(
            @PathVariable(name = "id") Integer id
    ) {

        try {
            memberService.deleteMember(id);
            return ResponseEntity.noContent().build();
        } catch (MemberNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ErrorResponse(ex.getMessage()));
        }
    }

}
