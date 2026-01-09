import { HttpClient, HttpContext } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AUTH_ENABLED } from '@interceptors/auth-interceptor';
import { Page, BorrowedBookResponse } from '@app/types/types';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MemberService {
  private readonly API_URL = 'http://localhost:8080/members';
  private http = inject(HttpClient);

  getBorrowedHistory(pageSize: number, currentPage: number): Observable<BorrowedBookResponse> {
    return this.http.get<BorrowedBookResponse>(
      `${this.API_URL}/borrow-history?size=${pageSize}&page=${currentPage}`,
      {
        context: new HttpContext().set(AUTH_ENABLED, true),
      },
    );
  }
}
