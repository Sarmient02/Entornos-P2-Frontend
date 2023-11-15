import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-root',
    template: `<router-outlet></router-outlet>`,
    standalone: true,
    imports: [RouterOutlet, CommonModule]
})
export class AppComponent {}
