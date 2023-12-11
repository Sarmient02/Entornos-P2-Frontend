import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Subject } from '../models/subject.model';


@Injectable({
  providedIn: 'root'
})
export class SubjectService {

  private options = {
    withCredentials: true // Asegúrate de incluir las credenciales en la solicitud
  };

  private API_URL = 'http://localhost:8080/api';

  private http = inject(HttpClient);

  constructor() { }

  getSubjectsByCareerId(careerId: number) {
    const url = `${this.API_URL}/post/subjects?careerId=${careerId}`;
    return this.http.get<Subject[]>(url, this.options)
  }
}
