import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Slot } from '../models/slot.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SlotsService {
  BASE_URL: string = 'http://localhost:8080/amministrazione';

  constructor(private http: HttpClient) {}

  doSave(data: Slot): Observable<Slot> {
    return this.http.post<Slot>(`${this.BASE_URL}/slots`, data);
  }

  doEdit(data: Slot): Observable<Slot> {
    console.log('data', data);
    return this.http.put<Slot>(`${this.BASE_URL}/slots`, data);
  }

  doDelete(id: number): Observable<Slot> | any {
    return this.http.delete(`${this.BASE_URL}/slots/${id}`);
  }

  doAll(): Observable<Slot[]> {
    return this.http.get<Slot[]>(`${this.BASE_URL}/slots`);
  }

  doSingle(id: number): Observable<Slot> {
    return this.http.get<Slot>(`${this.BASE_URL}/slots/${id}`);
  }

  doExport(): Observable<any> {
    return this.http.get(`${this.BASE_URL}/slots/export`, {
      responseType: 'blob',
    });
  }
}
