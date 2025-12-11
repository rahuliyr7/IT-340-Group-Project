import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Get token from localStorage
  const token = localStorage.getItem('token');
  
  console.log('🔍 Interceptor called');
  console.log('📍 URL:', req.url);
  console.log('🔑 Token exists:', !!token);
  
  if (token) {
    console.log('✅ Attaching token to request');
    const clonedRequest = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
    return next(clonedRequest);
  }
  
  console.log('❌ No token found, request sent without auth');
  return next(req);
};
