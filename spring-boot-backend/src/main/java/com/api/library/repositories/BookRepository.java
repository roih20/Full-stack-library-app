package com.api.library.repositories;

import com.api.library.entities.Book;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;


public interface BookRepository extends JpaRepository<Book, String> {
    Page<Book> findByAuthor(String author, Pageable pageable);
    Page<Book> findByTitleStartingWith(String title, Pageable pageable);
    Page<Book> findByIsBorrowedFalse(Pageable pageable);
}
