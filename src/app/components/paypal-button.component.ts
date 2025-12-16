import { Component, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';

declare var paypal: any;

@Component({
  selector: 'app-paypal-button',
  template: `<div id="paypal-button"></div>`
})
export class PaypalButtonComponent {
  @Input() amount!: number;

  constructor(private http: HttpClient) {}

  ngAfterViewInit() {
    paypal.Buttons({
      createOrder: (data: any, actions: any) => {
        return this.http.post('/api/payment/create-order', { amount: this.amount })
          .toPromise().then((res: any) => res.id);
      },
      onApprove: (data: any) => {
        return this.http.post('/api/payment/capture-order', { orderID: data.orderID })
          .toPromise().then(() => alert('Payment complete!'));
      }
    }).render('#paypal-button');
  }
}
