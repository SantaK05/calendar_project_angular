import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from '@angular/router';
import { catchError, Observable, throwError } from "rxjs";

@Injectable()
export class Interceptor implements HttpInterceptor {
  private excludedPaths: string[] = ['/auth/', '/backoffice/users'];

  constructor(private router: Router) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Controlla se il path deve essere escluso
    if (this.shouldExclude(request.url)) {
      return next.handle(request); // Lascia passare senza aggiungere l'header
    }

    // Aggiungi il token alle richieste non escluse
    const token = localStorage.getItem('jwt');
    console.log(`token: ${token}`);

    if (token) {
      request = request.clone({
        setHeaders: { 'Authorization': `Bearer ${token}` }
      });
    }

    return next.handle(request).pipe(
      catchError((err) => {
        if (err instanceof HttpErrorResponse) {
          if (err.status === 401) {
            console.warn('Token scaduto. Rimuovo il token e reindirizzo al login.');

            // Rimuove il token scaduto da localStorage
            localStorage.removeItem('jwt');

            // Reindirizza l'utente alla pagina di login
            this.router.navigate(['/login']);
          }
        }
        return throwError(()=>err);
      })
    );
  }

  // Funzione per controllare se il path è escluso
  private shouldExclude(url: string): boolean {
    return this.excludedPaths.some(path => url.includes(path));
  }
}
