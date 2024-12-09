import { Component } from '@angular/core';
import { Email } from '../interfaces/email';
import { EmailType } from '../enums/email-type';
import { EmailService } from '../email.service';

@Component({
  selector: 'app-list',
  imports: [],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css'
})
export class EmailListComponent {

  currentEmail: Email = {
    id: 0,
    sender: "",
    receiver: "",
    object: "",
    body: "",
    emailType: EmailType.USER
  }

  startPages: Array<number> = [];
  dots: Array<string> = [];
  endPages: Array<number> = [];
  stringLength: number = 30;

  constructor(private service: EmailService){

    this.service.numberOfPagesSubject.subscribe(pageNumber =>{
      if(pageNumber < 7){
        for(let i = 0; i < pageNumber; i++){
          this.startPages.push(i);
        }
      }
      else{
        for(let i = 0; i < 3; i++){
          this.startPages.push(i);
        }
        for(let i = 0; i < 3; i++){
          this.dots.push('.');
        }
        for(let i = 1; i <= 3; i++){
          this.endPages.push(pageNumber - i);
          this.endPages.sort((a, b) => a - b);
        }
      }
    });

    this.service.currentEmailSubject.subscribe(email =>{
      this.currentEmail = email;
    });

    this.service.getNumberOfPages();
  }

  get emailList(){
    return this.service.emailList;
  }

  setPage(page: number){
    console.log(page);
    this.service.setPage(page);
  }

  previousPage(){
    this.service.previousPage();
  }

  nextPage(){
    this.service.nextPage();
  }
  
  resendEmail(index: number){
    console.log("resend");
    this.service.resendEmail(index);
  }

  openModal(index: number){
    this.service.openModal(index);
  }
}
