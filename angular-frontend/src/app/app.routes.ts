import { Routes } from '@angular/router';
import { LogInForm } from '@auth/log-in-form';
import { SignInForm } from '@auth/sign-in-form';
import { guestGuard } from '@guards/guest-guard';
import { BooksPage } from '@routes/books-page';
import { BookPage } from '@routes/book-page';
import { ProfilePage } from '@routes/profile-page';
import { authGuard } from '@guards/auth-guard';

export const routes: Routes = [
  {
    path: '',
    component: BooksPage,
    title: 'Books',
  },
  {
    path: 'isbn/:isbn',
    component: BookPage,
    title: 'Book Details',
  },
  {
    path: 'login',
    component: LogInForm,
    title: 'Log In',
    canActivate: [guestGuard],
  },
  {
    path: 'signin',
    component: SignInForm,
    title: 'Create an account',
    canActivate: [guestGuard],
  },
  {
    path: 'profile',
    component: ProfilePage,
    title: 'Profile',
    canActivate: [authGuard],
  },
];
