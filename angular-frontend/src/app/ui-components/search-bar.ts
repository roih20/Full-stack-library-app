import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { SearchIcon } from '@icons/search-icon';

@Component({
  selector: 'search-bar',
  template: `
    <form [formGroup]="searchForm" (ngSubmit)="searchBooks()" class="">
      <div class="flex items-center border border-gray-400">
        <input
          formControlName="title"
          class="p-2 w-full bg-transparent placeholder:text-slate-500 focus:outline-none focus:ring-0"
          placeholder="Search books"
          maxlength="100"
        />
        <button type="submit" class="px-2 py-2 cursor-pointer bg-transparent">
          <svg search-icon class="h-6 w-6"></svg>
        </button>
      </div>
    </form>
  `,
  imports: [ReactiveFormsModule, SearchIcon],
})
export class SearchBar {
  private router = inject(Router);
  searchForm = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.maxLength(100)]),
  });

  searchBooks(): void {
    if (this.searchForm.valid) {
      this.router.navigate(['/'], {
        queryParams: { title: this.searchForm.value.title },
      });
    } else {
      this.router.navigate(['/']);
    }
  }
}
