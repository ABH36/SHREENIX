🌿 Shreenix 
D2C E-Commerce & Business Management Platform

A full-stack, production-ready e-commerce platform built for Shreenix that combines a high-conversion customer website with a powerful admin control system for managing products, orders, customers and growth — built using Next.js 14, TypeScript & MongoDB.




🚀 Core Features
🛒 Customer Platform

Dynamic Hero Slider – Fully controlled from Admin Panel

Before/After Treatment Visuals

Smart Order Form

Pincode delivery whitelist

Coupon based discounts

Dynamic pricing by product size/weight

WhatsApp Floating Support Button

Announcement Bar for sales & offers

Mobile-First Responsive UI

Multi-Language Support (Hindi / English)

⚡ Admin Panel (CMS)

Live Dashboard Analytics – Revenue, Orders, Pending status

Order Management

Status update (Processing, Shipped, Delivered, Cancelled)

CSV export for shipping partners

WhatsApp customer contact

Product Management

Variant control (Weight, MRP, Selling Price)

Hero & Treatment image management

Delivery pincode whitelist

Customer Database & Insights

Review Manager

Coupon Manager

Global Website Settings

Contact details

Announcement bar control

🛠️ Tech Stack
Layer	Technology
Frontend	Next.js 14 (App Router), TypeScript
Styling	Tailwind CSS
Backend	Next.js API Routes
Database	MongoDB + Mongoose
Animations	Framer Motion
Icons	Lucide React
⚙️ Setup & Installation
1. Clone Repository
git clone https://github.com/your-username/shreenix-web.git
cd shreenix-web

2. Install Dependencies
npm install
# or
yarn install

3. Environment Variables

Create .env.local

MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/shreenix

4. Start Development Server
npm run dev


Website → http://localhost:3000

Admin Panel → http://localhost:3000/admin/login

📂 Project Structure
src/
├── app/
│   ├── admin/         # Admin Panel
│   ├── api/           # Backend APIs
│   ├── layout.tsx     # Root Layout
│   └── page.tsx       # Landing Page
├── components/        # Reusable Components
├── lib/               # DB helpers
├── models/            # Mongo Schemas
└── public/            # Static Assets

🛡️ Admin Access

Visit /admin/login.
Make sure admin authentication and seed user are configured in database.

📦 Deployment (Vercel)

Push project to GitHub

Import into Vercel

Add MONGODB_URI in Environment Variables

Click Deploy

🤝 Contributing

Fork the repo

Create branch

Commit changes

Push & create PR

Developed with ❤️ for Shreenix