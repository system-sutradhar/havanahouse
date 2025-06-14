# HavanaHouse Monorepo

This repository contains three separate packages:

- **admin/** – React based admin dashboard.
- **client/** – Next.js storefront for customers.
- **server/** – Express API that powers both front‑end apps.

## Getting Started

Install dependencies and start each package individually.

### Admin
```bash
cd admin
npm install
npm start
```
The admin dashboard runs on port **3002** by default.

### Client
```bash
cd client
npm install
npm run dev
```
By default the storefront is available at **http://localhost:3000**.

### Server
```bash
cd server
npm install
npm start
```
The server listens on the `PORT` defined in the `.env` file (8000 in the sample).

## Environment Variables

Each package relies on environment variables. Copy the provided `.env` files or create them manually using the following keys.

### admin/.env
```
REACT_APP_BASE_URL=<backend url>
REACT_APP_FIREBASE_API_KEY=<firebase api key>
REACT_APP_FIREBASE_AUTH_DOMAIN=<firebase auth domain>
REACT_APP_FIREBASE_PROJECT_ID=<firebase project id>
REACT_APP_FIREBASE_STORAGE_BUCKET=<firebase storage bucket>
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=<firebase messaging sender id>
REACT_APP_FIREBASE_APP_ID=<firebase app id>
```

### client/.env
```
NEXT_PUBLIC_APP_API_URL=<backend url>
NEXT_PUBLIC_APP_RAZORPAY_KEY_ID=<razorpay id>
NEXT_PUBLIC_APP_RAZORPAY_KEY_SECRET=<razorpay secret>
NEXT_PUBLIC_APP_FIREBASE_API_KEY=<firebase api key>
NEXT_PUBLIC_APP_FIREBASE_AUTH_DOMAIN=<firebase auth domain>
NEXT_PUBLIC_APP_FIREBASE_PROJECT_ID=<firebase project id>
NEXT_PUBLIC_APP_FIREBASE_STORAGE_BUCKET=<firebase storage bucket>
NEXT_PUBLIC_APP_FIREBASE_MESSAGING_SENDER_ID=<firebase messaging sender id>
NEXT_PUBLIC_APP_FIREBASE_APP_ID=<firebase app id>
```

### server/.env
```
PORT=8000
CLIENT_BASE_URL=<client url>
CONNECTION_STRING=<mongodb uri>
cloudinary_Config_Cloud_Name=<cloudinary name>
cloudinary_Config_api_key=<cloudinary key>
cloudinary_Config_api_secret=<cloudinary secret>
mongoDB_Username=<db user>
mongoDB_pass=<db password>
JSON_WEB_TOKEN_SECRET_KEY=<jwt secret>
ERPLY_API_URL=<erply api url>
ERPLY_CLIENT_CODE=<erply client code>
ERPLY_USERNAME=<erply username>
ERPLY_PASSWORD=<erply password>
ERPLY_PRICE_LIST_ID=<erply price list id>
ERPLY_PIM_API_URL=<erply pim api url>
CLOUDINARY_CLOUD_NAME=<cloudinary name>
CLOUDINARY_API_KEY=<cloudinary key>
CLOUDINARY_API_SECRET=<cloudinary secret>
```

After configuring the environment variables, start each package as shown above.
