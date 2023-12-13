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
import { FormBuilder, FormControl, ReactiveFormsModule, Validators, FormArray, FormsModule} from '@angular/forms';
import { MessagesModule } from 'primeng/messages';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MultiSelectModule } from 'primeng/multiselect';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { FileP } from 'src/app/models/file.model';
import { DropdownModule } from 'primeng/dropdown';
import { CareerService } from 'src/app/services/career.service';
import { Career } from 'src/app/models/career.model';
import { Subject } from 'src/app/models/subject.model';
import { SubjectService } from 'src/app/services/subject.service';


@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [CommonModule, RouterModule, TagModule, AvatarModule, FileUploadModule, MimetypePipe, SplitButtonModule, SkeletonModule,
    ReactiveFormsModule, RouterModule, InputTextModule, ButtonModule, ToastModule, MultiSelectModule, ProgressSpinnerModule, InputTextareaModule, DropdownModule, FormsModule],
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent {

  careers!: Career[];

  subjects!: Subject[];

  post!: Post;

  newPost!: updatePost;

  selectedCareer!: Career;

  idPost = this.route.snapshot.params['id'];

  loading = true;

  private messageService = inject(MessageService);

  oldFiles: FileP[] = [];

  files: File[] = [];

  constructor(
    private route: ActivatedRoute,
    private postService: PostService,
    private fileService: FileService,
    private router: Router,
    private careerService: CareerService,
    private subjectService: SubjectService
  ) {
  }

  private fb = inject(FormBuilder);

  form = this.fb.group({
    id: [''],
    title: ['', [Validators.required, Validators.minLength(3)]],
    description: ['', [Validators.minLength(3)]],
    subjectId: [new FormControl(), [Validators.required]],
    selectedCareer: new FormControl()
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
  }

  getPost(id: string) {
    this.postService.getPost(id)
      .subscribe({
        next: (data) => {
          this.post = data;
          console.log(data)
          
          this.careers = this.getCareers();
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

  getCareers() {
    this.careerService.getCareers()
      .subscribe({
        next: (data) => {
          this.careers = data;
          this.selectedCareer = this.careers.find(career => career.id === this.post.subject.careerId)!;
        },
        error: (e) => {
          console.log(e)
          this.messageService.add({ severity: 'error', summary: 'Error', detail: e.error.message });
        }
      });
    return this.careers;
  }

  downloadFile(hashName: string) {
    const fileUrl = this.fileService.downloadFile(hashName);
    window.open(fileUrl, '_blank');
  }

  setPost(post: updatePost) {

    this.getSubjectsByCareerId(this.post.subject.careerId);

    this.form.setValue({
      id: this.post.id.toString(),
      title: post.title,
      description: post.description,
      subjectId: this.post.subject.id,
      selectedCareer: this.post.subject.careerId
    });

    

  }

  getSubjectsByCareerId(careerId: number) {
    this.subjectService.getSubjectsByCareerId(careerId)
      .subscribe({
        next: (data) => {
          this.subjects = data;
          this.loading = false;
        },
        error: (e) => {
          console.log(e)
          this.messageService.add({ severity: 'error', summary: 'Error', detail: e.error.message });
        }
      });
  }

  onCareerChange(event: any) {
    const selectedCareerId = event.value; // Obtener el id de la carrera seleccionada
    this.getSubjectsByCareerId(selectedCareerId); // Cargar los subjects correspondientes a la carrera seleccionada
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
          }, 2000);
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
          next: (data: any) => {
            console.log(data)
            this.messageService.add({ severity: 'success', summary: 'Archivo subido', detail: data.message });
          },
          error: (e) => {
            console.log(e.error)
            this.messageService.add({ severity: 'error', summary: 'Error', detail: e.error.message });
          }
        });
      });
    }

}
