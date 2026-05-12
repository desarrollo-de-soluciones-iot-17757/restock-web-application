import { Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-top-bar',
  standalone: true,
  imports: [MatIconModule, MatButtonModule],
  templateUrl: './top-bar.html',
  styleUrl: './top-bar.css',
})
export class TopBar {
  userName = input<string>('User');
  userAvatarUrl = input<string | null>(null);
  searchPlaceholder = input<string>('Search...');
}