import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Template } from './interfaces/template';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TemplateService {
  BASE_URL: string = "http://localhost:8080/api/email-service/template";

  currentTemplateSubject: Subject<Template> = new Subject();

  constructor(private client: HttpClient) { 
    
  }

  readTemplate(name: string){
    this.client.get<Template>(`${this.BASE_URL}?name=${name}`).subscribe(data => {
      this.currentTemplateSubject.next(data);
    })
  }

  update(data: Template){
    this.client.put(`${this.BASE_URL}`, data).subscribe();
  }
}
