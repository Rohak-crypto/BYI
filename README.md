# Bid Your Item (BYI)

Full-stack online auction system using HTML/CSS/JavaScript, Node.js/Express and MySQL.

## Stack
- Frontend: HTML5, CSS3, Bootstrap 5, vanilla JavaScript
- Backend: Node.js + Express
- Database: MySQL 8+
- Authentication: bcrypt password hashing + JWT
- Security: Helmet, CORS, rate limiting, parameterized SQL queries
- Auction bidding: MySQL transaction + row locking to prevent two bids from incorrectly overwriting each other

## Project structure
```text
BYI/
├── client/                 # frontend
├── server/                 # Express backend
├── database/schema.sql     # MySQL schema
├── .env.example
├── package.json
└── README.md
```

## Run locally

### 1. Install prerequisites
- Node.js 18+
- MySQL 8+
- Git

### 2. Create environment file
Copy `.env.example` to `.env` in the project root and set your MySQL password and a strong JWT secret.

Example:
```env
PORT=3000
NODE_ENV=development
JWT_SECRET=change-this-to-a-long-random-secret
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=bid_your_item
DB_CONNECTION_LIMIT=10
CORS_ORIGINS=http://localhost:3000
```

### 3. Install packages
From the project root:
```bash
npm install
```

### 4. Create database/tables
Option A:
```bash
npm run db:init
```

Option B: open MySQL Workbench and run `database/schema.sql`.

### 5. Start
```bash
npm start
```

Open:
```text
http://localhost:3000
```

Do not open `client/index.html` directly with `file://`. The Express server must serve the frontend so `/api/...` requests work.

## Main API
- `GET /api/health`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `PUT /api/auth/me`
- `PUT /api/auth/password`
- `GET /api/auctions`
- `GET /api/auctions/:id`
- `POST /api/auctions`
- `PUT /api/auctions/:id`
- `DELETE /api/auctions/:id`
- `POST /api/auctions/:id/bids`
- `GET /api/auctions/:id/bids`
- `GET /api/dashboard`
- `GET/POST/DELETE /api/wishlist`
- `GET /api/orders`
- `GET /api/orders/won`
- `GET /api/orders/:id`
- `GET /api/payments/history`
- `POST /api/payments/checkout`
- `GET /api/notifications`
- `PATCH /api/notifications/:id/read`
- `GET/POST /api/messages`
- `POST /api/support`
- `GET /api/stats`

## Important deployment note
A Node.js server and a MySQL database are separate services in production. Create a MySQL 8+ database with your hosting provider or a managed MySQL provider, import `database/schema.sql`, then set the production environment variables from `.env.example`.

Set:
- `NODE_ENV=production`
- `PORT` to the host-provided port
- `JWT_SECRET` to a strong secret
- `DB_HOST`
- `DB_PORT`
- `DB_USER`
- `DB_PASSWORD`
- `DB_NAME`
- `CORS_ORIGINS` to the deployed site origin

Never commit `.env` or database passwords.

## GitHub update
After extracting the completed project over your existing local repository (keep the existing `.git` directory):
```bash
git status
git add .
git commit -m "Complete full-stack backend and MySQL integration"
git push origin main
```

## Payment
The checkout endpoint creates an order record, but real money collection is intentionally not faked. A production payment provider such as Razorpay/Stripe must be connected before accepting real payments. The database and order layer are ready for that integration.
