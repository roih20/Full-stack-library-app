import { Component } from '@angular/core';
import { SingleBook } from '@books/single-book';

@Component({
  selector: 'book-page',
  template: `
    <main class="min-h-screen mx-auto p-4 max-w-7xl">
      <single-book />
    </main>
  `,
  imports: [SingleBook],
})
export class BookPage {}
