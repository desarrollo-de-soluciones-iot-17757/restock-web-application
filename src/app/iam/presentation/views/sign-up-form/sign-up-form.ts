import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';

import { IamStore } from '../../../application/iam.store';

@Component({
  selector: 'app-sign-up-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink, TranslatePipe],
  templateUrl: './sign-up-form.html',
  styleUrl: './sign-up-form.css',
})
export class SignUpForm {
  private readonly router = inject(Router);
  private readonly iamStore = inject(IamStore);

  readonly form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    confirmPassword: new FormControl('', [Validators.required]),
  });

  onSubmit(): void {
    if (this.form.valid) {
      const email = this.form.get('email')?.value || '';
      const password = this.form.get('password')?.value || '';

      this.iamStore.signUp(
        { email, password },
        () => {
          void this.router.navigate(['/role-selection']);
        }
      );
    }
  }
}
