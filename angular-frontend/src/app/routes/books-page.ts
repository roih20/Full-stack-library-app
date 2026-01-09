import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { BookService } from '@books/book-service';
import { BookList } from '@books/book-list';
import { Navbar } from '@ui/navbar';
import { Book, SelectOption } from '@app/types/types';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { CustomSelect } from '@app/ui-components/custom-select';
import { Pagination } from '@app/ui-components/pagination';
import { ToastMessage } from '@app/ui-components/toast-message';
import { ToastMessageResponse } from '@app/types/types';
import { BooksListSkeleton } from '@app/skeletons/books-list-skelenton';

@Component({
  selector: 'books-page',
  template: `
    <navbar />
    <main class="my-12 mx-auto p-4 max-w-4xl relative">
      @if (isToastOpen() && borrowResponse().message) {
        <div class="fixed inset-0 flex items-start justify-center pointer-events-none z-50">
          <toast-message
            [isOk]="borrowResponse().ok"
            [message]="borrowResponse().message"
            class="mt-24 pointer-events-auto max-w-sm w-full "
            (closeToast)="onCloseToastMessage($event)"
          />
        </div>
      }
      <div class="flex flex-row items-center w-full">
        <custom-select
          placeholder="Sort by"
          [options]="selectOptions"
          (valueChange)="onSortBy($event)"
        />
      </div>
      @if (isLoading()) {
        <books-list-skeleton />
      } @else {
        <book-list
          (displayToast)="onDisplayTostMessage($event)"
          (borrowResponse)="getBorrowResponse($event)"
          (afterBorrow)="onBookBorrowed($event)"
          [books]="books()"
        />
      }
      <pagination
        [currentPage]="currentPage()"
        [totalPages]="totalPages()"
        (pageChange)="onPageChange($event)"
      />
    </main>
  `,
  imports: [BookList, Navbar, CustomSelect, Pagination, ToastMessage, BooksListSkeleton],
})
export class BooksPage implements OnInit, OnDestroy {
  private bookService = inject(BookService);
  private route = inject(ActivatedRoute);
  private querySubscription?: Subscription;

  books = signal<Book[]>([]);
  isLoading = signal<boolean>(false);
  titleParam = signal<string>('');
  pageSize = signal<number>(10);
  currentPage = signal<number>(0);
  totalPages = signal<number>(0);
  totalElements = signal<number>(0);
  sortBooksBy = signal<string>('');
  isToastOpen = signal<boolean>(false);
  borrowResponse = signal<ToastMessageResponse>({
    message: '',
    ok: false,
  });

  selectOptions: SelectOption[] = [
    {
      value: 'title,ASC',
      label: 'Title: A to Z',
    },
    {
      value: 'title,DESC',
      label: 'Title: Z to A',
    },
  ];

  ngOnInit(): void {
    this.querySubscription = this.route.queryParams.subscribe((params) => {
      const title = params['title'] || '';

      this.currentPage.set(0);

      if (title) {
        this.titleParam.set(title);
        this.searchBooks();
      } else {
        this.titleParam.set('');
        this.loadBooks();
      }
    });
  }

  ngOnDestroy(): void {
    this.querySubscription?.unsubscribe();
  }

  loadBooks(): void {
    this.isLoading.set(true);

    this.bookService.getBooks(this.pageSize(), this.currentPage(), this.sortBooksBy()).subscribe({
      next: (response) => {
        this.books.set(response.content);
        this.totalPages.set(response.page.totalPages);
        this.totalElements.set(response.page.totalElements);
        this.isLoading.set(false);
      },
      error: (error) => {
        this.isLoading.set(false);
        this.books.set([]);
      },
    });
  }

  searchBooks(): void {
    this.isLoading.set(true);

    this.bookService
      .getBooksByTitle(this.titleParam(), this.pageSize(), this.currentPage())
      .subscribe({
        next: (response) => {
          this.books.set(response.content);
          this.totalPages.set(response.page.totalPages);
          this.totalElements.set(response.page.totalElements);
          this.isLoading.set(false);
        },
        error: (error) => {
          this.isLoading.set(false);
          this.books.set([]);
        },
      });
  }

  onPageChange(page: number): void {
    this.currentPage.set(page);

    if (this.titleParam()) {
      this.searchBooks();
    } else {
      this.loadBooks();
    }
  }

  onSortBy(sortBy: string | number) {
    this.sortBooksBy.set(sortBy.toString());
    this.currentPage.set(0);

    if (this.titleParam()) {
      this.searchBooks();
    } else {
      this.loadBooks();
    }
  }

  onDisplayTostMessage(open: boolean): void {
    this.isToastOpen.set(open);
  }

  onCloseToastMessage(isOpen: boolean): void {
    this.isToastOpen.set(isOpen);
  }

  getBorrowResponse(response: ToastMessageResponse): void {
    this.borrowResponse.set(response);
  }

  onBookBorrowed(isbn: string): void {
    const updatedBooks = this.books().map((book) =>
      book.isbn === isbn ? { ...book, isBorrowed: true } : book,
    );
    this.books.set(updatedBooks);
  }
}
