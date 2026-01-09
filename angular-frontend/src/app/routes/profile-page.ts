import { Component, inject, OnInit, signal } from '@angular/core';
import { MemberService } from '@services/member-service';
import { AuthService } from '@auth/auth-service';
import { BorrowedBook, ToastMessageResponse } from '@app/types/types';
import { BorrowedBooksList } from '@app/books/borrowed-books-list';
import { Pagination } from '@app/ui-components/pagination';
import { ToastMessage } from '@app/ui-components/toast-message';
import { LogoutIcon } from '@app/icons/logout-icon';
import { Router } from '@angular/router';

@Component({
  selector: 'profile-page',
  template: `
    <main class="my-18 mx-auto p-4 max-w-5xl">
      <div class="flex items-center">
        <p class="text-xl p-2">{{ name }}</p>
        <span class="mx-1"> | </span>
        <button
          type="button"
          (click)="logout()"
          class="p-2 flex items-center cursor-pointer hover:text-red-700"
        >
          <svg logout-icon class="w-5 h-5 mr-2"></svg>
          Log out
        </button>
      </div>
      <p
        class="mt-4 p-2  inline-block border-x border-t text-slate-700 border-gray-300 rounded-t-lg"
      >
        Borrow History
      </p>
      @if (isToastOpen() && returnResponse().message) {
        <div class="fixed inset-0 flex items-start justify-center pointer-events-none z-50">
          <toast-message
            [message]="returnResponse().message"
            [isOk]="returnResponse().ok"
            (closeToast)="onCloseToast($event)"
            class="mt-24 pointer-events-auto max-w-sm w-full "
          />
        </div>
      }
      <!-- Implement borrow history component-->
      @if (isLoading()) {
        <p>Loading borrow history...</p>
      } @else {
        <borrowed-books-list
          [borrowedBooks]="books()"
          (displayToast)="onDisplayToast($event)"
          (returnResponse)="getReturnResponse($event)"
        />
      }
      <pagination
        [currentPage]="currentPage()"
        [totalPages]="totalPages()"
        (pageChange)="onPageChange($event)"
      />
    </main>
  `,
  imports: [BorrowedBooksList, Pagination, ToastMessage, LogoutIcon],
})
export class ProfilePage implements OnInit {
  private authService = inject(AuthService);
  private memberService = inject(MemberService);
  private route = inject(Router);
  books = signal<BorrowedBook[]>([]);
  isLoading = signal<boolean>(false);
  pageSize = signal<number>(5);
  totalPages = signal<number>(0);
  currentPage = signal<number>(0);
  isToastOpen = signal<boolean>(false);
  returnResponse = signal<ToastMessageResponse>({
    message: '',
    ok: false,
  });

  ngOnInit(): void {
    this.loadBorrowHistory();
  }

  loadBorrowHistory(): void {
    this.isLoading.set(true);
    this.memberService.getBorrowedHistory(this.pageSize(), this.currentPage()).subscribe({
      next: (response) => {
        this.books.set(response.content);
        this.totalPages.set(response.page.totalPages);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.books.set([]);
        this.isLoading.set(false);
      },
    });
  }

  onPageChange(page: number) {
    this.currentPage.set(page);
    this.loadBorrowHistory();
  }

  onDisplayToast(isOpen: boolean): void {
    this.isToastOpen.set(isOpen);
  }

  getReturnResponse(response: ToastMessageResponse): void {
    this.returnResponse.set(response);
  }

  onCloseToast(close: boolean): void {
    this.isToastOpen.set(close);
    this.returnResponse.set({
      message: '',
      ok: false,
    });
  }

  logout(): void {
    this.authService.logout();
    this.route.navigate(['/']);
  }

  get name() {
    return this.authService.name();
  }
}
