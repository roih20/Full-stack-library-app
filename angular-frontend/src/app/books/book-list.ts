import { Component, input, output } from '@angular/core';
import { Book } from '@app/types/types';
import { BorrowBtn } from '@ui/borrow-btn';
import { ToastMessageResponse } from '@app/types/types';

@Component({
  selector: 'book-list',
  template: `
    <section class="grid grid-cols-4 mt-4 gap-y-4">
      @for (book of books(); track book.isbn) {
        <div class="p-3 hover:bg-gray-100">
          <img
            class=""
            src="https://self-publishingschool.com/wp-content/uploads/2021/07/fantasy-book-cover-design-example-2-e1652364383267.png"
            width="200"
            height="200"
          />
          <h3 class="mt-1">{{ book.title }}</h3>
          <p class="text-slate-600 text-sm">{{ book.author }}</p>
          @if (!book.isBorrowed) {
            <borrow-btn
              [isbnInput]="book.isbn"
              (borrowResponse)="getBorrowResponse($event)"
              (afterBorrow)="onBookBorrowed($event)"
              (displayToast)="onDisplayToast($event)"
            />
          } @else {
            <div class="mt-1 text-red-700 text-sm">Not available</div>
          }
        </div>
      } @empty {
        <p class="text-red-700 my-4">Books not found.</p>
      }
    </section>
  `,
  imports: [BorrowBtn],
})
export class BookList {
  books = input<Book[]>([]);
  displayToast = output<boolean>();
  borrowResponse = output<ToastMessageResponse>();
  afterBorrow = output<string>();

  onDisplayToast(open: boolean): void {
    this.displayToast.emit(open);
  }

  getBorrowResponse(response: ToastMessageResponse): void {
    this.borrowResponse.emit(response);
  }

  onBookBorrowed(isbn: string): void {
    this.afterBorrow.emit(isbn);
  }
}
