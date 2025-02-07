import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../services/authentication.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    CommonModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  authService: AuthService = inject(AuthService);
  router: Router = inject(Router);
  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }
  loginForm!: FormGroup;
  private fb: FormBuilder = inject(FormBuilder);
  private snackBar: MatSnackBar = inject(MatSnackBar);

  onSubmit(): void {
    if (this.loginForm.valid) {
      console.log('Login Form Data:', this.loginForm.value);
      this.snackBar.open('Login Successful!', 'Close', { duration: 3000 });
    } else {
      this.snackBar.open('Invalid login credentials!', 'Close', {
        duration: 3000,
      });
    }
  }
  login() {
    console.log('Email:', this.email);
    this.authService.login(this.email, this.password).subscribe({
      next: () => {
        setTimeout(() => {  // Ensure token is stored before navigating
          this.errorMessage = '';
          this.snackBar.open('Login Successful!', 'Close', { duration: 3000 });
          console.log('🔹 Redirecting to Patients...');
          this.router.navigate(['/patients']);
        }, 500);  // Small delay to ensure storage completes
      },
      error: (error) => {
        this.errorMessage = 'Invalid credentials. Please try again.';
      }
    });
  }
}
