"use client";
import { GiHamburgerMenu } from "react-icons/gi";

import Link from "next/link";
import { useState, useEffect } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

const navLinks = [
  { name: "Home", id: "home", href: "/" },
  { name: "Services", id: "servicesSection", href: "/#servicesSection" },
  { name: "Reviews", id: "ReviewsSection", href: "/#ReviewsSection" },
  { name: "About Us", id: "aboutSection", href: "/#aboutSection" },
  { name: "FAQ", id: "FaqSection", href: "/#FaqSection" },
  { name: "Contact", id: "contactSection", href: "/#contactSection" },
];

export function NavigationBar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const pathname = usePathname();
  const router = useRouter();
  const isHome = pathname === "/";
  const isAdminRequest = pathname.startsWith("/admin-panel") || pathname.startsWith("/admin-login");

  if (isAdminRequest) return null;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Active Section Observer
  useEffect(() => {
    if (!isHome) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-20% 0px -60% 0px",
        threshold: 0.1,
      }
    );

    navLinks.forEach((link) => {
      if (link.id) {
        const element = document.getElementById(link.id);
        if (element) observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [isHome]);

  // Handle scroll after navigation from other pages
  useEffect(() => {
    if (isHome && window.location.hash) {
      const id = window.location.hash.substring(1);
      setTimeout(() => {
        smoothScrollTo(id);
      }, 100);
    }
  }, [isHome]);

  const smoothScrollTo = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
      
      window.history.pushState(null, "", `#${id}`);
    }
  };

  const handleLinkClick = (e, id) => {
    e.preventDefault();
    setOpen(false);
    
    if (!id || id === "home") {
      if (isHome) {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        router.push("/");
      }
      return;
    }

    if (!isHome) {
      // Use Next.js router for client-side navigation (no refresh)
      router.push(`/#${id}`);
      return;
    }

    // Smooth scroll on same page
    smoothScrollTo(id);
    setActiveSection(id);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-500 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-lg"
          : "bg-white shadow-sm"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={(e) => handleLinkClick(e, 'home')}
            className="flex justify-center items-center focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg"
            aria-label="Go to home"
          >
            <Image
              src="/logo1.png"
              alt="Dr Rahul Ghuge's Dental Clinic Logo"
              width={150}
              height={80}
              className="h-12 w-auto"
              priority
            />
          </button>
        </div>

        <div className="hidden md:flex items-center gap-8 text-base font-medium text-gray-700">
          {navLinks.map((link) => {
            const isActive = isHome && activeSection === link.id;
            
            return (
              <button
                key={link.name}
                onClick={(e) => handleLinkClick(e, link.id)}
                className={`transition-all relative hover:text-blue-600 py-2 focus:outline-none  rounded px-2 ${
                  isActive ? "text-blue-600 font-semibold" : ""
                }`}
              >
                {link.name}
                {isActive && (
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
                )}
              </button>
            );
          })}
          <Link
            href="/appointment-status"
            className={`transition hover:text-blue-600 py-2 px-2 ${
              pathname === "/appointment-status" ? "text-blue-600 font-semibold" : ""
            }`}

            
          >
            Check Report

            
          </Link>
          
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/book-appointment"
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-base font-semibold text-white hover:bg-blue-700 hover:scale-105 transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Book Appointment
          </Link>

          <button
            onClick={() => setOpen(!open)}
            className="md:hidden rounded-lg text-3xl p-2 text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            <GiHamburgerMenu />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden border-t bg-white px-6 py-4 shadow-xl">
          <div className="flex flex-col gap-3 text-base font-medium text-gray-700">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={(e) => handleLinkClick(e, link.id)}
                className={`transition hover:text-blue-600 text-left py-2 px-3 rounded hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isHome && activeSection === link.id ? "text-blue-600 font-semibold bg-blue-50" : ""
                }`}
              >
                {link.name}
              </button>
            ))}
            <Link
              href="/appointment-status"
              onClick={() => setOpen(false)}
              className={`transition hover:text-blue-600 py-2 px-3 rounded hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                pathname === "/appointment-status" ? "text-blue-600 font-semibold bg-blue-50" : ""
              }`}
            >
              Check Report
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}