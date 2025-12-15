export class TwoFaSetupComponent {
  qrCode: string;
  secret: string;
  code: string;

  constructor(private http: HttpClient) {
    this.http.post('/api/auth/setup-2fa', {}).subscribe((res: any) => {
      this.qrCode = res.qrCode;
      this.secret = res.secret;
    });
  }

  verify() {
    this.http.post('/api/auth/verify-2fa', { token: this.code }).subscribe(() => {
      alert('2FA Enabled!');
    });
  }
}
