import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavItem } from '../navigator/nav-item.model';
import { Navigator } from '../navigator/navigator';
import { TopBar } from '../top-bar/top-bar';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, Navigator, TopBar],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout {
  navItems = signal<NavItem[]>([
    { label: 'Overview', icon: 'grid_view', link: '/' },
    { label: 'Inventory', icon: 'inventory_2', link: '/inventory' },
    { label: 'Recipes', icon: 'restaurant_menu', link: '/recipes' },
    { label: 'Sales', icon: 'trending_up', link: '/sales' },
    { label: 'Alerts', icon: 'notifications', link: '/alerts' },
    { label: 'Devices', icon: 'router', link: '/devices' },
    { label: 'Settings', icon: 'settings', link: '/settings' },
  ]);

  userName = signal('Alex Chen');
  userAvatarUrl = signal<string | null>(null);
  searchPlaceholder = signal('Search recipes, ingredients, or SKUs...');
}
