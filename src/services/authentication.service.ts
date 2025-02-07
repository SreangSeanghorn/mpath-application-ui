import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { tap, catchError, switchMap } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';
import { LoginResponse } from '../models/LoginResponse';
import { BaseAPIResponse } from '../models/BaseAPIResponse';
import { RefreshedTokenResponse } from '../models/RefreshedTokenResponse';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private API_URL = 'http://localhost:5063/api/authentication';
    private tokenKey = 'jwt_token';
    private refreshTokenKey = 'refresh_token';

    public isAuthenticated$: BehaviorSubject<boolean>;

    constructor(
        private http: HttpClient,
        private router: Router,
        private cookieService: CookieService
    ) {
        this.isAuthenticated$ = new BehaviorSubject<boolean>(this.isAuthenticated());
    }

    // ✅ Login Function
    login(email: string, password: string): Observable<LoginResponse> {
        return this.http.post<BaseAPIResponse<LoginResponse>>(
            `${this.API_URL}/login`,
            { email, password },
            { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }
        ).pipe(
            tap(response => {
                console.log("🔹 Login Response:", response);
                if (response.data.accessToken && response.data.refreshToken) {
                    this.storeTokens(response.data.accessToken, response.data.refreshToken);
                    this.isAuthenticated$.next(true);
                    this.router.navigate(['/patients']);
                }
            }),
            switchMap(response => {
                return new Observable<LoginResponse>(observer => {
                    observer.next(response.data);
                    observer.complete();
                });
            }),
            catchError(error => {
                console.error("❌ Login Error:", error);
                return throwError(() => error);
            })
        );
    }

    private storeTokens(accessToken: string, refreshToken: string) {
        console.log("🔹 Storing Tokens...");
        console.log("🔹 Access Token:", accessToken);
        console.log("🔹 Refresh Token:", refreshToken);
        this.cookieService.set(this.tokenKey, accessToken, 1, '/', '', true, 'Strict');
        this.cookieService.set(this.refreshTokenKey, refreshToken, 7, '/', '', true, 'Strict');
    }

    getToken(): string | null {
        return this.cookieService.get(this.tokenKey) || null;
    }

    getRefreshToken(): string | null {
        return this.cookieService.get(this.refreshTokenKey) || null;
    }

    refreshToken(): Observable<string> {
        console.log("🔄 Refreshing Token...");
        const refreshToken = this.getRefreshToken();
        if (!refreshToken) {
            console.error("❌ No Refresh Token Available. Logging Out...");
            this.logout();
            return throwError(() => new Error("No Refresh Token"));
        }

        return this.http.post<BaseAPIResponse<RefreshedTokenResponse>>(
            `${this.API_URL}/refresh-token`,
            { refreshToken },
            { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }
        ).pipe(
            tap(response => {
                console.log("🔄 New Token Received:", response.data.accessToken);
                if (response.data.accessToken && response.data.refreshToken) {
                    this.storeTokens(response.data.accessToken, response.data.refreshToken);
                }
            }),
            switchMap(response => new Observable<string>(observer => {
                observer.next(response.data.accessToken);
                observer.complete();
            })),
            catchError(error => {
                console.error("❌ Refresh Token Failed. Logging Out...");
                this.logout();
                return throwError(() => error);
            })
        );
    }
    logout(): void {
        console.log("🔹 Logging Out...");
        this.cookieService.delete(this.tokenKey);
        this.cookieService.delete(this.refreshTokenKey);
        this.isAuthenticated$.next(false);
        this.router.navigate(['/login']);
    }

    isAuthenticated(): boolean {
        return !!this.getToken();
    }
}