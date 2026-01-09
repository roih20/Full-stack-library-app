package com.api.library.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;


@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class BorrowedBookDto {
    private String isbn;
    private String title;
    private String author;
    private LocalDate borrowedDate;
    private LocalDate returnedDate;
}
