import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileBeforeUploadEvent, FileSelectEvent, FileUploadModule } from 'primeng/fileupload';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TagModule } from 'primeng/tag';
import { AvatarModule } from 'primeng/avatar';
import { MimetypePipe } from 'src/app/pipes/mimetype.pipe';
import { SplitButtonModule } from 'primeng/splitbutton';
import { SkeletonModule } from 'primeng/skeleton';
import { Post, updatePost } from 'src/app/models/post.model';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { PostService } from 'src/app/services/post.service';
import { FileService } from 'src/app/services/file.service';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators, FormArray} from '@angular/forms';
import { MessagesModule } from 'primeng/messages';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MultiSelectModule } from 'primeng/multiselect';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { FileP } from 'src/app/models/file.model';


@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [CommonModule, RouterModule, TagModule, AvatarModule, FileUploadModule, MimetypePipe, SplitButtonModule, SkeletonModule,
    ReactiveFormsModule, RouterModule, InputTextModule, ButtonModule, ToastModule, MultiSelectModule, ProgressSpinnerModule, InputTextareaModule],
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent {


  post!: Post;

  newPost!: updatePost;

  idPost = this.route.snapshot.params['id'];

  loading = true;

  private messageService = inject(MessageService);

  oldFiles: FileP[] = [];

  files: File[] = [];

  constructor(
    private route: ActivatedRoute,
    private postService: PostService,
    private fileService: FileService,
    private router: Router
  ) {
  }

  private fb = inject(FormBuilder);

  form = this.fb.group({
    id: [''],
    title: ['', [Validators.required, Validators.minLength(3)]],
    description: ['', [Validators.minLength(3)]],
    subjectId: ['', [Validators.required]]
  });

  ngOnInit() {
    this.getPost(this.idPost);
  }

  deleteFromOldFiles(id: number) {
    this.oldFiles = this.oldFiles.filter(file => file.id !== id);
    this.post.files = this.oldFiles;
    this.newPost.files = this.oldFiles.map(file => file.hashName);
  }


  beforeSave(event: FileSelectEvent) {
    console.log(event.currentFiles)
    this.files = event.currentFiles;
    const formData = new FormData();
    formData.append('file', this.files[0]);
    
    this.messageService.add({severity: 'info', summary: 'File Uploaded', detail: ''});
  }

  getPost(id: string) {
    this.postService.getPost(id)
      .subscribe({
        next: (data) => {
          this.post = data;
          console.log(data)
          this.loading = false;
          this.setPost(data);
          this.oldFiles = data.files;
          this.newPost = {...data};
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

  setPost(post: updatePost) {

    this.form.setValue({
      id: this.post.id.toString(),
      title: post.title,
      description: post.description,
      subjectId: '1'
    });

  }

  onSubmit(): void {
    if(this.form.valid) {
      const { title, description, subjectId } = this.form.getRawValue();
      if (!title || !description || !subjectId) {
        return;
      }
      
      this.newPost = Object.assign(this.newPost, this.form.value);
      if (this.post.files) {
        this.newPost.files = this.post.files.map(file => file.hashName);
      }
      console.log("new post")
      console.log(this.newPost)
      this.postService.updatePost(this.newPost)
      .subscribe({
        next: () => {
          this.messageService.add({ key:'br', severity: 'info', summary: 'Correcto', detail: 'Usuario editado correctamente' });
          this.uploadFiles();
          setTimeout(() => {
            this.form.reset();
            this.router.navigate(['/posts/view/', this.post.id]);
          }, 1000);
        },
        error: () => {
          this.messageService.add({severity:'error'});
        }
      });
    } else {
      this.form.markAllAsTouched();
    }
    }

    uploadFiles() {
      this.loading = true;
      this.files.forEach(file => {
        const formData = new FormData();
        formData.append('file', file);
        this.fileService.uploadFile(formData, this.post.id).subscribe({
          next: (data) => {
            console.log(data)
          },
          error: (e) => {
            console.log(e.error)
            this.messageService.add({ severity: 'error', summary: 'Error', detail: e.error.message });
          }
        });
      });
    }

}
