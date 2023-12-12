import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Comment, newComment } from '../models/comment.model';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  private options = {
    withCredentials: true // Asegúrate de incluir las credenciales en la solicitud
  };

  private API_URL = 'http://localhost:8080/api';

  private http = inject(HttpClient);

  constructor() { }

  getAllComments(idPost: string){
    const url = `${this.API_URL}/post/comments?postId=${idPost}`;
    console.log(url)
    return this.http.get<Comment[]>(url, this.options)
  }

  createComment(comment: newComment){
    const url = `${this.API_URL}/post/comments-new`;
    console.log(url)
    return this.http.post<any>(url, comment, this.options)
  }

  deleteComment(id: string){
    const url = `${this.API_URL}/post/comments-delete?commentId=${id}`;
    console.log(url)
    return this.http.delete<any>(url, this.options)
  }

}
