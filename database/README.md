# Database Configuration

## VM3 - Database Server
- IP: 192.168.10.30
- Port: 27017
- Database: atlantic_auctions

## Setup Instructions

1. SSH into VM3
2. Run setup script:
```bash
   mongosh < setup.js
```

## Collections
- **users**: User authentication and profile data

## Indexes
- users.email (unique)
- users.createdAt

## Backup
Regular backups should be performed using:
```bash
mongodump --db atlantic_auctions --out /backup/$(date +%Y%m%d)
```
