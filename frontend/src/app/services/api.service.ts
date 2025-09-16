import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  // Nginx proxy ke zariye backend API ko call karenge
  private apiUrl = '/api/message'; 

  constructor(private http: HttpClient) { }

  getMessage(): Observable<{message: string}> {
    return this.http.get<{message: string}>(this.apiUrl);
  }
}
