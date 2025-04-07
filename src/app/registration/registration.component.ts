import { Component } from '@angular/core';
import Swal from 'sweetalert2';
import axios from 'axios';
import { FormsModule } from '@angular/forms';
import { LayoutComponent } from '../layout/layout.component';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css'],
  standalone: true,  // Mark this component as standalone
  imports: [FormsModule, LayoutComponent],  // Import FormsModule here
})
export class RegistrationComponent {
  name: string = '';
  email: string = '';
  password: string = '';
  passwordConfirmation: string = '';
  isSaving: boolean = false;

  handleSave() {
    this.isSaving = true;
    if (this.password !== this.passwordConfirmation) {
      Swal.fire({
        icon: 'error',
        title: 'Password does not match!',
        showConfirmButton: false,
        timer: 1500
      });
      this.isSaving = false;
      return;
    }

    axios.post('https://abulaiti-mierkamili-comp-3133-101236582-assignment1.vercel.app/graphql/', {
      query: `mutation Signup {
        signup(username: "${this.name}", email: "${this.email}", password: "${this.password}") {
          message
          username
          email
        }
      }`
    })
    .then((response: any) => {
      localStorage.setItem("user", JSON.stringify(response.data));
      Swal.fire({
        icon: 'success',
        title: 'User created successfully!',
        showConfirmButton: false,
        timer: 1500
      });
      this.isSaving = false;
      this.name = '';
      this.email = '';
      this.password = '';
      this.passwordConfirmation = '';
    })
    .catch((error: any) => {
      Swal.fire({
        icon: 'error',
        title: error.response?.data?.message || error.message || 'An Error Occured!',
        showConfirmButton: false,
        timer: 1500
      });
      this.isSaving = false;
    });
  }
}