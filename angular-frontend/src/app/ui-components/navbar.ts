import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '@auth/auth-service';
import { UserIcon } from '@icons/user-icon';
import { LogoutIcon } from '@icons/logout-icon';
import { SearchBar } from '@ui/search-bar';

@Component({
  selector: 'navbar',
  template: `
    <div class="border-b border-gray-200 p-4">
      <nav class="max-w-7xl mx-auto flex items-center justify-between">
        <a class="font-medium text-2xl p-2 cursor-pointer hover:text-red-700" routerLink="/">
          E-library
        </a>

        <search-bar class="w-full max-w-md" />

        @if (!username) {
          <div class="flex flex-row items-center">
            <a
              class="flex items-center p-2.5 hover:text-red-700 cursor-pointer"
              routerLink="/login"
            >
              <svg user-icon class="h-5 w-5  mr-2"></svg>
              Log in
            </a>
            <span class="mx-1"> | </span>
            <a class="p-2.5 cursor-pointer hover:text-red-700" routerLink="/signin"> Register </a>
          </div>
        } @else {
          <div class="flex flex-row items-center">
            <a
              routerLink="/profile"
              class="flex items-center cursor-pointer p-2 hover:text-red-700"
            >
              <svg user-icon class="w-5 h-5 mr-2"></svg>
              {{ username }}
            </a>
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
        }
      </nav>
    </div>
  `,
  imports: [RouterLink, UserIcon, LogoutIcon, SearchBar],
})
export class Navbar {
  private authService = inject(AuthService);

  logout(): void {
    this.authService.logout();
  }

  get username() {
    return this.authService.name();
  }
}
