# 🏠 StaySphere

A full-stack accommodation booking platform — built with **Node.js + Express** on the backend and **React + Vite + Tailwind CSS** on the frontend. StaySphere lets users discover properties, book stays, manage reservations, and host their own accommodations — all secured by JWT cookie-based authentication with automatic token refresh.

---

## 📁 Repository Structure

```
staysphere/
├── backend/          # Express REST API + MongoDB (Mongoose)
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middlewares/
│   ├── utils/
│   └── README.md     ← Backend-specific documentation
│
├── frontend/         # React SPA with Vite + Tailwind CSS
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   └── utils/
│   └── README.md     ← Frontend-specific documentation
│
├── .gitignore
└── README.md         ← You are here
```

---

## ✨ Features at a Glance

| Feature | Description |
| :--- | :--- |
| 🔍 **Explore Listings** | Search and filter stays by location and price range |
| 🔒 **Secure Auth** | JWT access + refresh tokens stored in `httpOnly` cookies |
| 📅 **Smart Bookings** | Overlap-check prevents double bookings on the same property |
| 💼 **Host Console** | Hosts can create, edit, and delete listings with live metrics |
| 👤 **Profile Center** | Update personal details and upgrade account to Host |
| 🎨 **Dark / Light Mode** | Premium theme switching saved in localStorage |

---

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js v5
- **Database**: MongoDB + Mongoose
- **Auth**: JWT (Access & Refresh Token Rotation)
- **Validation**: Joi
- **Security**: bcrypt, httpOnly Cookies, Role-Based Authorization

### Frontend
- **Framework**: React v19
- **Build Tool**: Vite v8
- **Styling**: Tailwind CSS v3, PostCSS
- **Routing**: React Router DOM v7
- **HTTP Client**: Axios (with auto-refresh interceptors)
- **Icons**: Lucide React

---

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/vignesh1973-creator/staysphere.git
cd staysphere
```

### 2. Start the Backend
```bash
cd backend
npm install
```

Create a `.env` file inside `backend/`:
```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/bookmystay-api
ACCESS_TOKEN_SECRET=your_access_secret
REFRESH_TOKEN_SECRET=your_refresh_secret
NODE_ENV=development
```

```bash
npm run dev
```
> API will be running at `http://localhost:3000`

### 3. Start the Frontend
Open a new terminal:
```bash
cd frontend
npm install
npm run dev
```
> App will be running at `http://localhost:5173`

---

## 📄 Documentation

- 📘 [Backend API Documentation](./backend/README.md)
- 🖥️ [Frontend App Documentation](./frontend/README.md)

---

## 👤 Author

**Vignesh M**
- GitHub: [@vignesh1973-creator](https://github.com/vignesh1973-creator)
