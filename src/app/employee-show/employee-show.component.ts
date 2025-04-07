import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import Swal from 'sweetalert2'; // For showing alert messages (optional)
import { CurrencyPipe, DatePipe } from '@angular/common'
@Component({
  selector: 'app-employee-show',
  templateUrl: './employee-show.component.html',
  styleUrls: ['./employee-show.component.css'],
  imports: [HttpClientModule, DatePipe, CurrencyPipe, RouterModule],
})
export class EmployeeShowComponent implements OnInit {
  employeeId: string = '';
  employee: any = {};
  
  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Get the employee ID from the route
    this.employeeId = this.route.snapshot.paramMap.get('id')!;

    // Fetch employee details
    this.getEmployeeDetails();
  }

  // Method to fetch employee details
  getEmployeeDetails() {
    const query = `
      query SearchEmployeeById {
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
      }
    `;

    this.http.post<any>('https://abulaiti-mierkamili-comp-3133-101236582-assignment1.vercel.app/graphql', { query })
      .subscribe(
        response => {
          this.employee = response.data.searchEmployeeById;
        },
        error => {
          Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: error.message || 'An error occurred while fetching employee details.',
            showConfirmButton: true
          });
        }
      );
  }
}
