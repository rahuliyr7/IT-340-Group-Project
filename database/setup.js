// MongoDB setup script for Atlantic Auctions
// Run this on VM3 using: mongosh < setup.js

use atlantic_auctions;

// Create user with read/write permissions
db.createUser({
  user: "atlanticuser",
  pwd: "securepassword123",  // Change this!
  roles: [
    { role: "readWrite", db: "atlantic_auctions" }
  ]
});

// Create indexes for better performance
db.users.createIndex({ "email": 1 }, { unique: true });
db.users.createIndex({ "createdAt": 1 });

print("Database setup complete!");
print("User 'atlanticuser' created with readWrite permissions");
print("Indexes created on users collection");
