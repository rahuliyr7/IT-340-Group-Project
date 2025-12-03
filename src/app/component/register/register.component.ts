import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 flex items-center justify-center px-4 py-12">
      <div class="max-w-2xl w-full">
        <!-- Logo and Title -->
        <div class="text-center mb-8">
          <div class="bg-white text-blue-900 p-4 rounded-2xl font-bold text-3xl inline-block mb-4 shadow-lg">
            AA
          </div>
          <h1 class="text-4xl font-bold text-white mb-2">Join Atlantic Auctions</h1>
          <p class="text-blue-100">Create your account to start bidding</p>
        </div>

        <!-- Registration Form Card -->
        <div class="bg-white rounded-2xl shadow-2xl p-8">
          <form (ngSubmit)="onRegister()">
            <!-- Name Fields -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <!-- First Name -->
              <div>
                <label class="block text-gray-700 text-sm font-semibold mb-2" for="firstName">
                  First Name
                </label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                    </svg>
                  </div>
                  <input
                    type="text"
                    id="firstName"
                    [(ngModel)]="firstName"
                    name="firstName"
                    placeholder="John"
                    required
                    class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div>
              </div>

              <!-- Last Name -->
              <div>
                <label class="block text-gray-700 text-sm font-semibold mb-2" for="lastName">
                  Last Name
                </label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                    </svg>
                  </div>
                  <input
                    type="text"
                    id="lastName"
                    [(ngModel)]="lastName"
                    name="lastName"
                    placeholder="Doe"
                    required
                    class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div>
              </div>
            </div>

            <!-- Email Input -->
            <div class="mb-6">
              <label class="block text-gray-700 text-sm font-semibold mb-2" for="email">
                Email Address
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"/>
                  </svg>
                </div>
                <input
                  type="email"
                  id="email"
                  [(ngModel)]="email"
                  name="email"
                  placeholder="john@example.com"
                  required
                  class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  [class.border-red-500]="emailError"
                />
              </div>
              <p *ngIf="emailError" class="text-red-500 text-xs mt-1">{{emailError}}</p>
            </div>

            <!-- Phone Number -->
            <div class="mb-6">
              <label class="block text-gray-700 text-sm font-semibold mb-2" for="phone">
                Phone Number (Optional)
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                  </svg>
                </div>
                <input
                  type="tel"
                  id="phone"
                  [(ngModel)]="phone"
                  name="phone"
                  placeholder="+1 (555) 123-4567"
                  class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>
            </div>

            <!-- Password Fields -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <!-- Password -->
              <div>
                <label class="block text-gray-700 text-sm font-semibold mb-2" for="password">
                  Password
                </label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                    </svg>
                  </div>
                  <input
                    [type]="showPassword ? 'text' : 'password'"
                    id="password"
                    [(ngModel)]="password"
                    name="password"
                    placeholder="••••••••"
                    required
                    class="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    [class.border-red-500]="passwordError"
                  />
                  <button
                    type="button"
                    (click)="showPassword = !showPassword"
                    class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    <svg *ngIf="!showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                    </svg>
                    <svg *ngIf="showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
                    </svg>
                  </button>
                </div>
                <p *ngIf="passwordError" class="text-red-500 text-xs mt-1">{{passwordError}}</p>
              </div>

              <!-- Confirm Password -->
              <div>
                <label class="block text-gray-700 text-sm font-semibold mb-2" for="confirmPassword">
                  Confirm Password
                </label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </div>
                  <input
                    [type]="showConfirmPassword ? 'text' : 'password'"
                    id="confirmPassword"
                    [(ngModel)]="confirmPassword"
                    name="confirmPassword"
                    placeholder="••••••••"
                    required
                    class="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    [class.border-red-500]="confirmPasswordError"
                  />
                  <button
                    type="button"
                    (click)="showConfirmPassword = !showConfirmPassword"
                    class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    <svg *ngIf="!showConfirmPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                    </svg>
                    <svg *ngIf="showConfirmPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
                    </svg>
                  </button>
                </div>
                <p *ngIf="confirmPasswordError" class="text-red-500 text-xs mt-1">{{confirmPasswordError}}</p>
              </div>
            </div>

            <!-- Password Strength Indicator -->
            <div *ngIf="password" class="mb-6">
              <div class="flex items-center justify-between mb-1">
                <span class="text-xs text-gray-600 font-semibold">Password Strength</span>
                <span class="text-xs font-semibold" [class]="getPasswordStrengthColor()">
                  {{getPasswordStrengthText()}}
                </span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div 
                  class="h-2 rounded-full transition-all duration-300" 
                  [style.width.%]="getPasswordStrength()"
                  [class]="getPasswordStrengthBarColor()">
                </div>
              </div>
            </div>

            <!-- Account Type -->
            <div class="mb-6">
              <label class="block text-gray-700 text-sm font-semibold mb-3">
                I want to:
              </label>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label class="relative flex items-center p-4 border-2 rounded-lg cursor-pointer transition" 
                  [class.border-blue-500]="accountType === 'buyer'"
                  [class.bg-blue-50]="accountType === 'buyer'">
                  <input 
                    type="radio" 
                    name="accountType" 
                    value="buyer" 
                    [(ngModel)]="accountType"
                    class="w-4 h-4 text-blue-600"
                  />
                  <div class="ml-3">
                    <p class="font-semibold text-gray-800">Buy & Bid</p>
                    <p class="text-xs text-gray-600">Purchase and bid on items</p>
                  </div>
                </label>
                <label class="relative flex items-center p-4 border-2 rounded-lg cursor-pointer transition"
                  [class.border-blue-500]="accountType === 'seller'"
                  [class.bg-blue-50]="accountType === 'seller'">
                  <input 
                    type="radio" 
                    name="accountType" 
                    value="seller" 
                    [(ngModel)]="accountType"
                    class="w-4 h-4 text-blue-600"
                  />
                  <div class="ml-3">
                    <p class="font-semibold text-gray-800">Sell & Auction</p>
                    <p class="text-xs text-gray-600">List items for sale or auction</p>
                  </div>
                </label>
              </div>
            </div>

            <!-- Terms and Conditions -->
            <div class="mb-6">
              <label class="flex items-start cursor-pointer">
                <input
                  type="checkbox"
                  [(ngModel)]="agreeToTerms"
                  name="agreeToTerms"
                  class="w-4 h-4 mt-1 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span class="ml-2 text-sm text-gray-700">
                  I agree to the 
                  <button type="button" class="text-blue-600 hover:text-blue-800 font-semibold">Terms of Service</button> 
                  and 
                  <button type="button" class="text-blue-600 hover:text-blue-800 font-semibold">Privacy Policy</button>
                </span>
              </label>
            </div>

            <!-- Newsletter -->
            <div class="mb-6">
              <label class="flex items-start cursor-pointer">
                <input
                  type="checkbox"
                  [(ngModel)]="subscribeNewsletter"
                  name="subscribeNewsletter"
                  class="w-4 h-4 mt-1 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span class="ml-2 text-sm text-gray-700">
                  Send me auction alerts and exclusive deals
                </span>
              </label>
            </div>

            <!-- Error Message -->
            <div *ngIf="errorMessage" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p class="text-sm text-red-600 flex items-center">
                <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
                </svg>
                {{errorMessage}}
              </p>
            </div>

            <!-- Success Message -->
            <div *ngIf="successMessage" class="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p class="text-sm text-green-600 flex items-center">
                <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                </svg>
                {{successMessage}}
              </p>
            </div>

            <!-- Register Button -->
            <button
              type="submit"
              [disabled]="isLoading || !agreeToTerms"
              class="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              <span *ngIf="!isLoading">Create Account</span>
              <span *ngIf="isLoading" class="flex items-center justify-center">
                <svg class="animate-spin h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating account...
              </span>
            </button>
          </form>

          <!-- Divider -->
          <div class="relative my-6">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-white text-gray-500">Or sign up with</span>
            </div>
          </div>

          <!-- Social Sign Up Buttons -->
          <div class="grid grid-cols-2 gap-4">
            <button type="button" class="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
              <svg class="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </button>
            <button type="button" class="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
              <svg class="w-5 h-5 mr-2" fill="#1877F2" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Facebook
            </button>
          </div>

          <!-- Sign In Link -->
          <div class="mt-6 text-center">
            <p class="text-sm text-gray-600">
              Already have an account? 
              <button type="button" (click)="goToLogin()" class="text-blue-600 hover:text-blue-800 font-semibold transition">
                Sign in
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  `
})
export class RegisterComponent {
  @Output() registerSuccess = new EventEmitter<void>();
  @Output() switchToLogin = new EventEmitter<void>();
  
  firstName = '';
  lastName = '';
  email = '';
  phone = '';
  password = '';
  confirmPassword = '';
  accountType = 'buyer';
  agreeToTerms = false;
  subscribeNewsletter = false;
  
  showPassword = false;
  showConfirmPassword = false;
  isLoading = false;
  
  errorMessage = '';
  successMessage = '';
  emailError = '';
  passwordError = '';
  confirmPasswordError = '';

  onRegister() {
    // Reset errors
    this.errorMessage = '';
    this.successMessage = '';
    this.emailError = '';
    this.passwordError = '';
    this.confirmPasswordError = '';

    // Validation
    if (!this.firstName || !this.lastName || !this.email || !this.password || !this.confirmPassword) {
      this.errorMessage = 'Please fill in all required fields';
      return;
    }

    if (!this.isValidEmail(this.email)) {
      this.emailError = 'Please enter a valid email address';
      return;
    }

    if (this.password.length < 8) {
      this.passwordError = 'Password must be at least 8 characters';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.confirmPasswordError = 'Passwords do not match';
      return;
    }

    if (!this.agreeToTerms) {
      this.errorMessage = 'You must agree to the Terms of Service';
      return;
    }

    // Simulate registration
    this.isLoading = true;

    setTimeout(() => {
      this.isLoading = false;
      this.successMessage = 'Account created successfully! Redirecting...';
      
      setTimeout(() => {
        this.registerSuccess.emit();
      }, 1500);
    }, 2000);
  }

  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  getPasswordStrength(): number {
    if (!this.password) return 0;
    
    let strength = 0;
    if (this.password.length >= 8) strength += 25;
    if (this.password.length >= 12) strength += 25;
    if (/[a-z]/.test(this.password) && /[A-Z]/.test(this.password)) strength += 25;
    if (/\d/.test(this.password)) strength += 12.5;
    if (/[^a-zA-Z0-9]/.test(this.password)) strength += 12.5;
    
    return strength;
  }

  getPasswordStrengthText(): string {
    const strength = this.getPasswordStrength();
    if (strength < 25) return 'Weak';
    if (strength < 50) return 'Fair';
    if (strength < 75) return 'Good';
    return 'Strong';
  }

  getPasswordStrengthColor(): string {
    const strength = this.getPasswordStrength();
    if (strength < 25) return 'text-red-600';
    if (strength < 50) return 'text-orange-600';
    if (strength < 75) return 'text-yellow-600';
    return 'text-green-600';
  }

  getPasswordStrengthBarColor(): string {
    const strength = this.getPasswordStrength();
    if (strength < 25) return 'bg-red-500';
    if (strength < 50) return 'bg-orange-500';
    if (strength < 75) return 'bg-yellow-500';
    return 'bg-green-500';
  }

  goToLogin() {
    this.switchToLogin.emit();
  }
}

// Chris Thayil added this
// Update or Add Login/Registration Components
import { Component } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html'
})
export class RegistrationComponent {
  email: string = '';
  password: string = '';

  constructor(private authService: AuthService) {}

  onRegister() {
    this.authService.register(this.email, this.password).subscribe(
      response => console.log('Registered:', response),
      error => console.log('Error:', error)
    );
  }
}

<div>
  <input type="email" [(ngModel)]="email" placeholder="Email">
  <input type="password" [(ngModel)]="password" placeholder="Password">
  <button (click)="onRegister()">Register</button>
</div>
