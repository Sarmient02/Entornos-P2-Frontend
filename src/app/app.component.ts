import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LayoutComponent } from './modules/shared/components/layout/layout.component';
import { HttpClientModule } from '@angular/common/http';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';


@Component({
    selector: 'app-root',
    template: `
    <app-layout></app-layout>
    <p-toast [breakpoints]="{'920px': {width: '100%', right: '0', left: '0'}}"></p-toast>
    <p-toast [breakpoints]="{'920px': {width: '100%', right: '0', left: '0'}}" position="top-left" key="tl"></p-toast>
    <p-toast [breakpoints]="{'920px': {width: '100%', right: '0', left: '0'}}" position="top-center" key="tc"></p-toast>
    <p-toast [breakpoints]="{'920px': {width: '100%', right: '0', left: '0'}}" position="bottom-center" key="bc"></p-toast>
    <p-toast [breakpoints]="{'920px': {width: '100%', right: '0', left: '0'}}" position="bottom-right" key="br"></p-toast>
    <p-toast [breakpoints]="{'920px': {width: '100%', right: '0', left: '0'}}" position="bottom-left" key="bl"></p-toast>
    <main>
        <router-outlet></router-outlet>
    </main>
    `,
    standalone: true,
    imports: [RouterOutlet, CommonModule, LayoutComponent, HttpClientModule, ToastModule],
    providers: [MessageService]
})
export class AppComponent {
    constructor(
        private messageService: MessageService
    ) { }
}
