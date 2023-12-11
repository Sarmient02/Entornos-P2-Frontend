import { ActivatedRoute, ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from "@angular/router";
import { TokenService } from "../services/token.service";
import { inject, ɵsetAlternateWeakRefImpl } from "@angular/core";
import { StorageService } from "../services/storage.service";
import { PostService } from "../services/post.service";

export const authorGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const storageService = inject(StorageService);
    const user = storageService.getUser();
    const router = inject(Router);

    const postService = inject(PostService);

    const idPost = route.params['id'];

    return postService.getPost(idPost).toPromise().then((post) => {
        if (user.id === post.user.id) {
          return true; // El usuario es el autor del post, permite el acceso
        } else {
          // El usuario no es el autor del post, redirige a otra página (por ejemplo, la página de inicio)
          alert('¡No eres el autor de este post!');
          router.navigate(['/posts']); // Reemplaza '/' con la ruta a la que deseas redirigir
          return false;
        }
      }).catch(() => {
        // Error al obtener el post, redirige a otra página (por ejemplo, la página de inicio)
        router.navigate(['/posts']); // Reemplaza '/' con la ruta a la que deseas redirigir
        return false;
      });

    return true;
  }