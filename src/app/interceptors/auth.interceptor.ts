import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, switchMap, catchError, BehaviorSubject, filter, take } from 'rxjs';
import { AuthService } from '../../services/authentication.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

  constructor(private authService: AuthService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log("🔹 AuthInterceptor Executing...");

    let token = this.authService.getToken();
    console.log("🔹 Retrieved Token in Interceptor:", token);

    if (token) {
      req = this.addToken(req, token);
    }

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error("❌ Interceptor caught an error:", error);
        console.log("❌ Error Status:", error.status);
        if (error.status === 401) {
          console.warn("⚠️ 401 Unauthorized - Attempting Token Refresh...");
          return this.handle401Error(req, next);
        }

        return throwError(() => error);
      })
    );
  }

  private addToken(request: HttpRequest<any>, token: string) {
    return request.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log("🔹 Handling 401 Error...");

    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      return this.authService.refreshToken().pipe(
        switchMap((newToken: string) => {
          console.log("✅ Token refreshed successfully!");
          this.isRefreshing = false;
          this.refreshTokenSubject.next(newToken);
          return next.handle(this.addToken(request, newToken));
        }),
        catchError((err) => {
          console.error("❌ Token refresh failed. Logging out...");
          this.isRefreshing = false;
          this.authService.logout();
          return throwError(() => err);
        })
      );
    } else {
      console.log("🔹 Waiting for refresh token to complete...");
      return this.refreshTokenSubject.pipe(
        filter(token => token !== null),
        take(1),
        switchMap(token => {
          console.log("🔹 Using new token:", token);
          return next.handle(this.addToken(request, token!));
        })
      );
    }
  }
}