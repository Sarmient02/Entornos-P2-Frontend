import { Router } from "@angular/router";
import { TokenService } from "../services/token.service";
import { inject } from "@angular/core";
import { StorageService } from "../services/storage.service";

export const loggedGuard = () => {
    const tokenService = inject(TokenService);
    const router = inject(Router);
    const storageService = inject(StorageService);

    const token = tokenService.getToken();
    const user = storageService.getUser();
    if (token && user) {
        alert('Ya tienes la sesión iniciada!');
        router.navigate(['/home']);
        return false;
    }
    return true;
}