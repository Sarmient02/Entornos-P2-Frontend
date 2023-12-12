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
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FollowService } from 'src/app/services/follow.service';
import { CommentService } from 'src/app/services/comment.service';
import { Comment, newComment } from 'src/app/models/comment.model';
import { CardModule } from 'primeng/card';
import { RatingModule, RatingRateEvent } from 'primeng/rating';
import { DividerModule } from 'primeng/divider';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputText, InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';



@Component({
  selector: 'app-view',
  standalone: true,
  imports: [CommonModule, RouterModule, TagModule, AvatarModule, FileUploadModule, MimetypePipe, SplitButtonModule,
            SkeletonModule, BadgeModule, ButtonModule, CardModule, RatingModule, DividerModule, InputTextareaModule, ReactiveFormsModule, FormsModule
  ],
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss'],
  providers: [DialogService, BrowserAnimationsModule]
})
export class ViewComponent {

  private fb = inject(FormBuilder);

  private comment: newComment = {} as newComment;

  followed = {
    "backgroundColor": "#007bff",
    "color": "#fff"
  }

  following = false;

  unfollowed = {
    "backgroundColor": "#fff",
    "color": "#007bff"
  }

  form = this.fb.group({
    id: ['0'],
    body: ['', [Validators.required, Validators.minLength(3)]],
    postId: [new FormControl()],
    idUser: [new FormControl()],
    score: ['']
  });

  comments!: Comment[];

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
    private router: Router,
    private followService: FollowService,
    private commentService: CommentService
  ) {
  }

  ngOnInit() {
    this.getPost(this.idPost);
    this.checkFollow();
  }

  getPost(id: string) {
    this.postService.getPost(id)
      .subscribe({
        next: (data) => {
          this.post = data;
          console.log(data)
          this.checkFollow();
          
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

  deletePost() {
    this.postService.deletePost(this.post.id.toString())
    .subscribe({
      next: () => {
        this.messageService.add({severity:'info', summary: 'Post eliminado', detail: 'El post ha sido eliminado correctamente'});
        this.router.navigate(['/posts']);
      },
      error: (e) => {
        console.log(e)
        this.messageService.add({ severity: 'error', summary: 'Error', detail: e.error.message });
      }
    });
  }

  ifUserIsAuthor() {
    if (!sessionStorage.getItem('user')) return false;
    return this.post.user.id === JSON.parse(sessionStorage.getItem('user')!).id;
  }

  ifUserIsCommentAuthor(id: number) {
    if (!sessionStorage.getItem('user')) return false;
    return id === JSON.parse(sessionStorage.getItem('user')!).id;
  }

  followOrUnfollow() {
    if(this.following) this.unfollow();
    else this.follow();
  }

  follow() {
      if(!this.ifUserIsAuthor()){
        this.followService.follow(JSON.parse(sessionStorage.getItem('user')!).id.toString(), this.post.user.id.toString())
        .subscribe({
          next: () => {
            this.following = true;
          },
          error: (e) => {
            console.log(e)
            this.messageService.add({ severity: 'error', summary: 'Error', detail: e.error.message });
          }
        });
      }
  }

  unfollow() {
    if(!this.ifUserIsAuthor()){
      this.followService.unfollow(JSON.parse(sessionStorage.getItem('user')!).id.toString(), this.post.user.id.toString())
      .subscribe({
        next: () => {
          this.following = false;
        },
        error: (e) => {
          console.log(e)
          this.messageService.add({ severity: 'error', summary: 'Error', detail: e.error.message });
        }
      });
    }
  }

  getFollowStyle() {
    if(this.following) return this.followed;
    return this.unfollowed;
  }

  checkFollow() {
    if(!this.ifUserIsAuthor()){
      this.followService.isFollowing(JSON.parse(sessionStorage.getItem('user')!).id.toString(), this.post.user.id.toString())
      .subscribe({
        next: (data) => {
          this.following = data;
        },
        error: (e) => {
          console.log(e)
          this.messageService.add({ severity: 'error', summary: 'Error', detail: e.error.message });
        }
      });
    }
    this.getComments();
  }

  getComments() {
    this.commentService.getAllComments(this.post.id.toString())
    .subscribe({
      next: (data) => {
        this.comments = data;
        this.loading = false;
        console.log(this.comments)
      },
      error: (e) => {
        console.log(e)
        this.messageService.add({ severity: 'error', summary: 'Error', detail: e.error.message });
      }
    });
  }

  onSubmit(): void {
    console.log("aaaaaaa")
    console.log(this.form)
    this.setForm();
    console.log(this.form)
    if(this.form.valid) {
      const { body, postId, idUser, score } = this.form.getRawValue();
      if (!body || !postId || !idUser) {
        return;
      }
      this.comment = Object.assign(this.comment, this.form.value);
      console.log("new comment")
      console.log(this.comment)
      this.commentService.createComment(this.comment)
      .subscribe({
        next: (data) => {
          this.messageService.add({ key:'br', severity: 'info', summary: 'Correcto', detail: 'Comentario creado exitosamente' });
          this.getComments();
          this.form.reset();
          this.setForm();
        },
        error: () => {
          this.messageService.add({severity:'error', summary: 'Error', detail: 'Error al crear el comentario'});
        }
      });
    } else {
      this.form.markAllAsTouched();
    }
    }
  

    setRate(evento: RatingRateEvent){
      this.form.value.score = evento.value.toString();
      console.log(this.form.value.score)
    }

    setForm(){
      this.form.value.postId = this.post.id;
      this.form.value.idUser = JSON.parse(sessionStorage.getItem('user')!).id;
      this.form.value.id = '0';
      this.comment = {} as newComment;
    }

    deleteComment(id: string) {
      this.commentService.deleteComment(id)
      .subscribe({
        next: (data) => {
          this.messageService.add({ key:'br', severity: 'info', summary: 'Correcto', detail: 'Comentario eliminado exitosamente' });
          this.getComments();
        },
        error: () => {
          this.messageService.add({severity:'error', summary: 'Error', detail: 'Error al eliminar el comentario'});
        }
      });
    }
      
}
