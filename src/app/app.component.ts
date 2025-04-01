import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenuComponent } from './components/menu/menu.component';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './components/profile/profile.component';

@Component({
  selector: 'app-root',
  imports: [MenuComponent, CommonModule, ProfileComponent], 
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'maeski';
}
