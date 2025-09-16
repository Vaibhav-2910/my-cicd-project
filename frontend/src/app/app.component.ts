import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Ise import karein
import { HttpClientModule } from '@angular/common/http'; // Ise import karein
import { ApiService } from './services/api.service';

@Component({
  selector: 'app-root',
  standalone: true, // Ise add karein
  imports: [CommonModule, HttpClientModule], // Ise add karein
  templateUrl: './app.component.html',
  providers: [ApiService] // Service ko yahan provide karein
})
export class AppComponent implements OnInit {
  title = 'frontend';
  messageFromBackend = 'Loading...';

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.apiService.getMessage().subscribe(data => {
      this.messageFromBackend = data.message;
    });
  }
}
