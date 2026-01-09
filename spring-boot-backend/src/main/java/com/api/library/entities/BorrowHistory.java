package com.api.library.entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;


@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "borrow_history")
public class BorrowHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "borrowed_book", referencedColumnName = "isbn", nullable = false)
    private Book book;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "borrowed_by", referencedColumnName = "id", nullable = false)
    private Member member;

    @Column(name = "borrowed_date", nullable = false)
    private LocalDate borrowedDate;

    @Column(name = "returned_date")
    private LocalDate returnedDate;

}
