import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css'],
  imports: [RouterModule, CommonModule, HttpClientModule, ReactiveFormsModule]
})
export class EmployeeListComponent implements OnInit {
  employeeList: any[] = [];

  constructor(
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    // Check if the user is logged in by checking localStorage
    if (!localStorage.getItem('token')) {
      this.router.navigate(['/']);
    } else {
      this.fetchEmployeeList();
    }
  }

  // Fetch the list of employees
  fetchEmployeeList(): void {
    const query = `query GetAllEmployee {
      getAllEmployee {
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
          this.employeeList = response?.data?.getAllEmployee || [];
        },
        (error) => {
          console.error(error);
        }
      );
  }

  // Handle deletion of an employee
  handleDelete(id: string): void {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        const query = `mutation DeleteEmployee {
          deleteEmployee(eid: "${id}")
        }`;

        this.http.post<any>('https://abulaiti-mierkamili-comp-3133-101236582-assignment1.vercel.app/graphql', { query })
          .subscribe(
            (response) => {
              Swal.fire({
                icon: 'success',
                title: 'Employee deleted successfully!',
                showConfirmButton: false,
                timer: 1500
              });
              this.fetchEmployeeList(); // Re-fetch the employee list after deletion
            },
            (error) => {
              Swal.fire({
                icon: 'error',
                title: error?.error?.message || 'An error occurred!',
                showConfirmButton: false,
                timer: 1500
              });
            }
          );
      }
    });
  }

  // Handle logout
  logout(): void {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    this.router.navigate(['/']);
  }
}
