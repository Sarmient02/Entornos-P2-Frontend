import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { newUser } from '../models/user.model';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private options = {
    withCredentials: true // Asegúrate de incluir las credenciales en la solicitud
  };

  private API_URL = 'http://localhost:8080/api';

  private http = inject(HttpClient);

  constructor() { }

  getAllUsers(){
    const url = `${this.API_URL}/user/all`;
    console.log(url)
    return this.http.get<any>(url, this.options)
  }

  getUserById(id: number){
    const url = `${this.API_URL}/user/`+id;
    return this.http.get<any>(url, this.options)
  }

  newUser(newUser: newUser){
    const url = `${this.API_URL}/user/new`;
    return this.http.post<any>(url,newUser, this.options);
  }

  updateUser(newUser: newUser){
    const url = `${this.API_URL}/user`;
    return this.http.put<any>(url, newUser, this.options);
  }

  deleteUser(User: User){
    const url = `${this.API_URL}/user/`;
    return this.http.delete<any>(url+User.id);
  }
}
