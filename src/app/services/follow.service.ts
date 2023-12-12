import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FollowService {

  private options = {
    withCredentials: true // Asegúrate de incluir las credenciales en la solicitud
  };

  private API_URL = 'http://localhost:8080/api';

  private http = inject(HttpClient);

  constructor() { }

  follow(idUser: string, idFollowed: string){
    const url = `${this.API_URL}/user/follow?idUser=${idUser}&idFollowed=${idFollowed}`;
    console.log(url)
    return this.http.post<any>(url, this.options)
  }

  unfollow(idUser: string, idFollowed: string){
    const url = `${this.API_URL}/user/unfollow?idUser=${idUser}&idFollowed=${idFollowed}`;
    console.log(url)
    return this.http.post<any>(url, this.options)
  }

  isFollowing(idUser: string, idFollowed: string){
    const url = `${this.API_URL}/user/checkFollow?idUser=${idUser}&idFollowed=${idFollowed}`;
    console.log(url)
    return this.http.get<any>(url, this.options)
  }


}
