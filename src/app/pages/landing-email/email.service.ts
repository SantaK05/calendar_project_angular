import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Email } from './interfaces/email';
import { EmailType } from './enums/email-type';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  numberOfPagesSubject: Subject<number> = new Subject();
  currentEmailSubject: Subject<Email> = new Subject();

  paginazione: number = 0;
  BASE_URL: string = "http://localhost:8081/emails";

  email: Email = {
    id: 1,
    sender: "giavamat@gmail.com",
    receiver: "DanySala8@gmail.com",
    object: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam a metus turpis. Vestibulum tincidunt nisl at ex dapibus porttitor. Vivamus faucibus, sem tempus dapibus efficitur, enim felis mollis ante, eu blandit eros nisi at metus. Pellentesque non interdum enim, et consequat metus. Cras porta dapibus augue aliquam molestie. Proin risus metus, blandit sed placerat sed, auctor a diam. In hac habitasse platea dictumst. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Ut eget porta nisl.",
    body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam a metus turpis. Vestibulum tincidunt nisl at ex dapibus porttitor. Vivamus faucibus, sem tempus dapibus efficitur, enim felis mollis ante, eu blandit eros nisi at metus. Pellentesque non interdum enim, et consequat metus. Cras porta dapibus augue aliquam molestie. Proin risus metus, blandit sed placerat sed, auctor a diam. In hac habitasse platea dictumst. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Ut eget porta nisl.",
    emailType: EmailType.USER
  }

  emailList: Array<Email> = [];

  constructor(private client: HttpClient) {

    //this.getPage();

    this.emailList.push(structuredClone(this.email));
    this.email.id++;
    this.emailList.push(structuredClone(this.email));
    this.email.id++;
    this.emailList.push(structuredClone(this.email));
    this.email.id++;
    this.email.emailType = EmailType.FORGOT_PASSWORD;
    this.emailList.push(structuredClone(this.email));
    this.email.id++;
    this.email.emailType = EmailType.FORGOT_PASSWORD;
    this.emailList.push(structuredClone(this.email));
    this.email.id++;
    this.email.emailType = EmailType.VERIFY;
    this.emailList.push(structuredClone(this.email));
    this.email.id++;
    this.email.emailType = EmailType.ACCESS;
    this.emailList.push(structuredClone(this.email));
    this.email.id++;
    this.email.emailType = EmailType.ACCESS;
    this.emailList.push(structuredClone(this.email));
    this.email.id++;
    this.email.emailType = EmailType.VERIFY;
    this.emailList.push(structuredClone(this.email));
    this.email.id++;
    this.email.emailType = EmailType.VERIFY;
    this.emailList.push(structuredClone(this.email));
  }

  nextPage(){
    this.paginazione++;
    this.getPage();
  }

  previousPage(){
    this.paginazione--;
    this.getPage();
  }

  setPage(index: number){
    this.paginazione = index;
    //this.getPage();
  }

  getPage(){
    this.client.get<Array<Email>>(`${this.BASE_URL}/${this.paginazione}`).subscribe(response => {
      this.emailList = response;
    });
  }

  resendEmail(index: number){
    this.client.put(`${this.BASE_URL}/resend/${index}`, {}).subscribe();
  }

  getNumberOfPages(){
    this.numberOfPagesSubject.next(50);
    // this.client.get<number>(`${this.BASE_URL}/${this.paginazione}`).subscribe(response => {
    //    this.numberOfPagesSubject.next(response);
    // });
  }

  openModal(index: number){
    this.currentEmailSubject.next(this.emailList[index]);
  }
}
