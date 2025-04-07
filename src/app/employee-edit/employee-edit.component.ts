import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-employee-edit',
  templateUrl: './employee-edit.component.html',
  styleUrls: ['./employee-edit.component.css'],
  imports: [ReactiveFormsModule, HttpClientModule, RouterModule]
})
export class EmployeeEditComponent implements OnInit {
  employeeForm: FormGroup;
  isSaving: boolean = false;
  employeeId: string = '';

  constructor(
    private route: ActivatedRoute,
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
    // Get the employee ID from the URL parameters
    this.employeeId = this.route.snapshot.paramMap.get('id')!;

    // Check if the user is logged in
    if (!localStorage.getItem('token')) {
      this.router.navigate(['/']);
    }

    // Fetch employee details by ID
    const query = `query SearchEmployeeById {
      searchEmployeeById(eid: "${this.employeeId}") {
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
          const employee = response?.data?.searchEmployeeById;
          if (employee) {
            this.employeeForm.patchValue(employee);
          }
        },
        (error) => {
          Swal.fire({
            icon: 'error',
            title: error?.message || 'An error occurred!',
            showConfirmButton: false,
            timer: 1500
          });
        }
      );
  }

  handleSave(): void {
    if (this.employeeForm.invalid) {
      return;
    }

    this.isSaving = true;

    const { firstName, lastName, email, position, salary, department, gender } = this.employeeForm.value;
    const query = `mutation UpdateEmployee {
      updateEmployee(
        eid: "${this.employeeId}", 
        firstName: "${firstName}", 
        lastName: "${lastName}", 
        email: "${email}", 
        position: "${position}", 
        salary: ${Number(salary)}, 
        department: "${department}", 
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
            title: 'Employee updated successfully!',
            showConfirmButton: false,
            timer: 1500
          });
          this.isSaving = false;
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
