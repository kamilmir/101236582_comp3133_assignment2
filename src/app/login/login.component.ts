// login.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import Swal from 'sweetalert2';
import { LayoutComponent } from '../layout/layout.component';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [LayoutComponent, ReactiveFormsModule, HttpClientModule] // Ensure ReactiveFormsModule is imported
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isSaving = false;

  constructor(
    private router: Router,
    private http: HttpClient,
    private fb: FormBuilder
  ) {
    // Initialize the login form with validators
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    // Check if the user is already logged in
    if (localStorage.getItem('user') !== null) {
      // If the user is logged in, navigate to dashboard
      this.router.navigate(['/dashboard']);
    }
  }

  handleSave(): void {
    this.isSaving = true;

    const { email, password } = this.loginForm.value;
    const query = `query Login {
      login(username: "${email}", password: "${password}") {
        message
        token
      }
    }`;

    this.http.post('https://abulaiti-mierkamili-comp-3133-101236582-assignment1.vercel.app/graphql', { query })
      .subscribe(
        (response: any) => {
          const login = response?.data?.login;
          localStorage.setItem('user', JSON.stringify(response.data)); // Store the user data
          localStorage.setItem('token', login.token); // Store the token

          Swal.fire({
            icon: 'success',
            title: 'Login successfully!',
            showConfirmButton: false,
            timer: 1500
          });

          this.router.navigate(['/dashboard']); // Redirect to dashboard after successful login
          this.isSaving = false;
          this.loginForm.reset(); // Reset the form
        },
        error => {
          Swal.fire({
            icon: 'error',
            title: error?.error?.message || error?.message || 'An Error Occured!',
            showConfirmButton: false,
            timer: 1500
          });

          this.isSaving = false;
        }
      );
  }
}
