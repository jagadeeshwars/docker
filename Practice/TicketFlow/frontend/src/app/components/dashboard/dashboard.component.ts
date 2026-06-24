import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  bookings: any[] = [];
  error = '';

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.api.getUserBookings().subscribe({
      next: (data) => {
        this.bookings = data;
      },
      error: (err) => {
        this.error = 'Failed to load bookings.';
        console.error(err);
      }
    });
  }
}
