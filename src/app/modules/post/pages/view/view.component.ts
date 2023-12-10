import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TagModule } from 'primeng/tag';
import { AvatarModule } from 'primeng/avatar';
import { FileUploadModule } from 'primeng/fileupload';
import { MimetypePipe } from 'src/app/pipes/mimetype.pipe';
import { SplitButtonModule } from 'primeng/splitbutton';
import { MenuItem, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PreviewComponent } from '../../components/preview/preview.component';
import { Post } from 'src/app/models/post.model';
import { PostService } from 'src/app/services/post.service';
import { FileP } from 'src/app/models/file.model';
import { FileService } from 'src/app/services/file.service';
import { SkeletonModule } from 'primeng/skeleton';


@Component({
  selector: 'app-view',
  standalone: true,
  imports: [CommonModule, RouterModule, TagModule, AvatarModule, FileUploadModule, MimetypePipe, SplitButtonModule, SkeletonModule],
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss'],
  providers: [DialogService]
})
export class ViewComponent {

  ref: DynamicDialogRef | undefined;

  post!: Post;

  idPost = this.route.snapshot.params['id'];

  loading = true;

  private messageService = inject(MessageService);

  constructor(
    private route: ActivatedRoute,
    public dialogService: DialogService,
    private postService: PostService,
    private fileService: FileService,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.getPost(this.idPost);
  }

  getPost(id: string) {
    this.postService.getPost(id)
      .subscribe({
        next: (data) => {
          this.post = data;
          console.log(data)
          this.loading = false;
        },
        error: (e) => {
          console.log(e)
          this.messageService.add({ severity: 'error', summary: 'Error', detail: e.error.message });
          this.router.navigate(['/posts']);
        }
      });
  }

  downloadFile(hashName: string) {
    const fileUrl = this.fileService.downloadFile(hashName);
    window.open(fileUrl, '_blank');
  }


  show(file: FileP) {
    this.ref = this.dialogService.open(PreviewComponent, {
        header: 'Previsualizar archivo',
        width: '70%',
        contentStyle: { overflow: 'auto' },
        baseZIndex: 10000,
        maximizable: true,
        data: {
          hashName: file.hashName,
          type: file.type
        }
    });

    this.ref.onClose.subscribe((product: any) => {
    });

    this.ref.onMaximize.subscribe((value) => {
    });
}

  

}
