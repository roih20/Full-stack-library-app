import { Component, inject, OnInit, signal, SimpleChanges } from '@angular/core';
import { BookService } from '@books/book-service';
import { ActivatedRoute } from '@angular/router';
import { BorrowBtn } from '@ui/borrow-btn';
import { Book } from '@app/types/types';

@Component({
  selector: 'single-book',
  template: `
    @if (isLoading()) {
      <p>Loading book details...</p>
    } @else if (error()) {
      <p>{{ error() }}</p>
    } @else {
      <div>
        <h2>{{ book().title }}</h2>
        <p>{{ book().author }}</p>
        <p>{{ book().isbn }}</p>
        @if (!book().isBorrowed) {
          <borrow-btn [isbnInput]="book().isbn" />
        }
      </div>
    }
  `,
  imports: [BorrowBtn],
})
export class SingleBook implements OnInit {
  private bookService = inject(BookService);
  private route = inject(ActivatedRoute);
  book = signal<Book>({
    isbn: '',
    title: '',
    author: '',
    isBorrowed: false,
  });
  isLoading = signal<boolean>(false);
  error = signal<string | null>(null);

  ngOnInit(): void {
    const isbn = this.route.snapshot.params['isbn'];
    this.loadBook(isbn);
  }

  loadBook(isbn: string): void {
    this.isLoading.set(true);
    this.error.set(null);
    this.bookService.getBookByISBN(isbn).subscribe({
      next: (response) => {
        this.book.set(response);
        this.isLoading.set(false);
      },
      error: (error) => {
        this.error.set('Failed to retrieve book. Please try again later');
        //this.book.set(null)
        this.isLoading.set(false);
      },
    });
  }
}
