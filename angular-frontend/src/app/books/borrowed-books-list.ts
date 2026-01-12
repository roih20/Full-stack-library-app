import { Component, input, output } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { BorrowedBook, ToastMessageResponse } from '@app/types/types';
import { DatePipe } from '@angular/common';
import { ReturnBtn } from '@app/ui-components/return-btn';
@Component({
  selector: 'borrowed-books-list',
  template: `
    <section class="mb-8 flex flex-col gap-y-2">
      @for (book of borrowedBooks(); track book.isbn) {
        <div class="border-t border-gray-300 p-2 flex">
          <img
            src="https://self-publishingschool.com/wp-content/uploads/2021/07/fantasy-book-cover-design-example-2-e1652364383267.png"
            width="150"
            height="150"
          />
          <div class="ml-4 p-2 w-full">
            <h3 class="text-xl font-medium">{{ book.title }}</h3>
            <p class="mt-1">{{ book.author }}</p>
            <p class="mt-1">Borrowed on: {{ book.borrowedDate | date }}</p>
            @if (book.returnedDate) {
              <p class="mt-1">Returned on: {{ book.returnedDate | date }}</p>
            } @else {
              <return-btn
                [isbnInput]="book.isbn"
                (displayToast)="onDisplayToast($event)"
                (returnResponse)="getReturnResponse($event)"
              />
            }
          </div>
        </div>
      } @empty {
        <div class="flex flex-col items-center justify-center my-12 p-2">
          <h3 class="text-2xl my-2">You haven't borrowed books.</h3>
          <a
            class="block p-2 my-2 bg-blue-500 rounded-md text-white font-medium hover:bg-blue-600 cursor-pointer"
            routerLink="/"
            >Start borrowing</a
          >
        </div>
      }
    </section>
  `,
  imports: [DatePipe, ReturnBtn, RouterLink],
})
export class BorrowedBooksList {
  borrowedBooks = input<BorrowedBook[]>();
  displayToast = output<boolean>();
  returnResponse = output<ToastMessageResponse>();

  onDisplayToast(display: boolean): void {
    this.displayToast.emit(display);
  }

  getReturnResponse(response: ToastMessageResponse): void {
    this.returnResponse.emit(response);
  }
}
