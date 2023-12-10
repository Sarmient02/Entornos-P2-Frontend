import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataViewLayoutOptions, DataViewModule } from 'primeng/dataview';
import { RatingModule } from 'primeng/rating';
import { ButtonModule } from 'primeng/button';
import { RouterModule } from '@angular/router';
import { TagModule } from 'primeng/tag';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { Post } from 'src/app/models/post.model';
import { PostService } from 'src/app/services/post.service';
import { SkeletonModule } from 'primeng/skeleton';
import { AvatarModule } from 'primeng/avatar';
import { InputTextModule } from 'primeng/inputtext';
import { TreeModule } from 'primeng/tree';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonModule, DataViewModule, RatingModule, ButtonModule, RouterModule, TagModule, FormsModule, CardModule, SkeletonModule, AvatarModule, InputTextModule, TreeModule],
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  providers: [DataViewLayoutOptions]
})
export class ListComponent {

  loading = true;

  posts!: Post[];

  documentos: any[] = [
    'Documentos'
  ];

  private userService = inject(PostService);

    constructor() {}

    ngOnInit() {
      this.getPosts();
    }

    getPosts() {
      this.userService.getAllPosts()
        .subscribe({
          next: (data) => {
            console.log(data)
            this.posts = data;
            this.loading = false;
          },
          error: () => {
          }
        });
    }
  

}
