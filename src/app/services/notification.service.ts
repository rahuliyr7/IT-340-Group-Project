import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Notification } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  notifications$ = this.notificationsSubject.asObservable();

  addNotification(message: string) {
    const newNotification: Notification = {
      id: Date.now(),
      message,
      time: new Date()
    };
    const current = this.notificationsSubject.value;
    this.notificationsSubject.next([newNotification, ...current]);
  }

  getNotifications() {
    return this.notificationsSubject.value;
  }
}