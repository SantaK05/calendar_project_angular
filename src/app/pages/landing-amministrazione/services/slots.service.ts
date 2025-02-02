import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Slot } from '../models/slot.model';
import { Observable, of } from 'rxjs';
import { slots } from '../moks/slots.mok';

@Injectable({
  providedIn: 'root',
})
export class SlotsService {
  BASE_URL: string = 'http://localhost:8080/amministrazione';
  slots = slots;

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
    //return this.http.get<Slot[]>(`${this.BASE_URL}/slots`);
    return of(this.slots);
  }

  doSingle(id: number): Observable<Slot> {
    //return this.http.get<Slot>(`${this.BASE_URL}/slots/${id}`);
    return of(this.slots.find(s => s.id === id)!)
  }

  doExport(): Observable<HttpResponse<Slot>> {
    return this.http.get<HttpResponse<Slot>>(`${this.BASE_URL}/slots/export`);
  }
}