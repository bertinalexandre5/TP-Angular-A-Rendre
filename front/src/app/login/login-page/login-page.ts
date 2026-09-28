import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-login-page',
  styleUrl: './login-page.css',
  templateUrl: './login-page.html',
})
export class LoginPage {
  private readonly formBuilder = inject(NonNullableFormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly form = this.formBuilder.group({
    login: ['', Validators.required],
    password: ['', Validators.required],
  });

  protected readonly errorMessage = signal<string | null>(null);
  protected readonly loading = signal(false);

  protected submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.errorMessage.set(null);

    const { login, password } = this.form.getRawValue();

    this.auth.login(login, password).subscribe({
      next: () => this.router.navigateByUrl('/caisse'),
      error: (error: HttpErrorResponse) => {
        this.loading.set(false);
        if (error.status === 401) {
          this.errorMessage.set('Identifiant ou mot de passe incorrect');
        } else if (error.status === 0) {
          this.errorMessage.set('Le serveur ne répond pas');
        } else {
          this.errorMessage.set('Une erreur inattendue est survenue');
        }
      },
    });
  }
}