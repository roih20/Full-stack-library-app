import { Component, input, output } from '@angular/core';
import { ErrorIcon } from '@icons/error-icon';
import { SuccessIcon } from '@icons/success-icon';
import { CloseIcon } from '@icons/close-icon';

@Component({
  selector: 'toast-message',
  template: `
    <div
      class="w-full px-2 py-3 border-l-10 shadow-lg z-20 rounded-lg bg-zinc-50 relative"
      [class]="isOk() ? 'border-green-500' : 'border-red-500'"
    >
      <button
        type="button"
        class="absolute top-2 right-2 cursor-pointer"
        (click)="closeToastMessage()"
      >
        <svg close-icon class="w-6 h-6"></svg>
      </button>
      <div class="flex items-center gap-x-3">
        @if (!isOk()) {
          <svg error-icon class="w-8 h-8 text-red-600"></svg>
        } @else {
          <svg success-icon class="w-8 h-8 text-green-600"></svg>
        }
        <div class="">
          <p class="font-semibold">
            {{ isOk() ? 'Success!' : 'Error!' }}
          </p>
          <p class="text-sm text-zinc-600">
            {{ message() }}
          </p>
        </div>
      </div>
    </div>
  `,
  imports: [ErrorIcon, SuccessIcon, CloseIcon],
})
export class ToastMessage {
  message = input.required<string>();
  isOk = input.required<boolean>();
  closeToast = output<boolean>();

  closeToastMessage(): void {
    this.closeToast.emit(false);
  }
}
