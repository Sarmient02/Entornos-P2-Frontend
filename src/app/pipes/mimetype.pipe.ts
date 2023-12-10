import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'mimetype',
  standalone: true
})
export class MimetypePipe implements PipeTransform {

  private iconClasses: { [key: string]: string } = {
    // Media
    image: 'fas fa-file-image',
    audio: 'fas fa-file-audio',
    video: 'fas fa-file-video',
    // Documents
    'application/pdf': 'fas fa-file-pdf',
    'application/msword': 'fas fa-file-word',
    'application/vnd.ms-word': 'fas fa-file-word',
    'application/vnd.oasis.opendocument.text': 'fas fa-file-word',
    'application/vnd.openxmlformats-officedocument.wordprocessingml': 'fas fa-file-word',
    'application/vnd.ms-excel': 'fas fa-file-excel-o',
    'application/vnd.openxmlformats-officedocument.spreadsheetml': 'fas fa-file-excel',
    'application/vnd.oasis.opendocument.spreadsheet': 'fas fa-file-excel',
    'application/vnd.ms-powerpoint': 'fas fa-file-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml': 'fas fa-file-powerpoint',
    'application/vnd.oasis.opendocument.presentation': 'fas fa-file-powerpoint',
    'text/plain': 'fas fa-file-alt',
    'text/html': 'fas fa-file-code',
    'application/json': 'fas fa-file-code',
    // Archives
    'application/gzip': 'fas fa-file-archive',
    'application/zip': 'fas fa-file-archive',
    'application/x-rar-compressed': 'fas fa-file-archive',
  };

  transform(mimeType: string): string {
    // Verifica primero una coincidencia exacta
    if (this.iconClasses[mimeType]) {
      return this.iconClasses[mimeType];
    }
    // Si no hay coincidencia exacta, busca una coincidencia general
    const type = mimeType.split('/')[0];
    if (this.iconClasses[type]) {
      return this.iconClasses[type];
    }
    return 'fas fa-file'; // Icono por defecto
  }
}
