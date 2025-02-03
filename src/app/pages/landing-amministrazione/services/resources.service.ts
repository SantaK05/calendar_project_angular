import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Resource } from '../models/resource.model';
import { Observable, of } from 'rxjs';
import { resources } from '../moks/resources.mok';

@Injectable({
  providedIn: 'root',
})
export class ResourcesService {
  BASE_URL: string = 'http://localhost:8080/amministrazione';
  resources = resources;

  constructor(private http: HttpClient) {}

  doSave(data: Resource): Observable<Resource> {
    return this.http.post<Resource>(`${this.BASE_URL}/resources`, data);
  }

  doEdit(data: Resource): Observable<Resource> {
    return this.http.put<Resource>(`${this.BASE_URL}/resources`, data);
  }

  doDelete(id: number): Observable<Resource> | any {
    return this.http.delete(`${this.BASE_URL}/resources/${id}`);
  }

  doAll(): Observable<Resource[]> {
    //return this.http.get<Resource[]>(`${this.BASE_URL}/resources`);
    return of(this.resources);
  }

  doSingle(id: number): Observable<Resource> {
    //return this.http.get<Resource>(`${this.BASE_URL}/resources/${id}`);
    return of(this.resources.find(r => r.id === id)!);
  }

  doExport(): Observable<HttpResponse<Resource>> {
    return this.http.get<HttpResponse<Resource>>(`${this.BASE_URL}/resources/export`);
  }
}