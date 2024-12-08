import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Calendario } from '../../interfaces/calendario';

@Injectable({
  providedIn: 'root'
})

export class CalendarioService {
    BASE_URL: string = "http://localhost:8081/";

    constructor(private http: HttpClient) { }

    getCalendarioJSON(year: number, month: number) {
        let calendar = this.http.get<Calendario>(`${this.BASE_URL}/home/m/${year}/${month}`);
        
        return calendar;
    }
}
