import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-employee-create',
  templateUrl: './employee-create.component.html',
  styleUrls: ['./employee-create.component.css'],
  imports: [RouterModule, ReactiveFormsModule, HttpClientModule] // Ensure ReactiveFormsModule is imported
})
export class EmployeeCreateComponent implements OnInit {
  employeeForm: FormGroup;
  isSaving: boolean = false;

  constructor(
    private router: Router,
    private http: HttpClient,
    private fb: FormBuilder
  ) {
    this.employeeForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      position: ['', Validators.required],
      salary: ['', [Validators.required, Validators.min(0)]],
      department: ['', Validators.required],
      gender: ['male', Validators.required]
    });
  }

  ngOnInit(): void {
    if (!localStorage.getItem('token')) {
      this.router.navigate(['/']);
    }
  }

  handleSave(): void {
    if (this.employeeForm.invalid) {
      return;
    }

    this.isSaving = true;
    const { firstName, lastName, email, position, salary, department, gender } = this.employeeForm.value;
    const query = `mutation AddEmployee {
      addEmployee(
        firstName: "${firstName}"
        lastName: "${lastName}"
        email: "${email}"
        position: "${position}"
        salary: ${salary}
        dateOfJoining: "${new Date()}"
        department: "${department}"
        gender: "${gender}"
      ) {
        id
        firstName
        lastName
        email
        gender
        position
        salary
        dateOfJoining
        department
      }
    }`;

    this.http.post<any>('https://abulaiti-mierkamili-comp-3133-101236582-assignment1.vercel.app/graphql', { query })
      .subscribe(
        (response) => {
          Swal.fire({
            icon: 'success',
            title: 'Employee saved successfully!',
            showConfirmButton: false,
            timer: 1500
          });
          this.isSaving = false;
          this.employeeForm.reset();
        },
        (error) => {
          Swal.fire({
            icon: 'error',
            title: error?.message || 'An error occurred!',
            showConfirmButton: false,
            timer: 1500
          });
          this.isSaving = false;
        }
      );
  }

  logout(): void {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    this.router.navigate(['/']);
  }
}
