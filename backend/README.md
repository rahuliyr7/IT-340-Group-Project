# Backend VM2 Node.js + Express API
 Atlantic Auctions Backend

## Overview
**Purpose:** Provides a backend API for user authentication and connnection to MongoDB database

**VM IP address:** 192.168.10.20

**Entry:**  VM1 Angular frontend

**Database:** MongoDB on VM3 192.168.10.30


## Install Dependencies
from within backend/ folder

``` npm install```

 This installs all packages listen in package.json (Express, CORS, dotenv, mongoose)

 ---

 ## Environment Variables 
 Create a '.env' file in the backend directory:
```
 PORT = 3000
 MONGOURI= mongodb://192.168.10.30:27017/atlantic_auctions
```

Ensure .env is in .gitignore

 ---
 ## Start Backend Server
 Run API:
```
 node server.js
```
 (if during development)
```
 npx nodemon server.js
```
 API will be available through 
```
 http://192.168.10.20:3000
```
 ---

 ## Database Connection VM3
 The backend automatically connects to the database server on VM3 using: 
```
 mongodb://192.168.10.30:27017/atlantic_auctions
```
 VM3 must be running MongoDB before starting backend

 ---

 ## Two Factor Authenitcation
- Supports optional two factor 
- 2FA config is stored in user model
- When enabled the authentiation required another setep
- Backend validation certifies secure authenitcation
 
 ## Firewall Rules
 Allow API traffic on port 3000:
```
 sudo ufw allow 3000
```
 Backend must also be able to reach VM3 on MongoDB via port 27017

 ---

 ## Notes
 - Front end on VM1 communicated directly with this backend
 - server.js contains routing and middleware logic
   



