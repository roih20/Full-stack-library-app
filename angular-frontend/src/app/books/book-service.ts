import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpContext } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AUTH_ENABLED } from '@interceptors/auth-interceptor';
import { BookResponse, Book, BorrowResponse, ReturnBookResponse } from '@app/types/types';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  private readonly API_URL = 'https://spring-library-api.up.railway.app/books';
  private http = inject(HttpClient);

  getBooks(pageSize: number, currentPage: number, sortBy: string): Observable<BookResponse> {
    return this.http.get<BookResponse>(
      `${this.API_URL}?size=${pageSize}&page=${currentPage}&sort=${sortBy}`,
    );
  }

  getBooksByTitle(title: string, pageSize: number, currentPage: number): Observable<BookResponse> {
    return this.http.get<BookResponse>(
      `${this.API_URL}/search?title=${title}&size=${pageSize}&page=${currentPage}`,
    );
  }

  getBookByISBN(isbn: string): Observable<Book> {
    return this.http.get<Book>(`${this.API_URL}/isbn/${isbn}`);
  }

  borrowBook(isbn: string): Observable<BorrowResponse> {
    return this.http.post<BorrowResponse>(
      `${this.API_URL}/borrow`,
      { isbn },
      {
        context: new HttpContext().set(AUTH_ENABLED, true),
      },
    );
  }

  returnBook(isbn: string): Observable<ReturnBookResponse> {
    return this.http.post<ReturnBookResponse>(
      `${this.API_URL}/return`,
      { isbn },
      {
        context: new HttpContext().set(AUTH_ENABLED, true),
      },
    );
  }
}
