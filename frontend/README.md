# StaySphere Frontend Web App

A premium, responsive, and interactive accommodation booking platform user interface built with **React**, **Vite**, **Tailwind CSS**, and **Lucide Icons**. It connects seamlessly with the StaySphere Backend API using secure cookie-based session management, and includes custom state management contexts and a light/dark theme system.

---

## Features

### 🔍 Discovery & Search
*   **Dynamic Stays Exploration**: Search and filter properties by location.
*   **Price Range Filters**: Narrow down accommodations based on minimum and maximum nightly rates.
*   **Visual Grid Cards**: Responsive grid layouts featuring high-quality images, locations, price tags, and hover animations.

### 🔒 Secure Auth Client
*   **Login & Register Forms**: Full client-side validated user registration and login.
*   **Session Guarding**: Protected routes for profile, booking dashboards, and host panels.
*   **Silent Token Refresh**: Axios interceptors that automatically catch expired access tokens and query the backend refresh endpoint under the hood.

### 📅 Booking & Trips Console
*   **Property Detail Page**: Complete listing description, location indicators, and host contacts.
*   **Interactive Booking Widget**: Date inputs and night counters that check for overlap conflicts before booking.
*   **My Bookings Page**: A clean traveler panel tracking reservation summaries, checkout dates, and active vs. cancelled reservation logs.

### 💼 Host Dashboard (Host Console)
*   **Performance Metrics**: Track Total Listings, Active Bookings, and cumulative Host Earnings at a glance.
*   **Listing CRUD Panel**: Create, update, and delete property listings with real-time feedback.
*   **Reservation Trackers**: View logs of travelers booking host properties, complete with total prices, customer emails, and scheduling calendars.

### 👤 Profile Center
*   **Profile Editor**: Customize name, avatar links, gender, phone number, and bio.
*   **Become a Host**: Click-to-upgrade account permission system that unlocks the Host Console.

### 🎨 Theme Customization
*   **Premium Dark Mode**: Tailored dark backgrounds, purple radial glow accents, and high-contrast typography.
*   **Clean Light Mode**: High-contrast slate/black text, soft gray panels, and readable margins complying with modern accessibility standards.

---

## Tech Stack

*   **Core**: React v19, React DOM
*   **Build Tool**: Vite v8
*   **Routing**: React Router DOM v7
*   **Styling**: Tailwind CSS v3, PostCSS, Autoprefixer
*   **Icons**: Lucide React
*   **API Requests**: Axios (with response interceptors for cookie rotation)

---

## Project Structure

```
frontend/
│
├── public/                 # Static assets (favicons, manifest)
│
├── src/
│   ├── assets/             # Brand images and default visual assets
│   │
│   ├── components/         # Reusable structural components
│   │   ├── ConfirmationModal.jsx
│   │   ├── ListingCard.jsx
│   │   └── Navbar.jsx
│   │
│   ├── context/            # Global React Context providers
│   │   ├── AuthContext.jsx
│   │   └── ThemeContext.jsx
│   │
│   ├── pages/              # Routed page-level layouts
│   │   ├── Auth.jsx
│   │   ├── Bookings.jsx
│   │   ├── Home.jsx
│   │   ├── HostDashboard.jsx
│   │   ├── ListingDetail.jsx
│   │   └── Profile.jsx
│   │
│   ├── utils/              # Utility files & configuration clients
│   │   └── api.js          # Axios client + refresh interceptor
│   │
│   ├── App.css             # Main styling rules overrides
│   ├── App.jsx             # Root layout and route declarations
│   ├── index.css           # Tailwind imports + glassmorphic base layer
│   └── main.jsx            # DOM injection entrypoint
│
├── index.html              # HTML shell template
├── postcss.config.js       # PostCSS plugins config
├── tailwind.config.js      # Tailwind configurations & colors
└── vite.config.js          # Vite plugins & port maps
```

---

## Installation & Setup

### 1. Prerequisites
Ensure you have **Node.js** (v18+) and **npm** installed. The StaySphere Backend API should be running on `http://localhost:3000`.

### 2. Install Dependencies
Move into the frontend workspace and install packages:
```bash
cd frontend
npm install
```

### 3. Start Development Server
Launch Vite in watch mode:
```bash
npm run dev
```
The application will run locally on `http://localhost:5173/`.

### 4. Create Production Build
To bundle the frontend assets for deployment:
```bash
npm run build
```
The optimized bundle will be compiled inside the `/dist` directory.

---

## Future Enhancements
*   **Image File Uploads**: Direct dropzones to upload listing images to cloud providers (e.g. Cloudinary, AWS S3) instead of relying on URL inputs.
*   **Property Categories**: Filtering listings by stay types (e.g. Cabins, Beachfront, Apartments).
*   **Wishlists**: Save and track favorite listings under traveller profiles.
*   **Reviews & Ratings**: Add review logs to listing detail cards.
