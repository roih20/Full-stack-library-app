import { Component, input, output } from '@angular/core';
import { ArrowLeftIcon } from '@app/icons/arrow-left-icon';
import { ArrowRightIcon } from '@app/icons/arrow-right-icon';

@Component({
  selector: 'pagination',
  template: `
    <div class="flex justify-center items-center gap-x-8 my-4">
      <button
        class="p-2 rounded-full cursor-pointer border border-gray-400 text-gray-700 hover:border-gray-600 disabled:cursor-not-allowed disabled:text-gray-300 disabled:border-gray-200"
        (click)="handlePreviousPage()"
        [disabled]="currentPage() === 0"
      >
        <svg arrow-left-icon class="w-7 h-7"></svg>
      </button>
      <span class="font-medium text-lg text-slate-700"> {{ currentPage() + 1 }} </span>
      <button
        class="p-2 rounded-full cursor-pointer border border-gray-400 text-gray-700 hover:border-gray-600 disabled:cursor-not-allowed disabled:text-gray-300 disabled:border-gray-200"
        (click)="handleNextPage()"
        [disabled]="currentPage() >= totalPages() - 1"
      >
        <svg arrow-right-icon class="h-7 w-7"></svg>
      </button>
    </div>
  `,
  imports: [ArrowLeftIcon, ArrowRightIcon],
})
export class Pagination {
  currentPage = input<number>(0);
  totalPages = input<number>(0);
  pageChange = output<number>();

  handlePreviousPage(): void {
    if (this.currentPage() > 0) {
      this.pageChange.emit(this.currentPage() - 1);
    }
  }

  handleNextPage(): void {
    if (this.currentPage() < this.totalPages() - 1) {
      this.pageChange.emit(this.currentPage() + 1);
    }
  }
}
