import { Arimo } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { NavigationBar } from "@/components/NavBar";
import ScrollToTop from "@/components/ScrollToTop";

const arimo = Arimo({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

export const metadata = {
  title: {
    default: "Dr Rahul Ghuge's Dental Clinic | Expert Dentist in Akurdi",
    template: "%s | Dr Rahul Ghuge's Dental Clinic",
  },
  description:
    "Experience top-tier dental care at Dr Rahul Ghuge's Dental Clinic in Akurdi and Miraj. We offer Root Canals, Implants, Braces, and Cosmetic Dentistry with a gentle touch.",
  keywords: [
    "Dentist in Akurdi",
    "Dental Clinic Pimpri Chinchwad",
    "Dr Rahul Ghuge",
    "Root Canal Treatment",
    "Dental Implants",
    "Cosmetic Dentistry",
    "Best Dentist in Akurdi",
    "Emergency Dentist Pune",
  ],
  authors: [{ name: "Dr. Rahul Ghuge" }],
  creator: "Dr. Rahul Ghuge",
  metadataBase: new URL("https://www.drrahulghugedental.com"), // Placeholder URL, update if user provides real domain
  openGraph: {
    title: "Dr Rahul Ghuge's Dental Clinic | Modern & Gentle Dental Care",
    description:
      "Comprehensive dental services including implants, root canals, and smile makeovers in Akurdi and Miraj.",
    url: "https://www.drrahulghugedental.com",
    siteName: "Dr Rahul Ghuge's Dental Clinic",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/clinic.png", // Ensure this image exists in public folder
        width: 1200,
        height: 630,
        alt: "Dr Rahul Ghuge's Dental Clinic Interior",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dr Rahul Ghuge's Dental Clinic",
    description: "Expert dental care in Akurdi. Book your appointment today!",
    images: ["/clinic.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={arimo.className}>
        <NavigationBar/>
        {children}
       
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
