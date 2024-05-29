import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AuthService } from "./auth.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private authService: AuthService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token = this.authService.getJwtResponseValue().accessToken;

        if (token) {
            const clonedRequest = req.clone({
                headers: req.headers.set('Authorization', `Bearer ${token}`)
            });
            console.log('Cloned Request:', clonedRequest); 
            return next.handle(clonedRequest);
        } else {
            return next.handle(req);
        }
    }
}