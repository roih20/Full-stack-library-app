package com.api.library.controllers;

import com.api.library.dtos.*;
import com.api.library.exceptions.*;
import com.api.library.responses.ErrorResponse;
import com.api.library.responses.Message;
import com.api.library.services.BookService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.data.web.PagedModel;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/books")
@RequiredArgsConstructor
public class BookController {

    private final BookService bookService;

    @GetMapping
    public ResponseEntity<PagedModel<BookDto>> getAllBooks(
            @PageableDefault(size = 10) Pageable pageable) {
        Page<BookDto> books = bookService.getAllBooks(pageable);
        return ResponseEntity.ok(new PagedModel<>(books));
    }

    @GetMapping("/available")
    public ResponseEntity<PagedModel<BookDto>> getAvailableBooks(
            @PageableDefault(size = 10) Pageable pageable) {
        Page<BookDto> books = bookService.getAvailableBooks(pageable);
        return ResponseEntity.ok(new PagedModel<>(books));
    }

    @GetMapping("/isbn/{isbn}")
    public ResponseEntity<Object> findBookByISBN(
            @PathVariable(name = "isbn") String isbn) {
        try {
            BookDto book = bookService.getBookByISBN(isbn);
            return ResponseEntity.ok(book);
        } catch (BookNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ErrorResponse(ex.getMessage()));
        }
    }

    @GetMapping("/author/{author}")
    public ResponseEntity<PagedModel<BookDto>> getBooksByAuthor(
            @PathVariable(name = "author") String author,
            @PageableDefault(size = 10) Pageable pageable) {
        Page<BookDto> books = bookService.getBooksByAuthor(author, pageable);
        return ResponseEntity.ok(new PagedModel<>(books));
    }

    @GetMapping("/search")
    public ResponseEntity<PagedModel<BookDto>> findBooksByTitle(
            @RequestParam(name = "title") String title,
            @PageableDefault(size = 10) Pageable pageable) {
        Page<BookDto> books = bookService.searchBooksByTitle(title, pageable);
        return ResponseEntity.ok(new PagedModel<>(books));
    }

    @PostMapping("/borrow")
    public ResponseEntity<Object> borrowBook(
            @RequestBody BorrowBookDto request,
            @RequestHeader("Authorization") String jwt) {
        try {
            bookService.borrowBook(request, jwt);
            return ResponseEntity.ok(new Message("Book borrowed successfully"));
        } catch (BookNotFoundException | BookNotAvailableException | MemberNotFoundException ex) {

            ErrorResponse errorResponse = new ErrorResponse(ex.getMessage());
            if (ex instanceof BookNotFoundException || ex instanceof MemberNotFoundException) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
            }
        }
    }

    @PostMapping("/return")
    public ResponseEntity<Object> returnBook(
            @RequestBody BorrowBookDto request,
            @RequestHeader("Authorization") String jwt) {
        try {
            bookService.returnBook(request, jwt);
            return ResponseEntity.ok(new Message("Book returned successfully"));
        } catch (InvalidReturnException ex) {
            return ResponseEntity.badRequest().body(new ErrorResponse(ex.getMessage()));
        }
    }

    @PostMapping("/admin/add")
    public ResponseEntity<Object> createBook(
            @RequestBody BookDto newBook) {
        try {
            bookService.createBook(newBook);
            return ResponseEntity.created(null)
                    .body(new Message("Book created successfully"));
        } catch (DuplicateIsbnException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(new ErrorResponse(ex.getMessage()));
        }

    }

    @PutMapping("/admin/update/{isbn}")
    public ResponseEntity<Object> updateBook(
            @RequestBody UpdateBookDto newBook,
            @PathVariable(name = "isbn") String isbn) {
        try {
            bookService.updateBookByISBN(isbn, newBook);
            return ResponseEntity.created(null)
                    .body(new Message("Book updated successfully"));
        } catch (BookNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ErrorResponse(ex.getMessage()));
        }

    }

    @DeleteMapping("/admin/delete/{isbn}")
    public ResponseEntity<Object> deleteBook(
            @PathVariable(name = "isbn") String isbn) {
        try {
            bookService.deleteBookByISBN(isbn);
            return ResponseEntity.noContent().build();
        } catch (BookNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ErrorResponse(ex.getMessage()));
        }
    }
}
