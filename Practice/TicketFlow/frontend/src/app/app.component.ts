import { Component } from '@angular/core';
import { ApiService } from './services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  title = 'TicketFlow';

  constructor(public apiService: ApiService, private router: Router) { }

  logout() {
    this.apiService.logout();
    this.router.navigate(['/']);
  }
}
