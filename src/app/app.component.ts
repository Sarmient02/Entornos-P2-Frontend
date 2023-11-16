import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LayoutComponent } from './modules/shared/components/layout/layout.component';


@Component({
    selector: 'app-root',
    template: `
    <app-layout></app-layout>
    <main >
        <router-outlet></router-outlet>
    </main>
    `,
    standalone: true,
    imports: [RouterOutlet, CommonModule, LayoutComponent]
})
export class AppComponent {}
