export interface SelectOption {
  value: number | string;
  label: string;
}

export interface Book {
  isbn: string;
  title: string;
  isBorrowed: boolean;
  author: string;
}

export interface Page {
  number: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface BookResponse {
  content: Book[];
  page: Page;
}

export interface DecodeToken {
  roles: string[];
  name: string;
  sub: string;
  iat: number;
  exp: number;
}

export interface LoginResponse {
  token: string;
}

export interface BorrowResponse {
  message: string;
}

export interface ReturnBookResponse {
  message: string;
}

export interface BorrowedBook {
  isbn: string;
  title: string;
  author: string;
  borrowedDate: string;
  returnedDate: string | null;
}

export interface BorrowedBookResponse {
  content: BorrowedBook[];
  page: Page;
}

export interface ToastMessageResponse {
  message: string;
  ok: boolean;
}
