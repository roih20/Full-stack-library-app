package com.api.library.impl;

import com.api.library.dtos.BorrowBookDto;
import com.api.library.dtos.UpdateBookDto;
import com.api.library.dtos.BookDto;
import com.api.library.entities.Book;
import com.api.library.entities.BorrowHistory;
import com.api.library.entities.Member;
import com.api.library.exceptions.*;
import com.api.library.repositories.BookRepository;
import com.api.library.repositories.BorrowHistoryRepository;
import com.api.library.repositories.MemberRepository;
import com.api.library.services.BookService;
import com.api.library.services.JwtService;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@AllArgsConstructor
@Service
public class BookServiceImpl implements BookService {

        private final BookRepository bookRepository;
        private final BorrowHistoryRepository borrowHistoryRepository;
        private final MemberRepository memberRepository;
        private final JwtService jwtService;

        @Override
        public Page<BookDto> getAllBooks(Pageable pageable) {
                return bookRepository.findAll(pageable)
                                .map(book -> BookDto.builder().isbn(book.getIsbn())
                                                .title(book.getTitle()).author(book.getAuthor())
                                                .isBorrowed(book.getIsBorrowed()).build());
        }

        @Override
        public BookDto getBookByISBN(String isbn) throws BookNotFoundException {
                Book book = bookRepository.findById(isbn)
                                .orElseThrow(() -> new BookNotFoundException("Book not found"));

                return BookDto.builder().isbn(book.getIsbn())
                                .title(book.getTitle()).author(book.getAuthor())
                                .isBorrowed(book.getIsBorrowed()).build();
        }

        @Override
        public Page<BookDto> getBooksByAuthor(String author, Pageable pageable) {
                return bookRepository.findByAuthor(author, pageable)
                                .map(book -> BookDto.builder().isbn(book.getIsbn())
                                                .title(book.getTitle()).author(book.getAuthor())
                                                .isBorrowed(book.getIsBorrowed()).build());
        }

        @Override
        public Page<BookDto> getAvailableBooks(Pageable pageable) {
                return bookRepository.findByIsBorrowedFalse(pageable)
                                .map(book -> BookDto.builder().isbn(book.getIsbn())
                                                .title(book.getTitle()).author(book.getAuthor())
                                                .isBorrowed(book.getIsBorrowed()).build());
        }

        @Override
        public Page<BookDto> searchBooksByTitle(String title, Pageable pageable) {
                return bookRepository.findByTitleStartingWith(title, pageable)
                                .map(book -> BookDto.builder().isbn(book.getIsbn())
                                                .title(book.getTitle()).author(book.getAuthor())
                                                .isBorrowed(book.getIsBorrowed()).build());
        }

        @Override
        public void borrowBook(BorrowBookDto request, String jwt)
                        throws BookNotFoundException, BookNotAvailableException, MemberNotFoundException {
                Book book = bookRepository.findById(request.getIsbn())
                                .orElseThrow(() -> new BookNotFoundException("Book not found"));

                if (!book.getIsBorrowed()) {

                        String jwtToken = jwt.substring(7);
                        String memberEmail = jwtService.extractUsername(jwtToken);

                        Member member = memberRepository.findByEmail(memberEmail).orElseThrow();

                        book.setIsBorrowed(true);
                        BorrowHistory history = BorrowHistory.builder().book(book)
                                        .member(member).borrowedDate(LocalDate.now()).build();

                        borrowHistoryRepository.save(history);

                } else {
                        throw new BookNotAvailableException("Book not available");
                }

        }

        @Override
        public void returnBook(BorrowBookDto request, String jwt) throws InvalidReturnException {

                String jwtToken = jwt.substring(7);
                String memberEmail = jwtService.extractUsername(jwtToken);
                Member member = memberRepository.findByEmail(memberEmail).orElseThrow();

                BorrowHistory history = borrowHistoryRepository
                                .findByBookIsbnAndMemberIdAndReturnedDateIsNull(request.getIsbn(), member.getId())
                                .orElseThrow(
                                                () -> new InvalidReturnException(
                                                                "Couldn't return that books because it hasn't been borrowed"));

                history.setReturnedDate(LocalDate.now());
                history.getBook().setIsBorrowed(false);

                borrowHistoryRepository.save(history);

        }

        @Override
        public void updateBookByISBN(String isbn, UpdateBookDto newBook) throws BookNotFoundException {

                Book book = bookRepository.findById(isbn).orElseThrow(
                                () -> new BookNotFoundException("Couldn't update book because it doesn't exist"));

                book.setTitle(newBook.getTitle());
                book.setAuthor(newBook.getAuthor());

                bookRepository.save(book);
        }

        @Override
        public void createBook(BookDto request) throws DuplicateIsbnException {
                Book book = bookRepository.findById(request.getIsbn()).orElse(null);

                if (book == null) {
                        bookRepository.save(
                                        Book.builder()
                                                        .isbn(request.getIsbn())
                                                        .title(request.getTitle())
                                                        .author(request.getAuthor())
                                                        .isBorrowed(request.getIsBorrowed())
                                                        .build());
                } else {
                        throw new DuplicateIsbnException("Duplicate isbn");
                }
        }

        @Override
        public void deleteBookByISBN(String isbn) throws BookNotFoundException {

                Book book = bookRepository.findById(isbn).orElseThrow(
                                () -> new BookNotFoundException("Couldn't delete books because it wasn't found"));

                bookRepository.delete(book);
        }
}
