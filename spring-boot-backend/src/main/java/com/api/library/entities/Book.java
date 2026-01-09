package com.api.library.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "books")
public class Book {

    @Id @Column(name = "isbn", length = 13, nullable = false, unique = true)
    private String isbn;

    @Column(name = "title", length = 200, nullable = false)
    private String title;

    @Column(name = "author", length = 50, nullable = false)
    private String author;

    @Column(name = "is_borrowed", nullable = false)
    private Boolean isBorrowed;

    @OneToMany(mappedBy = "book", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<BorrowHistory> borrowHistories;
}
