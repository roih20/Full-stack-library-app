import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ToastMessageResponse } from '@app/types/types';
import { AuthService } from '@auth/auth-service';
import { ToastMessage } from '@ui/toast-message';

@Component({
  selector: 'log-in-form',
  template: `
    <form
      [formGroup]="loginForm"
      class="p-8 bg-white my-44 mx-auto max-w-lg rounded-lg border border-gray-300 relative"
      (ngSubmit)="signIn()"
    >
      @if (isToastOpen() && loginResponse().message) {
        <toast-message
          [message]="loginResponse().message"
          [isOk]="loginResponse().ok"
          class="absolute -top-20 inset-x-0 w-full"
          (closeToast)="closeToast($event)"
        />
      }
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
      <div class="mb-2">
        <label class="block mb-2 font-medium">
          Password
          <input
            type="password"
            formControlName="password"
            placeholder="********"
            class="w-full mt-1 p-2 rounded-sm focus:outline-none focus:ring"
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
              }
            </p>
          }
        </label>
      </div>
      <span class="mb-4 block text-right cursor-pointer hover:underline"> Forgot password? </span>
      <button
        type="submit"
        [disabled]="!loginForm.valid"
        class="bg-sky-500 mb-4 p-3 border-none font-medium text-white cursor-pointer w-full rounded-lg disabled:cursor-not-allowed"
      >
        Log In
      </button>
      <div class="flex items-center justify-center gap-x-2">
        <p>Not registerd?</p>
        <a class="text-slate-500 cursor-pointer hover:underline" routerLink="/signin"
          >Create an account</a
        >
      </div>
    </form>
  `,
  imports: [ReactiveFormsModule, RouterLink, ToastMessage],
})
export class LogInForm {
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  private authService = inject(AuthService);
  private router = inject(Router);
  isLoading = signal<boolean>(false);
  isToastOpen = signal<boolean>(false);
  loginResponse = signal<ToastMessageResponse>({
    message: '',
    ok: false,
  });

  signIn() {
    if (this.loginForm.valid) {
      this.isLoading.set(true);
      this.isToastOpen.set(false);
      this.loginResponse.set({
        message: '',
        ok: false,
      });
      const userInput = {
        email: this.loginForm.value.email,
        password: this.loginForm.value.password,
      };
      this.authService.login(userInput).subscribe({
        next: (response) => {
          this.isLoading.set(false);
          this.loginForm.reset();
          this.authService.setToken(response.token);
          this.router.navigate(['/']);
        },
        error: (error: HttpErrorResponse) => {
          if (error.status === 401 && !error.ok) {
            this.loginResponse.set({
              message: error.error.error,
              ok: false,
            });
            this.isToastOpen.set(true);
          }
        },
      });
    }
  }

  closeToast(isOpen: boolean) {
    this.isToastOpen.set(isOpen);
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }
}
