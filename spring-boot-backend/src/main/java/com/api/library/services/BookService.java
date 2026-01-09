package com.api.library.services;

import com.api.library.dtos.BorrowBookDto;
import com.api.library.dtos.UpdateBookDto;
import com.api.library.dtos.BookDto;
import com.api.library.exceptions.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface BookService {
    Page<BookDto> getAllBooks(Pageable pageable);

    BookDto getBookByISBN(String isbn) throws BookNotFoundException;

    Page<BookDto> getBooksByAuthor(String author, Pageable pageable);

    Page<BookDto> getAvailableBooks(Pageable pageable);

    Page<BookDto> searchBooksByTitle(String title, Pageable pageable);

    void borrowBook(BorrowBookDto request, String jwt) throws BookNotFoundException,
            BookNotAvailableException, MemberNotFoundException;

    void returnBook(BorrowBookDto request, String jwt) throws InvalidReturnException;

    void updateBookByISBN(String isbn, UpdateBookDto newBook) throws BookNotFoundException;

    void createBook(BookDto newBook) throws DuplicateIsbnException;

    void deleteBookByISBN(String isbn) throws BookNotFoundException;
}
