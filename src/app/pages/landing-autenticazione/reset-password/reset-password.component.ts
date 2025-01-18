import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CustomValidators } from '../CustomValidators';
import { MessageService } from '../message.service';
import { HttpClient } from '@angular/common/http';
import { catchError, tap, throwError } from 'rxjs';

@Component({
  selector: 'app-forgot-password',
  imports: [RouterModule, ReactiveFormsModule,FormsModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent implements OnInit {

  password="";

  uuid=""
  constructor(private formBuilder: FormBuilder,private activatedRoute: ActivatedRoute,private messageService:MessageService,private client:HttpClient,private router:Router) {
    let id = this.activatedRoute.snapshot.paramMap.get('uuid');
    if(id==null){
      messageService.publishError("Link non valido");
    }else{
      this.uuid=id;
    }
  }

  ngOnInit(): void {

    this.form = this.formBuilder.group({
      password: ['', [Validators.compose([
        Validators.required,
        Validators.minLength(8),
        CustomValidators.containsLowerCase(),
        CustomValidators.containsUpperCase(),
        CustomValidators.containsSpecialCharacter()
      ])]],
      confirmPassword: ['', [Validators.required]]
    },
      { validators: CustomValidators.passwordMatchValidator('password', 'confirmPassword') }
    )

  }

  form!: FormGroup;

  get passwordErrors() {
    return this.form.get('password')?.errors;
  }

  get formErrors() {
    return this.form.errors;
  }

  confirm() {
    this.client.post("http://localhost:8080/forgotpassword/"+this.uuid,{password:this.password}).pipe(
      catchError((err)=>{
        if(err.status==401){
          this.messageService.publishError("Link scaduto, ripeti la procedura di recupero password");
          this.router.navigateByUrl("/login");
        }else{
          this.messageService.publishError("Problema interno, riprova più tardi");
        }
        return throwError(()=>err);
      }),
      tap(()=>{
        this.messageService.publishInfo("Password cambiata con successo");
        this.router.navigateByUrl("/login");
      })
    ).subscribe();
  }
}
