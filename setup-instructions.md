# Acero Steel Supply - Database Setup Instructions

## Prerequisites

1. **Install PostgreSQL** on your system
2. **Install Node.js** (version 18 or higher)
3. **Install npm** (comes with Node.js)

## Database Setup Steps

### 1. Create PostgreSQL Database

```sql
-- Connect to PostgreSQL as superuser
CREATE DATABASE acero_db;
CREATE USER acero_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE acero_db TO acero_user;
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Set Environment Variables

Create a `.env` file in the `backend` directory:

```env
DATABASE_URL=postgresql://acero_user:your_secure_password@localhost:5432/acero_db
JWT_SECRET=your-super-secret-jwt-key-change-in-production-2024
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### 4. Run Database Setup Script

```bash
# From the root directory
node setup-database.js
```

This will:
- Create all database tables
- Insert your 30 steel products
- Create demo admin and customer users
- Set up all security rules and constraints

### 5. Start the Backend Server

```bash
cd backend
npm start
```

## Demo Users Created

### Admin User
- **Email**: admin@acerosteel.com
- **Password**: admin123
- **Role**: Administrator

### Customer User
- **Email**: customer@example.com
- **Password**: customer123
- **Role**: Customer

## Your Steel Products

The database will contain all 30 of your steel products:

### Round Tubes (14 products)
- 19mm, 25mm, 32mm, 38mm, 50mm, 63mm, 76mm (both 1.2mm and 1.6mm gauges)

### Square Tubes (10 products)
- 15mm, 20mm, 30mm, 40mm, 50mm (both 1.2mm and 1.6mm gauges)

### Angle Iron (3 products)
- 25x25x3mm, 30x30x3mm, 40x40x3mm

### Flat Bar (1 product)
- 20x3mm

### Specialty Steel (2 products)
- FX and F7 grades

## Database Features

✅ **User Authentication** - Secure login/registration
✅ **Product Catalog** - All your steel products with images
✅ **Order Management** - Customer orders and order items
✅ **Role-Based Access** - Admin, staff, wholesale, customer roles
✅ **Security Rules** - Row-level security, audit logging
✅ **Rate Limiting** - Protection against abuse
✅ **Data Validation** - Email, phone, price validation

## Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL is running
- Check your DATABASE_URL in .env file
- Verify user permissions

### Port Conflicts
- Change PORT in .env if 3000 is in use
- Update FRONTEND_URL accordingly

### Missing Dependencies
```bash
cd backend
npm install bcryptjs jsonwebtoken express-rate-limit helmet cors pg nodemailer validator dotenv
```

## Next Steps

1. Run the setup script
2. Start your backend server
3. Your frontend will automatically connect to the real API
4. Test login with the demo users
5. Browse your steel products catalog

Your steel supply application is now ready with a complete database backend!
