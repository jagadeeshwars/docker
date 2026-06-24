import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html'
})
export class EventListComponent implements OnInit {
  events: any[] = [];
  bookingQuantities: { [key: number]: number } = {};
  message = '';

  constructor(public api: ApiService) {}

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents() {
    this.api.getEvents().subscribe({
      next: (data) => {
        this.events = data;
        this.events.forEach(e => this.bookingQuantities[e.id] = 1);
      },
      error: (err) => console.error(err)
    });
  }

  book(eventId: number) {
    if (!this.api.isLoggedIn()) {
      this.message = 'Please login to book tickets.';
      return;
    }
    const qty = this.bookingQuantities[eventId];
    this.api.bookTicket(eventId, qty).subscribe({
      next: () => {
        this.message = 'Successfully booked ticket!';
        this.loadEvents(); // Reload to update available tickets if backend was sending it
      },
      error: (err) => {
        this.message = err.error.message || 'Booking failed';
      }
    });
  }
}
