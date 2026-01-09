import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '@auth/auth-service';
import { ToastMessage } from '@ui/toast-message';
import { LoaderIcon } from '@icons/loader-icon';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastMessageResponse } from '@app/types/types';

@Component({
  selector: 'sign-in-form',
  template: `
    <form
      [formGroup]="signupForm"
      class="p-8 bg-white my-24 mx-auto max-w-lg rounded-lg border border-gray-300 relative"
      (ngSubmit)="createAccount()"
    >
      @if (isToastOpen() && signinResponse().message) {
        <toast-message
          [message]="signinResponse().message"
          [isOk]="signinResponse().ok"
          class="absolute -top-20 inset-x-0 w-full"
          (closeToast)="onCloseToast($event)"
        />
      }
      <div class="mb-4">
        <label class="font-medium block mb-2 w-full">
          First name
          <input
            type="text"
            formControlName="firstname"
            placeholder="John"
            class="w-full p-2 mt-1 rounded-sm focus:outline-none focus:ring"
            [class]="
              firstname?.invalid && firstname?.touched
                ? 'border border-red-500 focus:ring-red-500'
                : 'border border-gray-300 focus:ring-gray-400'
            "
          />
          @if (firstname?.invalid && firstname?.touched) {
            <p class="font-normal text-sm mt-1 text-red-500">
              @if (firstname?.errors?.['required']) {
                First name is required
              } @else if (firstname?.errors?.['minlength']) {
                First name must be at least 3 characters long
              } @else if (firstname?.errors?.['maxlength']) {
                First name must be less than 30 characters long
              }
            </p>
          }
        </label>
      </div>
      <div class="mb-4">
        <label class="font-medium block mb-2 w-full">
          Last name
          <input
            type="text"
            formControlName="lastname"
            placeholder="Doe"
            class="w-full p-2 mt-1 rounded-sm focus:outline-none focus:ring"
            [class]="
              lastname?.invalid && lastname?.touched
                ? 'border border-red-500 focus:ring-red-500'
                : 'border border-gray-300 focus:ring-gray-400'
            "
          />
          @if (lastname?.invalid && lastname?.touched) {
            <p class="font-normal text-sm mt-1 text-red-500">
              @if (lastname?.errors?.['required']) {
                Last name is required
              } @else if (lastname?.errors?.['minlength']) {
                Last name must be at least 3 characters long
              } @else if (lastname?.errors?.['maxlength']) {
                Last name must be less than 30 characters long
              }
            </p>
          }
        </label>
      </div>
      <div class="mb-4">
        <label class="block mb-2 font-medium">
          Email
          <input
            type="email"
            formControlName="email"
            placeholder="you@example.com"
            class="w-full p-2 mt-1 rounded-sm focus:outline-none focus:ring"
            [class]="
              email?.invalid && email?.touched
                ? 'border border-red-500 focus:ring-red-500'
                : 'border border-gray-300 focus:ring-gray-400'
            "
          />
          @if (email?.invalid && email?.touched) {
            <p class="font-normal text-sm mt-1 text-red-500">
              @if (email?.errors?.['required']) {
                Email is required
              } @else if (email?.errors?.['email']) {
                Enter a valid email
              }
            </p>
          }
        </label>
      </div>
      <div class="mb-4">
        <label class="block mb-2 font-medium">
          Password
          <input
            type="password"
            formControlName="password"
            placeholder="********"
            class="w-full p-2 mt-1 rounded-sm focus:outline-none focus:ring"
            [class]="
              password?.invalid && password?.touched
                ? 'border border-red-500 focus:ring-red-500'
                : 'border border-gray-300 focus:ring-gray-400'
            "
          />
          @if (password?.invalid && password?.touched) {
            <p class="font-normal text-sm mt-1 text-red-500">
              @if (password?.errors?.['required']) {
                Password is required
              } @else if (password?.errors?.['minlength']) {
                Password must be at least 8 characters long
              }
            </p>
          }
        </label>
      </div>
      <button
        type="submit"
        [disabled]="!signupForm.valid || isLoading()"
        class="bg-sky-500 mb-4 p-3 border-none font-medium text-white cursor-pointer w-full rounded-lg disabled:cursor-not-allowed"
        [class]="isLoading() ? 'flex flex-row items-center justify-center gap-x-4' : 'block'"
      >
        @if (isLoading()) {
          <svg loader-icon class="h-6 w-6 text-white animate-spin"></svg>
          <span>Creating account...</span>
        } @else {
          Create account
        }
      </button>
      <div class="flex items-center gap-x-2 justify-center">
        <p>Already have an account?</p>
        <a class="text-slate-500 cursor-pointer hover:underline" routerLink="/login">Sign In</a>
      </div>
    </form>
  `,
  imports: [ReactiveFormsModule, RouterLink, ToastMessage, LoaderIcon],
})
export class SignInForm {
  signupForm = new FormGroup({
    firstname: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(30),
    ]),
    lastname: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(30),
    ]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
  });

  private authService = inject(AuthService);
  private router = inject(Router);
  isLoading = signal<boolean>(false);
  isToastOpen = signal<boolean>(false);
  signinResponse = signal<ToastMessageResponse>({
    message: '',
    ok: false,
  });

  createAccount() {
    if (this.signupForm.valid) {
      this.isLoading.set(true);
      this.isToastOpen.set(false);
      this.signinResponse.set({
        message: '',
        ok: false,
      });
      const userInput = {
        name: this.signupForm.value.firstname + ' ' + this.signupForm.value.lastname,
        email: this.signupForm.value.email,
        password: this.signupForm.value.password,
      };
      this.authService.signup(userInput).subscribe({
        next: (response) => {
          this.isLoading.set(false);
          this.signupForm.reset();
          this.router.navigate(['/login']);
        },
        error: (error: HttpErrorResponse) => {
          this.isLoading.set(false);
          if (!error.ok) {
            this.signinResponse.set({
              message: error.error.error,
              ok: false,
            });
            this.isToastOpen.set(true);
          }
        },
      });
    }
  }

  onCloseToast(isOpen: boolean) {
    this.isToastOpen.set(isOpen);
  }

  get firstname() {
    return this.signupForm.get('firstname');
  }

  get lastname() {
    return this.signupForm.get('lastname');
  }

  get email() {
    return this.signupForm.get('email');
  }

  get password() {
    return this.signupForm.get('password');
  }
}
