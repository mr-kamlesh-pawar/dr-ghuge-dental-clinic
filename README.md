# Dr. Rahul Ghuge's Dental Clinic Management System

![Project Status](https://img.shields.io/badge/status-production--ready-green)
![Next.js](https://img.shields.io/badge/Next.js-14.0-black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-blue)
![Appwrite](https://img.shields.io/badge/Appwrite-Backend-red)

A comprehensive, production-grade web application designed for **Dr. Rahul Ghuge's Dental Clinic**. This system integrates a modern, responsive public-facing website with a robust administrator panel for managing appointments, patient records, and clinic operations.

## 🚀 Project Overview

This project serves two primary functions:
1.  **Patient Experience:** A seamless interface for patients to explore services, view testimonials, and book appointments online.
2.  **Clinic Administration:** A secure, feature-rich dashboard for clinic staff to manage the entire appointment lifecycle, track patient history, and handle administrative inquiries.

Built with **Next.js 14**, the application leverages **Server-Side Rendering (SSR)** for SEO optimization and **Client-Side Rendering (CSR)** for dynamic interactions, ensuring high performance across all devices.

## ✨ Key Features

### 🏥 Public Interface (Patient Portal)
-   **Appointment Booking Engine:**
    -   Streamlined multi-step booking form.
    -   Real-time validations for dates and services.
    -   Instant confirmation feedback.
-   **Patient Services:**
    -   **Report Retrieval:** Secure portal for patients to download their dental reports using their appointment ID.
    -   **Interactive Reviews:** Dynamic testimonial section powered by real patient feedback.
    -   **Service Showcase:** Detailed information on treatments (Root Canals, Implants, etc.).
-   **Responsive Design:** optimized for mobile, tablet, and desktop views using Tailwind CSS.
-   **SEO Optimized:** Meta tagging, semantic HTML, and fast loading times for better search engine visibility.

### 🛡️ Admin Dashboard (Secure)
-   **Waitlist & Appointment Management:**
    -   **Kanban/List View:** Track appointments by status (`Pending`, `Confirmed`, `Completed`, `Cancelled`, `No Show`).
    -   **Advanced Filtering:** Filter by date range, status, or search by patient name/phone.
    -   **Actionable Insights:** Quick actions to Confirm, Reschedule, or Cancel appointments.
-   **Communication Hub:**
    -   **Automated Emails:** Integration for sending appointment confirmations and reminders.
    -   **Contact Inquiries:** Centralized inbox for website contact form submissions.
-   **Security & Access Control:**
    -   **Role-Based Access:** Secure Admin login protected by **JWT (JSON Web Tokens)**.
    -   **Password Security:** Industry-standard **Bcrypt hashing** for credential storage.
    -   **Admin Management:** Capability to invite new admins and manage secure password updates.

## 🛠️ Technology Stack

### Core Framework
-   **[Next.js 14](https://nextjs.org/):** React framework for production (App Router architecture).
-   **[React 18](https://react.dev/):** Library for building user interfaces.

### Styling & UI
-   **[Tailwind CSS](https://tailwindcss.com/):** Utility-first CSS framework for rapid UI development.
-   **[Lucide React](https://lucide.dev/):** Beautiful & consistent icon set.
-   **[Sonner](https://sonner.emilkowal.ski/):** An opinionated toast notification component.

### Backend & Database
-   **[Appwrite](https://appwrite.io/):** Open-source backend as a service (BaaS) for Database, Auth, and Storage.
    -   Used for storing Appointments, Users (Admins), Contact Messages, and Reviews.
-   **Node.js SDK:** For server-side interactions with Appwrite.

### Security
-   **JWT:** Stateless authentication mechanism for API routes and Admin Panel.
-   **Bcrypt:** Library for hashing and salting passwords.
-   **JS-Cookie:** Secure client-side cookie management.

### Utilities
-   **Date-fns:** Modern date utility library.
-   **React Fast Marquee:** For the smooth scrolling reviews section.

## 📂 Project Structure

```bash
Ghuges-Dental-Clinic/
├── app/                        # Next.js App Router Directory
│   ├── admin-login/            # Admin Authentication Page
│   ├── admin-panel/            # Protected Admin Dashboard
│   ├── api/                    # Server-side API Routes (Backend)
│   │   ├── admin/              # Admin management endpoints
│   │   ├── auth/               # Login & Token generation
│   │   ├── book-appointment/   # CRUD for Appointments
│   │   └── verify/             # Token verification middleware
│   ├── appointment-status/     # Patient Report Status Page
│   └── book-appointment/       # Public Booking Page
├── components/                 # Reusable UI Components
│   ├── admin_models/           # Admin-specific components (Sidebar, Tables)
│   └── ...                     # General components (NavBar, Footer, Reviews)
├── lib/                        # Utility libraries (Appwrite config, helpers)
├── public/                     # Static assets (Images, Logos)
└── ...                         # Config files
```

## 🚀 Getting Started

Follow these instructions to set up the project locally for development.

### Prerequisites
-   **Node.js** (v18.0.0 or higher)
-   **npm** or **yarn**
-   **Appwrite Instance** (Cloud or Self-hosted)

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/ghuges-dental-clinic.git
cd ghuges-dental-clinic
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
```

### 3. Environment Configuration
Create a `.env.local` file in the root directory and configure the following variables:

```env
# Appwrite Configuration
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_project_id
APPWRITE_API_KEY=your_secret_api_key
APPWRITE_DATABASE_ID=your_database_id

# Collection IDs
APPWRITE_COLLECTION_APPOINTMENTS=your_appointment_collection_id
APPWRITE_COLLECTION_USERS=your_users_collection_id
APPWRITE_COLLECTION_CONTACTS=your_contacts_collection_id
APPWRITE_COLLECTION_REVIEWS=your_reviews_collection_id

# Security
JWT_SECRET=your_super_secret_jwt_key
```

### 4. Database Setup (Appwrite)
Ensure your Appwrite database has the following collections with appropriate attributes:
-   **Appointments:** `name`, `phone`, `email`, `status`, `preferred_date`, `preferred_time`, `service_name`, `appointment_id`
-   **Users:** `username`, `password`, `role`
-   **Reviews:** `patientname`, `comment`, `rating`, `service`

### 5. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🔒 Security Best Practices
-   **Environment Variables:** Sensitive keys (API Secrets, JWT Secrets) are never exposed to the client. (`NEXT_PUBLIC_` prefix is used only for public endpoints).
-   **Input Validation:** Both Client-side and Server-side validation are implemented for all forms.
-   **Secure Headers:** API routes include cache-control headers to prevent stale data.

## 🤝 Contributing
1.  Fork the repository.
2.  Create a feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

---

**Developed for Dr. Rahul Ghuge**
