import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileSelectEvent, FileUploadModule } from 'primeng/fileupload';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TagModule } from 'primeng/tag';
import { AvatarModule } from 'primeng/avatar';
import { MimetypePipe } from 'src/app/pipes/mimetype.pipe';
import { SplitButtonModule } from 'primeng/splitbutton';
import { SkeletonModule } from 'primeng/skeleton';
import { Post, newPost, updatePost } from 'src/app/models/post.model';
import { MessageService } from 'primeng/api';
import { PostService } from 'src/app/services/post.service';
import { FileService } from 'src/app/services/file.service';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators, FormsModule} from '@angular/forms';
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
  selector: 'app-new',
  standalone: true,
  imports: [CommonModule, RouterModule, TagModule, AvatarModule, FileUploadModule, MimetypePipe, SplitButtonModule, SkeletonModule,
    ReactiveFormsModule, RouterModule, InputTextModule, ButtonModule, ToastModule, MultiSelectModule, ProgressSpinnerModule, InputTextareaModule, DropdownModule, FormsModule],
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss']
})
export class NewComponent {

  careers!: Career[];

  subjects!: Subject[];

  private post: newPost = {} as newPost;

  postId!: number;

  newPost!: updatePost;

  selectedCareer!: Career;

  private messageService = inject(MessageService);

  oldFiles: FileP[] = [];

  files: File[] = [];

  constructor(
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
    subjectId: ['', [Validators.required]],
    selectedCareer: new FormControl()
  });

  ngOnInit() {
    this.getCareers();
  }

  beforeSave(event: FileSelectEvent) {
    console.log(event.currentFiles)
    this.files = event.currentFiles;
  }

  getCareers() {
    this.careerService.getCareers()
      .subscribe({
        next: (data) => {
          this.careers = data;
        },
        error: (e) => {
          console.log(e)
          this.messageService.add({ severity: 'error', summary: 'Error', detail: e.error.message });
        }
      });
  }

  getSubjectsByCareerId(careerId: number) {
    this.subjectService.getSubjectsByCareerId(careerId)
      .subscribe({
        next: (data) => {
          this.subjects = data;
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
      console.log(this.form)
      this.post = Object.assign(this.post, this.form.value);
      console.log("new post")
      console.log(this.post)
      this.postService.createPost(this.post)
      .subscribe({
        next: (data) => {
          this.messageService.add({ key:'br', severity: 'info', summary: 'Correcto', detail: 'Post creado exitosamente' });
          this.postId = data;
          this.uploadFiles().then(() => {
            // Subidas de archivos completadas
            this.router.navigate(['/posts/view/', this.postId]);
          });
          setTimeout(() => {
            this.form.reset();
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

    async uploadFiles(): Promise<void | undefined> {
      const uploadPromises = this.files.map((file) => {
        const formData = new FormData();
        formData.append('file', file);
        return this.fileService.uploadFile(formData, this.postId).toPromise();
      });
    
      await Promise.all(uploadPromises);
      // All file uploads completed
    }

}
