import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, input, output, signal } from '@angular/core';
import { AuthService } from '@app/authentication/auth-service';
import { BookService } from '@app/books/book-service';
import { ToastMessageResponse } from '@app/types/types';
import { LoaderIcon } from '@app/icons/loader-icon';

@Component({
  selector: 'return-btn',
  template: `
    <button
      type="button"
      (click)="returnBook()"
      [disabled]="isLoading()"
      class="bg-orange-500 text-white font-medium p-2 mt-4 cursor-pointer rounded-md hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      @if (isLoading()) {
        <div class="flex items-center">
          <span class="mr-4">Returning book...</span>
          <svg loader-icon class="w-6 h-6 animate-spin"></svg>
        </div>
      } @else {
        Return book
      }
    </button>
  `,
  imports: [LoaderIcon],
})
export class ReturnBtn {
  private authService = inject(AuthService);
  private bookService = inject(BookService);
  isLoading = signal<boolean>(false);
  isbnInput = input<string>('');
  displayToast = output<boolean>();
  returnResponse = output<ToastMessageResponse>();

  returnBook(): void {
    this.isLoading.set(true);
    this.displayToast.emit(false);
    if (!this.authService.isLoggedIn()) {
      this.returnResponse.emit({
        message: 'Sign in to return a book',
        ok: false,
      });
      this.displayToast.emit(true);
    } else {
      this.bookService.returnBook(this.isbnInput()).subscribe({
        next: (response) => {
          this.isLoading.set(false);
          this.returnResponse.emit({
            message: response.message,
            ok: true,
          });
          this.displayToast.emit(true);
        },
        error: (err: HttpErrorResponse) => {
          this.isLoading.set(false);
          if (err.status === 400 && !err.ok) {
            this.returnResponse.emit({
              message: 'Failed to return book',
              ok: false,
            });
            this.displayToast.emit(true);
          }
        },
      });
    }
  }
}
