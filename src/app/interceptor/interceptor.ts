import { HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { LoginService } from "../pages/landing-autenticazione/login.service";

@Injectable()
export class Interceptor implements HttpInterceptor {

  constructor(private loginService: LoginService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    console.log("richiesta intercettata");
    this.loginService.checkTokenIsExpired();

    const authToken = localStorage.getItem("jwt");
    console.log("scrivendo token: " + authToken);

    const authReq = req.clone({ setHeaders: { Authorization: `Bearer ${authToken}` } });

    return next.handle(authReq);
  }
}