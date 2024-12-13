import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Slot } from './model/slots.model';
import { Observable } from 'rxjs';
import { Resource } from './model/resource.model';

@Injectable({
  providedIn: 'root',
})
export class AmministrazioneService {
  BASE_URL: string = 'http://localhost:8400/v1';
  constructor(private http: HttpClient) {}

  get slots(): Observable<Slot[]> {
    return this.http.get<Slot[]>(`${this.BASE_URL}/slots`);
  }

  get resources(): Observable<Resource[]> {
    return this.http.get<Resource[]>(`${this.BASE_URL}/resources`);
  }
}
