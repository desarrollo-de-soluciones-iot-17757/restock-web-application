import { Component, inject, signal } from '@angular/core';
import { Layout } from './shared/presentation/components/layout/layout';
import { TranslateService } from '@ngx-translate/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: true,
  styleUrl: './app.css',
  imports: [RouterOutlet],
})
export class App {
  protected readonly title = signal('restock-web-application');
  /**
   * Translation service instance.
   */
  private translate: TranslateService;

  /**
   * Creates an instance of App and sets up translation.
   */
  constructor() {
    this.translate = inject(TranslateService);
    this.translate.addLangs(['en', 'es']);
    this.translate.use('en');
  }
}
