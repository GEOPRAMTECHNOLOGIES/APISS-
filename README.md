# Geopram Technologies - Service Ordering App

## Project Structure
```
.
├── backend/          # Node.js Express API server
├── frontend/         # React Vite frontend
└── README.md
```

## Setup Instructions

### Backend Setup
```bash
cd backend
npm install
npm start
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## Environment Variables

### Backend (.env)
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - JWT signing secret
- `ADMIN_EMAIL` - Admin login email
- `ADMIN_PASSWORD` - Admin login password
- `MPESA_*` - M-Pesa API credentials

### Frontend (.env)
- `VITE_API_URL` - Backend API URL

## Features
- Service listing and ordering
- M-Pesa STK Push payments
- Admin dashboard with order management
- Transaction tracking
- Success/failure popup notifications