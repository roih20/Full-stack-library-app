package com.api.library.dtos;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class BookDto {

    private String isbn;
    private String title;
    private Boolean isBorrowed;
    private String author;

}
