import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Post, updatePost } from '../models/post.model';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  private options = {
    withCredentials: true // Asegúrate de incluir las credenciales en la solicitud
  };

  private API_URL = 'http://localhost:8080/api';

  private http = inject(HttpClient);

  constructor() { }

  getAllPosts(){
    const url = `${this.API_URL}/post/all`;
    console.log(url)
    return this.http.get<Post[]>(url, this.options)
  }

  getPost(id: string){
    const url = `${this.API_URL}/post/${id}`;
    console.log(url)
    return this.http.get<any>(url, this.options)
  }

  updatePost(post: updatePost){
    const url = `${this.API_URL}/post`;
    console.log(url)
    return this.http.put<any>(url, post, this.options)
  }
}
