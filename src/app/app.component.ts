import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';  // Import RouterOutlet
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [RouterOutlet, RouterModule],  // Import necessary modules (like RouterOutlet)
  styleUrls: ['./app.component.css'],  // Fixed typo: styleUrls (plural)
})
export class AppComponent {
  title = 'test';
}
