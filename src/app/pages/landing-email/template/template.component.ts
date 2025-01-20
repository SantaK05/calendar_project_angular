import { Component } from '@angular/core';
import { TemplateService } from '../template.service';
import { Template } from '../interfaces/template';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-template',
  imports: [FormsModule],
  templateUrl: './template.component.html',
  styleUrl: './template.component.css'
})
export class TemplateComponent {

  current: Template = {
    name: "",
    object:  "",
    body: ""
  }

  constructor(private service: TemplateService){
    this.service.currentTemplateSubject.subscribe(data =>{
      this.current = data;
    });
  }

  readTemplate(){
    this.service.readTemplate(this.current.name);
  }

  update(){
    this.service.update(this.current);
  }
}
