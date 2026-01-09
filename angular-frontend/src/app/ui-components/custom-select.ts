import { Component, input, output, signal } from '@angular/core';
import { ArrowDownIcon } from '@app/icons/arrow-down-icon';
import { SelectOption } from '@app/types/types';

@Component({
  selector: 'custom-select',
  template: `
    <div class="relative">
      <button
        (click)="toggleDropdown()"
        class="flex items-center justify-between border py-1 pl-1.5 w-52 border-gray-300 text-slate-700 font-medium cursor-pointer"
      >
        <span>{{ placeholder() }}: {{ selectedOption()?.label }}</span>
        <svg arrow-down-icon class="h-6 w-6 text-black"></svg>
      </button>
      <!-- dropdown -->
      @if (isOpen()) {
        <ul class="absolute pt-1 px-2 z-10 w-full mt-1 bg-white border border-gray-300  shadow-xl">
          @for (option of options(); track option.value) {
            <li
              class="border-b py-1.5 border-gray-400 cursor-pointer"
              (click)="selectOption(option)"
            >
              <p class="hover:bg-gray-100 hover:text-red-700 px-2 py-1.5 text-slate-700">
                {{ option.label }}
              </p>
            </li>
          }
        </ul>
      }
    </div>
  `,
  imports: [ArrowDownIcon],
})
export class CustomSelect {
  placeholder = input<string>('');
  options = input<SelectOption[]>([]);
  valueChange = output<string | number>();
  isOpen = signal<boolean>(false);
  selectedOption = signal<SelectOption | undefined>(undefined);

  toggleDropdown() {
    this.isOpen.update((value) => !value);
  }

  selectOption(option: SelectOption) {
    this.selectedOption.set(option);
    this.valueChange.emit(option.value);
    this.toggleDropdown();
  }
}
