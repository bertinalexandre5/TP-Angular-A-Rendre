import { HttpClient } from '@angular/common/http';
import { computed, inject, Service, signal } from '@angular/core';
import { tap } from 'rxjs';
import { API_URL } from '../api';

const TOKEN_KEY = 'token';

@Service()
export class AuthService {
    private readonly http = inject(HttpClient);

    private readonly tokenSignal = signal<string | null>(sessionStorage.getItem(TOKEN_KEY));

    readonly token = this.tokenSignal.asReadonly();
    readonly isLoggedIn = computed(() => this.tokenSignal() !== null);

    login(login: string, password: string) {
        return this.http
            .post<{ token: string }>(`${API_URL}/auth/login`, { login, password })
            .pipe(
                tap((response) => {
                    this.tokenSignal.set(response.token);
                    sessionStorage.setItem(TOKEN_KEY, response.token);
                }),
            );
    }

    logout() {
        return this.http.post<void>(`${API_URL}/auth/logout`, {}).pipe(
            tap(() => this.clearToken()),
        );
    }

    clearToken() {
        this.tokenSignal.set(null);
        sessionStorage.removeItem(TOKEN_KEY);
    }
}