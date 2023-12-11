import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Career } from '../models/career.model';

@Injectable({
  providedIn: 'root'
})
export class CareerService {

  private options = {
    withCredentials: true // Asegúrate de incluir las credenciales en la solicitud
  };

  private API_URL = 'http://localhost:8080/api';

  private http = inject(HttpClient);

  constructor() { }

  getCareers() {
    const url = `${this.API_URL}/post/careers`;
    return this.http.get<Career[]>(url, this.options)
  }
}
