import { Component, computed, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavItem } from '../navigator/nav-item.model';
import { Navigator } from '../navigator/navigator';
import { TopBar } from '../top-bar/top-bar';
import { ProfilesStore } from '../../../../profiles/application/profiles.store';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, Navigator, TopBar],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout {
  private readonly store = inject(ProfilesStore);

  navItems = signal<NavItem[]>([
    { label: 'Overview', icon: 'grid_view', link: '/' },
    { label: 'Inventory', icon: 'inventory_2', link: '/inventory' },
    { label: 'Recipes', icon: 'restaurant_menu', link: '/recipes' },
    { label: 'Sales', icon: 'trending_up', link: '/sales' },
    { label: 'Alerts', icon: 'notifications', link: '/alerts' },
    { label: 'Devices', icon: 'router', link: '/devices' },
    { label: 'Settings', icon: 'settings', link: '/settings' },
  ]);

  userName = computed(() => {
    const p = this.store.profile();
    return p ? `${p.firstName} ${p.lastName}` : '';
  });

  userAvatarUrl = computed(() => this.store.profile()?.avatarUrl ?? null);
  searchPlaceholder = signal('Search recipes, ingredients, or SKUs...');

  constructor() {
    this.store.load();
  }
}
