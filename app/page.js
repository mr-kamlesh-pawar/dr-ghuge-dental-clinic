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
  return (
    <>
      <Hero />
      <HospitalImageGallery />
      
      <ScrollAnimation id="servicesSection" className="text-center mb-12">
        <h2 className="text-4xl font-bold text-blue-900 font-serif">
          Our Services
        </h2>
        <div className="w-24 h-1 bg-cyan-500 mx-auto mt-4 rounded-full"></div>
      </ScrollAnimation>
      <ServiceCard />

      <BeforeAfterSlider />


      
      <AppointmentWizard />

      <ScrollAnimation id="ReviewsSection" className="text-center mb-12">
        <h2 className="text-4xl font-bold text-blue-900 font-serif">Reviews</h2>
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
        <h2 className="text-4xl font-bold text-blue-900 font-serif">FAQ</h2>
        <div className="w-24 h-1 bg-cyan-500 mx-auto mt-4 rounded-full"></div>
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
