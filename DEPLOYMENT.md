# Deployment Instructions

## Vercel Deployment

### Backend
1. Create a new Vercel project pointing to the `backend` folder
2. Add all environment variables from `.env` to Vercel dashboard
3. Set the output directory to root

### Frontend
1. Create a new Vercel project pointing to the `frontend` folder
2. Add `VITE_API_URL` environment variable pointing to your backend URL
3. Set the build command to `npm run build`

## Environment Variables Required

### Backend (.env)
```
MONGO_URI=mongodb+srv://...
JWT_SECRET=your_secret
ADMIN_EMAIL=your_email
ADMIN_PASSWORD=your_password
PORT=5000
MPESA_BASE=https://sandbox.safaricom.co.ke
MPESA_SHORTCODE=4574727
MPESA_TILL_NUMBER=5367886
MPESA_TRANSACTION_TYPE=CustomerBuyGoodsOnline
MPESA_ACCOUNT_REFERENCE=Geopramevents
MPESA_TRANSACTION_DESC=Geopram Technologies
MPESA_CONSUMER_KEY=your_key
MPESA_CONSUMER_SECRET=your_secret
MPESA_PASSKEY=your_passkey
```

### Frontend (.env)
```
VITE_API_URL=https://your-backend-url.vercel.app/api
```