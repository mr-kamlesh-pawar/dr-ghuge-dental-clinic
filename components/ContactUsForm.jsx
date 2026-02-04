"use client";
import React, { useState } from "react";
import { toast } from "sonner";
import { Phone, Mail, Instagram, Send, Clock } from "lucide-react";
import axios from "axios";
import { CONTACT_AUTOREPLY_EMAIL } from "@/model/emailTemplates";

const apiCall = async (data) => {
  await axios.post("http://localhost:3000/api/contact-us", data);
};

import Link from "next/link";
import ScrollAnimation from "./ScrollAnimation";

const ContactUsForm = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loding, setLoding] = useState(false);
  // ;

  const sendEmail = async (name, email) => {
    try {
      const response = await fetch("/api/send-reminder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: email,
          subject: "We’ve Got Your Message – Dr Rahul Ghuge's Dental Clinic",
          text: `Dear ${name || "Patient"}`,
          html: CONTACT_AUTOREPLY_EMAIL({ name }),
        }),
      });

      if (!response.ok) {
        console.error("Failed to send confirmation email");
      }
    } catch (error) {
      console.error("Error sending confirmation email:", error);
    }
  };

  const handleSubmit = (e) => {
    setLoding(true);
    e.preventDefault();
    const data = {
      name,
      phone,
      email,
      message,
    };
    apiCall(data);
    sendEmail(data.name, data.email);
    toast.success(`${data.name} We got Your Message! Thank you ❤️`);
    setName("");
    setEmail("");
    setPhone("");
    setMessage("");
    setLoding(false);
  };

  return (
    <div
      id="contact"
      className="w-full bg-white py-12 border-t border-gray-100"
    >
      <ScrollAnimation className="w-full px-6 md:px-12 lg:px-24">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-32">
          <div className="lg:w-1/3 space-y-12">
            <div className="space-y-4">
              <h2 className="text-4xl font-bold text-gray-900 font-serif">
                Get in touch
              </h2>
              <p className="text-gray-500 text-lg">
                We&apos;re here to answer any questions you may have about our
                dental services.
              </p>
            </div>

            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <Phone className="w-6 h-6 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-400 font-medium uppercase tracking-widest">
                    Phone
                  </p>
                  <a
                    href="tel:7972933329"
                    className="text-xl font-medium text-gray-900 hover:underline"
                  >
                    +91 7972933329
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Mail className="w-6 h-6 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-400 font-medium uppercase tracking-widest">
                    Email
                  </p>
                  <a
                    href="mailto:soma3344@gmail.com"
                    className="text-xl font-medium text-gray-900 hover:underline"
                  >
                    doctor@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Instagram className="w-6 h-6 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-400 font-medium uppercase tracking-widest">
                    Instagram
                  </p>
                  <a
                    href="https://instagram.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xl font-medium text-gray-900 hover:underline"
                  >
                    @DrRahulGhugeDentalClinic
                  </a>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-6 uppercase tracking-widest">
                Hospitals Hours
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between text-gray-600">
                  <span className="flex items-center gap-2">
                    <Clock className="w-4 h-4" /> Miraj Branch
                  </span>
                  <span>9:00 AM – 2:00 PM</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span className="flex items-center gap-2">
                    <Clock className="w-4 h-4" /> Bedag Branch
                  </span>
                  <span>4:00 PM – 9:00 PM</span>
                </div>
              </div>
            </div>
          </div>

          {/* form */}

          <div className="lg:w-2/3">
            <form onSubmit={handleSubmit} className="space-y-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="group relative">
                  <label
                    htmlFor="name"
                    className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 transition-colors group-focus-within:text-gray-900"
                  >
                    Your Name
                  </label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    id="name"
                    type="text"
                    required
                    placeholder="Abhishek Jadhav"
                    className="w-full bg-transparent border-b border-gray-200 py-3 outline-none focus:border-gray-900 transition-colors placeholder:text-gray-200 text-lg"
                  />
                </div>
                <div className="group relative">
                  <label
                    htmlFor="phone"
                    className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 transition-colors group-focus-within:text-gray-900"
                  >
                    Phone Number
                  </label>
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    id="phone"
                    type="tel"
                    required
                    placeholder="+91 00000 00000"
                    className="w-full bg-transparent border-b border-gray-200 py-3 outline-none focus:border-gray-900 transition-colors placeholder:text-gray-200 text-lg"
                  />
                </div>
              </div>

              <div className="group relative">
                <label
                  htmlFor="email"
                  className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 transition-colors group-focus-within:text-gray-900"
                >
                  Email Address
                </label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  id="email"
                  type="email"
                  required
                  placeholder="hello@example.com"
                  className="w-full bg-transparent border-b border-gray-200 py-3 outline-none focus:border-gray-900 transition-colors placeholder:text-gray-200 text-lg"
                />
              </div>

              <div className="group relative">
                <label
                  htmlFor="message"
                  className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 transition-colors group-focus-within:text-gray-900"
                >
                  How can we help?
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  id="message"
                  required
                  rows="4"
                  placeholder="I'd like to book an appointment for..."
                  className="w-full bg-transparent border-b border-gray-200 py-3 outline-none focus:border-gray-900 transition-colors placeholder:text-gray-200 text-lg resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={loding}
                className="group inline-flex items-center gap-3 bg-teal-900 cursor-pointer text-white px-12 py-5 rounded-full font-bold hover:bg-teal transition-all duration-300"
              >
                {loding ? "sending..." : " Send Message"}
                <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
            </form>
          </div>
        </div>
      </ScrollAnimation>
    </div>
  );
};

export default ContactUsForm;
