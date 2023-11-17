import { Router } from "@angular/router";
import { TokenService } from "../services/token.service";
import { inject } from "@angular/core";
import { StorageService } from "../services/storage.service";

export const adminGuard = () => {
    const tokenService = inject(TokenService);
    const router = inject(Router);
    const storageService = inject(StorageService);

    const token = tokenService.getToken();
    const user = storageService.getUser();
    if (token && user.roles.includes('ROLE_ADMIN')) {
        return true;
    }
    
    alert('¡No eres Administrador!');
    router.navigate(['/home']);
    return false;
}