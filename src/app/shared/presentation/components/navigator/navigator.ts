import { Component, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { NavItem } from './nav-item.model';

@Component({
  selector: 'app-navigator',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, MatIconModule],
  templateUrl: './navigator.html',
  styleUrl: './navigator.css',
})
export class Navigator {
  navItems = input<NavItem[]>([]);
}