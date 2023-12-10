import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  private options = {
    withCredentials: true // Asegúrate de incluir las credenciales en la solicitud
  };

  private API_URL = 'http://localhost:8080/api';

  private http = inject(HttpClient);

  constructor() { }

  getPreviewFiles(hashName: string){
    const url = `${this.API_URL}/file/preview/${hashName}`;
    console.log(url)
    return this.http.get(url, { responseType: 'blob', withCredentials: true })
  }

  getPreviewUrl(hashName: string){
    const url = `${this.API_URL}/file/preview/${hashName}`;
    return url;
  }

  downloadFile(hashName: string){
    const url = `${this.API_URL}/file/download/${hashName}`;
    console.log(url)
    return url;
  }

  uploadFile(file: FormData, postId: number){
    const url = `${this.API_URL}/file/upload/${postId}`;
    return this.http.post(url, file, this.options)
  }

}
