import AboutPage from "@/components/AboutPage";
import ContactUsForm from "@/components/ContactUsForm";
import Hero from "@/components/HeroSection";
import HospitalImageGallery from "@/components/HospitalGallery";
import ServiceCard from "@/components/ServiceCard";
import FAQComponent from "@/components/FaqS";
import ReviewsComponent from "@/components/Reviews";
import Footer from "@/components/Footer";
import ScrollAnimation from "@/components/ScrollAnimation";

import MapSection from "@/components/MapSection";

import BeforeAfterSlider from "@/components/BeforeAfterSlider";
import AppointmentWizard from "@/components/AppointmentWizard";

import EmergencyButton from "@/components/EmergencyButton";

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Dentist",
    "name": "Dr. Rahul Ghuge's Dental Clinic",
    "image": "https://www.drrahulghugedental.com/clinic.png", // Ensure this image matches a real asset or update path
    "url": "https://www.drrahulghugedental.com",
    "telephone": "+917972933329",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Near Akurdi Railway Station",
      "addressLocality": "Pimpri-Chinchwad",
      "addressRegion": "Maharashtra",
      "postalCode": "411035",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "18.6461",
      "longitude": "73.7661"
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        "opens": "09:00",
        "closes": "14:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        "opens": "16:00",
        "closes": "21:00"
      }
    ],
    "priceRange": "$$"
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero />
      <HospitalImageGallery />
      
      <ScrollAnimation id="servicesSection" className="text-center mb-12">
        <h2 className="text-4xl font-bold text-blue-900 font-serif pt-5">
          Our Services
        </h2>
        <div className="w-24 h-1 bg-cyan-500 mx-auto mt-4 rounded-full"></div>
      </ScrollAnimation>
      <ServiceCard />

      <BeforeAfterSlider />


      
      <AppointmentWizard />

      <ScrollAnimation id="ReviewsSection" className="text-center mb-8 ">
        <h2 className="text-4xl font-bold text-blue-900 font-serif mt-10 -mb-3">Reviews</h2>
        <div className="w-24 h-1 bg-cyan-500 mx-auto mt-4 rounded-full"></div>
      </ScrollAnimation>
      <ReviewsComponent />

      <ScrollAnimation id="aboutSection" className="text-center mb-12">
        <h2 className="text-4xl font-bold text-blue-900 font-serif">
          About Us
        </h2>
        <div className="w-24 h-1 bg-cyan-500 mx-auto mt-4 rounded-full"></div>
      </ScrollAnimation>
      <AboutPage />

      <ScrollAnimation id="FaqSection" className="text-center mb-12">
      
      </ScrollAnimation>
      <FAQComponent />

      <MapSection />

      <ScrollAnimation id="contactSection" className="text-center mb-12">
        <h2 className="text-4xl font-bold text-blue-900 font-serif">
          Contact Us
        </h2>
        <div className="w-24 h-1 bg-cyan-500 mx-auto mt-4 rounded-full"></div>
      </ScrollAnimation>
      <ContactUsForm />
      <Footer />
      
      <EmergencyButton />
    </>
  );
}
