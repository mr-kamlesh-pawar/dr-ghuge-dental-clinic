This is a [Next.js](https://nextjs.org) project optimized for Dr. Rahul Ghuge's Dental Clinic.

## Features
- **Responsive Design**: Mobile-first approach with smooth animations.
- **Appointment Booking**: Integrated booking form with email notifications (mocked).
- **Admin Panel**: Dashboard to manage appointments and uploaded reports.
- **SEO Optimized**: Comprehensive metadata, sitemap, and robots.txt.
- **Performance**: Optimized images and lazy loading.

## Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   Create a `.env.local` file in the root directory:
   ```env
   JWT_SECRET=your_secure_random_string_here
   ```

3. **Run Development Server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to see the result.

## Building for Production

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Start production server**
   ```bash
   npm start
   ```

## Deployment

This app is ready for deployment on [Vercel](https://vercel.com/new).
- Push the code to GitHub.
- Import project in Vercel.
- Add `JWT_SECRET` in Vercel Environment Variables.
- Deploy!

## Directory Structure
- `/app`: App Router pages and API routes.
- `/components`: Reusable UI components.
- `/lib`: Helper functions and mock data.
- `/public`: Static assets (images).

## Learn More
- [Next.js Documentation](https://nextjs.org/docs)

