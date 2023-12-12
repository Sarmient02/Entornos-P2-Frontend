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

  getAllSubjects(){
    const url = `${this.API_URL}/post/subjects/all`;
    console.log(url)
    return this.http.get<any>(url, this.options)
  }

  getSubjectsByCareerId(careerId: number) {
    const url = `${this.API_URL}/post/subjects?careerId=${careerId}`;
    return this.http.get<Subject[]>(url, this.options)
  }

  getSubjectById(id: number){
    const url = `${this.API_URL}/post/subjects/`+id;
    return this.http.get<any>(url, this.options)
  }

  newSubject(Subject: Subject){
    const url = `${this.API_URL}/post/subjects-new`;
    return this.http.post<any>(url,Subject, this.options);
  }

  updateSubject(Subject: Subject){
    const url = `${this.API_URL}/post/subjects-edit`;
    return this.http.post<any>(url,Subject, this.options);
  }

  deleteSubject(subjectId: number){
    const url = `${this.API_URL}/post/subjects-delete?subjectId=${subjectId}`;
    return this.http.delete<Subject[]>(url, this.options)
  }
}
