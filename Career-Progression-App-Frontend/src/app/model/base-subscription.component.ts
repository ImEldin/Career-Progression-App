import { Injectable, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export abstract class BaseSubscriptionComponent implements OnDestroy {
  private subscriptions = new Subscription();

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  protected addSubscription(subscription: Subscription): void {
    this.subscriptions.add(subscription);
  }
}
