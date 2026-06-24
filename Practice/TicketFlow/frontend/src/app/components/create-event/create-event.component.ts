import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.component.html'
})
export class CreateEventComponent {
  eventData = {
    title: '',
    description: '',
    date: '',
    location: '',
    total_tickets: 100,
    price: 0
  };
  error = '';
  message = '';

  constructor(private api: ApiService, private router: Router) {
    if (!this.api.isAdmin()) {
      this.router.navigate(['/']);
    }
  }

  createEvent() {
    this.error = '';
    this.message = '';
    
    if (!this.eventData.title || !this.eventData.date || !this.eventData.location) {
      this.error = 'Title, Date, and Location are required.';
      return;
    }

    this.api.createEvent(this.eventData).subscribe({
      next: () => {
        this.message = 'Event created successfully!';
        setTimeout(() => this.router.navigate(['/']), 1500);
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to create event';
      }
    });
  }
}
