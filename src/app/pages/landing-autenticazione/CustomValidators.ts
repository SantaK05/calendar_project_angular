import { AbstractControl, AsyncValidatorFn, ValidationErrors, ValidatorFn } from "@angular/forms";
import { RegisterService } from "./register.service";
import { catchError, map, Observable, of, throwError } from "rxjs";
import { HttpErrorResponse } from "@angular/common/http";
import { MessageService } from "./message.service";

export class CustomValidators {
    static containsLowerCase(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const value = control.value || '';
            return /[a-z]/.test(value) ? null : { containsLowerCase: true };
        };
    }

    // Deve contenere almeno una lettera maiuscola
    static containsUpperCase(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const value = control.value || '';
            return /[A-Z]/.test(value) ? null : { containsUpperCase: true };
        };
    }

    static containsNumber(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const value = control.value || '';
            return /\d/.test(value) ? null : { containsNumber: true };
        };
    }

    // Deve contenere almeno un carattere speciale
    static containsSpecialCharacter(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const value = control.value || '';
            return /[!@#$%^&*(),.?":{}|<>]/.test(value) ? null : { containsSpecialCharacter: true };
        };
    }

    static passwordMatchValidator(passwordKey: string, confirmPasswordKey: string): ValidatorFn {
        return (formGroup: AbstractControl): ValidationErrors | null => {
            const password = formGroup.get(passwordKey)?.value;
            const confirmPassword = formGroup.get(confirmPasswordKey)?.value;

            // Controlla se i campi corrispondono
            return (password && password.length > 0 && password == confirmPassword) ? null : { samePassword: true };
        };
    }

    static checkEmailExists(service: RegisterService, messageService: MessageService): AsyncValidatorFn {
        return (control: AbstractControl): Observable<ValidationErrors | null> => {
            console.log(`check email exists ${control.value}`);
            const value = control.value;
            if (!value) {
                return of(null);
            }
            return service.checkEmailExists(value).pipe(
                map((response: any) => response ? { emailExists: true } : null),
                catchError((e) => {
                    if (e.status === 404) {
                        return of(null)
                    }
                    messageService.publishError("Errore interno, riprovare più tardi");
                    return of({ serverError: true });
                }),
            );
        };
    }

    static checkUsernameExists(service: RegisterService, messageService: MessageService): AsyncValidatorFn {
        return (control: AbstractControl): Observable<ValidationErrors | null> => {
            console.log(`check username exists ${control.value}`);
            const value = control.value;
            if (!value) {
                return of(null);
            }
            return service.checkUsernameExists(value).pipe(
                map((response: any) => response ? { usernameExists: true } : null),
                catchError((e) => {
                    if (e.status === 404) {
                        return of(null)
                    }
                    messageService.publishError("Errore interno, riprovare più tardi");
                    return of({ serverError: true });
                }),
            );
        };
    }

}