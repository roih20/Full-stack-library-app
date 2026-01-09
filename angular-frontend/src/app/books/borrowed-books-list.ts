import { Component, input, output } from '@angular/core';
import { BorrowedBook, ToastMessageResponse } from '@app/types/types';
import { DatePipe } from '@angular/common';
import { ReturnBtn } from '@app/ui-components/return-btn';
@Component({
  selector: 'borrowed-books-list',
  template: `
    <ul class="mb-8 grid grid-cols-1 gap-y-2">
      @for (book of borrowedBooks(); track book.isbn) {
        <li class="border-t border-gray-300 p-2 flex">
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
        </li>
      }
    </ul>
  `,
  imports: [DatePipe, ReturnBtn],
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
