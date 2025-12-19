# Frontend 

## VM1 Angular Frontend 
Atlantic Auctions

---

## Overview
**Purpose:** Angular frontend + Apache web server

**VM IP address:** 192.168.10.10

**Framework:** Angular 20

**Served by:** Apache2

## Install Dependencies

``` npm install```

 ---

## Local Testing 
``` ng serve --host 0.0.0.0 --port 4200```

Access in browser via: 
```
http//:192.168.10.10:4200
```
---

## Production Deployment (Apache Host)
### 1. Build Angular project
``` ng build --configuration=production```

### 2 Deploy to Apache
```
sudo cp -r dist/atlantic-auctions-v2/browser/* /var/www/html/
sudo systemctl restart apache2
```
---


## API Configuration 
Frontend sends all API requests top 
```
http://192.168.10.20:3000

```

## Authentication
- Login credentials are sent to backend to verify
- If two factor authentication is on an additonal step will occur
- Frontend prompt the verification code and submits to backend
- All authentication logic handled backend
