import { Component, inject, input, output, signal } from '@angular/core';
import { AuthService } from '@auth/auth-service';
import { BookService } from '@books/book-service';
import { LoaderIcon } from '@app/icons/loader-icon';
import { ToastMessageResponse } from '@app/types/types';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'borrow-btn',
  template: `
    <button
      (click)="borrowBook()"
      [disabled]="isLoading()"
      class="mt-2 bg-orange-500 px-2 py-1.5 rounded-sm font-medium text-white hover:bg-orange-600 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
    >
      @if (isLoading()) {
        <div class="flex items-center">
          <span class="mr-3">Borrowing...</span>
          <svg loader-icon class="h-6 w-6 animate-spin"></svg>
        </div>
      } @else {
        Borrow book
      }
    </button>
  `,
  imports: [LoaderIcon],
})
export class BorrowBtn {
  private authService = inject(AuthService);
  private bookService = inject(BookService);
  readonly isbnInput = input<string>('');
  isLoading = signal<boolean>(false);
  displayToast = output<boolean>();
  borrowResponse = output<ToastMessageResponse>();
  afterBorrow = output<string>();

  borrowBook(): void {
    this.isLoading.set(true);
    this.displayToast.emit(false);
    this.borrowResponse.emit({
      message: '',
      ok: false,
    });
    if (!this.authService.isLoggedIn()) {
      this.isLoading.set(false);
      this.borrowResponse.emit({
        message: 'Sign in before borrowing a book',
        ok: false,
      });
      this.displayToast.emit(true);
    } else {
      this.bookService.borrowBook(this.isbnInput()).subscribe({
        next: (response) => {
          this.isLoading.set(false);
          this.borrowResponse.emit({
            message: response.message,
            ok: true,
          });
          this.displayToast.emit(true);
          this.afterBorrow.emit(this.isbnInput());
        },
        error: (error: HttpErrorResponse) => {
          this.isLoading.set(false);
          if (!error.ok) {
            this.borrowResponse.emit({
              message: 'Failed to borrow book',
              ok: false,
            });
            this.displayToast.emit(true);
          }
        },
      });
    }
  }
}
