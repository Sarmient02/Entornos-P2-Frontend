import { Component, Input, Optional } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { FileService } from 'src/app/services/file.service';
import { HttpClient } from '@angular/common/http';
import { NgxExtendedPdfViewerModule, pdfDefaultOptions } from 'ngx-extended-pdf-viewer';
import { ImageModule } from 'primeng/image';


@Component({
  selector: 'app-preview',
  standalone: true,
  imports: [CommonModule, NgxDocViewerModule, PdfViewerModule, NgxExtendedPdfViewerModule, ImageModule],
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss']
})
export class PreviewComponent {

  public src!: Blob;

  hashName!: string;

  url!: string;

  type!: string;

  pdf = false;

  constructor(
    private fileService: FileService,
    public ref: DynamicDialogRef,
    @Optional() private config: DynamicDialogConfig
  ) {
    this.hashName = this.config.data.hashName;
    this.type = this.config.data.type;
    if (this.hashName && this.type) {
      if (this.type.includes('image')) {
        this.url = this.fileService.getPreviewUrl(this.hashName);
      }else if(this.type.includes('pdf')){
        this.loadFile();
      }
    }
  }

  public loadFile(): void {
    this.pdf = true
    this.fileService.getPreviewFiles(this.hashName).subscribe((response: any) => {
      this.src = response;
    });
  }

}
