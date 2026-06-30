import { Injectable, inject, signal } from '@angular/core';
import { SubscriptionsApiEndpoint } from '../infrastructure/subscriptions-api-endpoint';
import { PlanEntity } from '../domain/model/plan.entity';
import { SubscriptionEntity } from '../domain/model/subscription.entity';

@Injectable({ providedIn: 'root' })
export class SubscriptionsStore {
  private readonly api = inject(SubscriptionsApiEndpoint);

  readonly plans = signal<PlanEntity[]>([]);
  readonly activeSubscription = signal<SubscriptionEntity | null>(null);
  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly error = signal<string | null>(null);

  loadPlans(): void {
    this.loading.set(true);
    this.error.set(null);
    this.api.getPlans().subscribe({
      next: (plans) => {
        this.plans.set(plans);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.message ?? 'Failed to load plans');
        this.loading.set(false);
      }
    });
  }

  loadSubscriptionStatus(accountId: string): void {
    if (!accountId) return;
    this.loading.set(true);
    this.error.set(null);
    this.api.getSubscriptionStatus(accountId).subscribe({
      next: (sub) => {
        this.activeSubscription.set(sub);
        this.loading.set(false);
      },
      error: () => {
        // subscription might not exist yet for new accounts
        this.activeSubscription.set(null);
        this.loading.set(false);
      }
    });
  }

  subscribeToPlan(accountId: string, planId: string): void {
    this.saving.set(true);
    this.error.set(null);
    this.api.createCheckoutSession(accountId, planId).subscribe({
      next: (sessionUrl) => {
        this.saving.set(false);
        // Redirect to Stripe checkout page
        window.location.href = sessionUrl;
      },
      error: (err) => {
        this.error.set(err.message ?? 'Failed to initiate checkout session');
        this.saving.set(false);
      }
    });
  }
}
