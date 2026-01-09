import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './ui-components/navbar';

@Component({
  selector: 'app-root',
  template: ` <router-outlet /> `,
  imports: [RouterOutlet],
})
export class App {
  protected readonly title = signal('angular-21-tutorial');
}
