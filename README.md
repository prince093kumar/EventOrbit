# EventOrbit - Advanced Event Management System 🎟️

![MERN Stack](https://img.shields.io/badge/MERN-Stack-blue?style=for-the-badge&logo=react)
![Socket.io](https://img.shields.io/badge/Socket.io-Realtime-black?style=for-the-badge&logo=socket.io)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css)

**EventOrbit** is a scalable, production-ready event management and ticket booking platform. It features a micro-frontend architecture with three isolated panels, ensuring robust security and role-based access control.

## 🚀 Key Features

### 👤 User Panel
*   **Event Discovery**: Browse and search for events with advanced filters.
*   **Interactive Booking**: Visual seat selection map.
*   **Digital Wallet**: Add funds, view transaction history, and pay securely.
*   **Ticket Management**: QR code generation for easy check-ins.
*   **Social**: Leave reviews and ratings.

### 🎤 Organizer Panel
*   **Dashboard**: Real-time analytics and KPIs (Revenue, Attendees, Sales).
*   **Event Management**: Create and edit events with rich details.
*   **Real-Time Notifications**: Instant alerts for ticket sales, approvals, and payouts (Socket.io).
*   **KYC & Profile**: Secure KYC submission (Documents, Bank Details) and profile management.
*   **Live Monitor**: Track seat occupancy in real-time.

### 🛡 Admin Panel
*   **Governance**: Approve or reject organizer event listings.
*   **User Management**: Oversee all users and organizers.
*   **Financials**: Manage payouts and refunds.
*   **Analytics**: Platform-wide performance metrics.

---

## 🛠 Tech Stack

| Area | Technology |
| :--- | :--- |
| **Frontend** | React (Vite), TailwindCSS, Lucide Icons, Axios |
| **Backend** | Node.js, Express.js, Socket.io |
| **Database** | MongoDB, Mongoose |
| **Authentication** | JWT (JSON Web Tokens), bcrypt |
| **Media** | Multer (File Uploads) |

---

## 📂 Project Structure

```bash
event-booking-system/
├── backend/                # API Server & Socket.io
│   ├── config/             # DB & Env Config
│   ├── controllers/        # Logical Handlers
│   ├── middleware/         # Auth & Error Middleware
│   ├── routes/             # API Endpoints
│   ├── models/             # Mongoose Schemas
│   └── server.js           # Entry Point
│
└── frontend/               # React Applications
    ├── user/               # Customer Interface
    ├── organizer/          # Event Manager Interface
    └── admin/              # Super Admin Interface
```

---

## ⚙️ Installation & Setup

### 1. Prerequisite
Ensure you have **Node.js** and **MongoDB** installed.

### 2. Clone Repository
```bash
git clone https://github.com/paraspathania/EventOrbit.git
cd EventOrbit
```

### 3. Backend Setup
```bash
cd backend
npm install
# Create a .env file with your credentials (see below)
npm start
```

### 4. Frontend Setup
Run each panel in a separate terminal:

**User Panel:**
```bash
cd frontend/user
npm install
npm run dev
```

**Organizer Panel:**
```bash
cd frontend/organizer
npm install
npm run dev
```

**Admin Panel:**
```bash
cd frontend/admin
npm install
npm run dev
```

---

## 🔐 Environment Variables (`backend/.env`)

Create a `.env` file in the `backend` directory:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/eventorbit
JWT_SECRET=your_super_secret_key_change_this
```

---

## 🔗 API Reference

The backend runs on `http://localhost:5000`.
Key endpoints:
*   `POST /api/auth/register` - Register User/Organizer
*   `POST /api/auth/login` - Login
*   `GET /api/events` - Fetch Events
*   `POST /api/bookings` - Book Tickets

---

## � Future Roadmap
- [ ] Integration with Razorpay/Stripe Payment Gateways.
- [ ] Mobile App (React Native).
- [ ] Advanced Seat Mapping Tool for Organizers.
- [ ] Multi-language Support (i18n).

---

**Author**: Paras Pathania
