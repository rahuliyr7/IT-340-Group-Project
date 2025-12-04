import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

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
              <div>
                <label class="block text-gray-700 text-sm font-semibold mb-2">First Name</label>
                <input
                  type="text"
                  [(ngModel)]="firstName"
                  name="firstName"
                  placeholder="John"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label class="block text-gray-700 text-sm font-semibold mb-2">Last Name</label>
                <input
                  type="text"
                  [(ngModel)]="lastName"
                  name="lastName"
                  placeholder="Doe"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <!-- Email Input -->
            <div class="mb-6">
              <label class="block text-gray-700 text-sm font-semibold mb-2">Email Address</label>
              <input
                type="email"
                [(ngModel)]="email"
                name="email"
                placeholder="john@example.com"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                [class.border-red-500]="emailError"
              />
              <p *ngIf="emailError" class="text-red-500 text-xs mt-1">{{emailError}}</p>
            </div>

            <!-- Phone Number -->
            <div class="mb-6">
              <label class="block text-gray-700 text-sm font-semibold mb-2">Phone Number (Optional)</label>
              <input
                type="tel"
                [(ngModel)]="phone"
                name="phone"
                placeholder="+1 (555) 123-4567"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <!-- Password Fields -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label class="block text-gray-700 text-sm font-semibold mb-2">Password</label>
                <input
                  [type]="showPassword ? 'text' : 'password'"
                  [(ngModel)]="password"
                  name="password"
                  placeholder="••••••••"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  [class.border-red-500]="passwordError"
                />
                <p *ngIf="passwordError" class="text-red-500 text-xs mt-1">{{passwordError}}</p>
              </div>
              <div>
                <label class="block text-gray-700 text-sm font-semibold mb-2">Confirm Password</label>
                <input
                  [type]="showConfirmPassword ? 'text' : 'password'"
                  [(ngModel)]="confirmPassword"
                  name="confirmPassword"
                  placeholder="••••••••"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  [class.border-red-500]="confirmPasswordError"
                />
                <p *ngIf="confirmPasswordError" class="text-red-500 text-xs mt-1">{{confirmPasswordError}}</p>
              </div>
            </div>

            <!-- Account Type -->
            <div class="mb-6">
              <label class="block text-gray-700 text-sm font-semibold mb-3">I want to:</label>
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
                  I agree to the Terms of Service and Privacy Policy
                </span>
              </label>
            </div>

            <!-- Error Message -->
            <div *ngIf="errorMessage" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p class="text-sm text-red-600">{{errorMessage}}</p>
            </div>

            <!-- Success Message -->
            <div *ngIf="successMessage" class="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p class="text-sm text-green-600">{{successMessage}}</p>
            </div>

            <!-- Register Button -->
            <button
              type="submit"
              [disabled]="isLoading || !agreeToTerms"
              class="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span *ngIf="!isLoading">Create Account</span>
              <span *ngIf="isLoading">Creating account...</span>
            </button>
          </form>

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
  
  showPassword = false;
  showConfirmPassword = false;
  isLoading = false;
  
  errorMessage = '';
  successMessage = '';
  emailError = '';
  passwordError = '';
  confirmPasswordError = '';

  constructor(private authService: AuthService) {}

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

    // Prepare user data
    const userData = {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      password: this.password,
      phone: this.phone,
      accountType: this.accountType
    };

    this.isLoading = true;

    // Call backend API
    this.authService.register(userData).subscribe({
      next: (response) => {
        console.log('Registration successful:', response);
        this.isLoading = false;
        this.successMessage = 'Account created successfully! Redirecting...';
        
        setTimeout(() => {
          this.registerSuccess.emit();
        }, 1500);
      },
      error: (error) => {
        console.error('Registration error:', error);
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Registration failed. Please try again.';
      }
    });
  }

  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  goToLogin() {
    this.switchToLogin.emit();
  }
}
