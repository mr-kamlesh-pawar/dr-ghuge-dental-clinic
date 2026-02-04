
// Mock Data Store for Ghuges Dental Clinic

export const mockServices = [
  {
    id: 1,
    name: "Root Canal Treatment",
    category: "Endodontics",
    description: "Save your natural tooth with our painless root canal treatment using advanced techniques.",
    image_url: "/images/service/image.png",
    is_active: true,
    display_order: 1,
  },
  {
    id: 2,
    name: "Teeth Whitening",
    category: "Cosmetic Dentistry",
    description: "Brighten your smile with our professional teeth whitening services for a confident look.",
   image_url: "/images/service/image.png",
    is_active: true,
    display_order: 2,
  },
  {
    id: 3,
    name: "Dental Implants",
    category: "Implantology",
    description: "Permanent solution for missing teeth with natural-looking and durable implants.",
image_url: "/images/service/image.png",
    is_active: true,
    display_order: 3,
  },
  {
    id: 4,
    name: "Orthodontic Braces",
    category: "Orthodontics",
    description: "Straighten your teeth with traditional or invisible braces for a perfect smile.",
  image_url: "/images/service/image.png",
    is_active: true,
    display_order: 4,
  },
  {
    id: 5,
    name: "Teeth Cleaning & Scaling",
    category: "Preventive Care",
    description: "Professional dental cleaning to remove plaque, tartar and maintain oral hygiene.",
    image_url: "/images/service/image.png",
    is_active: true,
    display_order: 5,
  },
  {
    id: 6,
    name: "Tooth Extraction",
    category: "Oral Surgery",
    description: "Safe and painless tooth extraction with proper care and post-treatment guidance.",
    image_url: "/images/service/service-2.png",
    is_active: true,
    display_order: 6,
  },
  {
    id: 7,
    name: "Dental Crowns & Bridges",
    category: "Restorative Dentistry",
    description: "Restore damaged or missing teeth with high-quality crowns and bridges.",
    image_url: "/images/service/service-1.png",
    is_active: true,
    display_order: 7,
  },
  {
    id: 8,
    name: "Pediatric Dentistry",
    category: "Children's Dental Care",
    description: "Specialized dental care for children in a friendly and comfortable environment.",
    image_url: "/images/service/image.png",
    is_active: true,
    display_order: 8,
  },
];

export const mockUsers = [
  {
    id: 1,
    username: "admin",
    password: "password123", // Simple plain text for mock auth
    role: "admin",
    password_hash: "$2b$10$YourMockHashHere", // Kept structure if needed, but we will check plain text or mock hash
  },
];

export const mockAppointments = [
  {
    id: 1,
    name: "John Doe",
    phone: "9876543210",
    email: "john@example.com",
    service_name: "Root Canal Treatment",
    preferred_date: "15 Oct 2023",
    preferred_time: "10:00 AM",
    status: "Pending",
    notes: "First visit",
    created_at: new Date().toISOString(),
    appointment_id: "AABHA-PU-210-XYZA",
    at: "Pune",
  },
];

export const mockReviews = [
  {
    id: 1,
    patientname: "Priya Sharma",
    service: "Root Canal Treatment",
    rating: 5,
    comment: "Dr. Rahul Ghuge is extremely skilled and gentle. I was nervous about my root canal, but he made the entire process comfortable and pain-free. Highly recommended!",
    created_at: "2024-01-15T10:30:00Z",
  },
  {
    id: 2,
    patientname: "Amit Patil",
    service: "Dental Implant",
    rating: 5,
    comment: "Excellent service! The clinic is very clean and the staff is professional. Dr. Ghuge explained everything clearly before the procedure.",
    created_at: "2024-01-10T14:20:00Z",
  },
  {
    id: 3,
    patientname: "Sneha Deshmukh",
    service: "Teeth Whitening",
    rating: 5,
    comment: "Amazing results! My teeth look so much brighter. The doctor is very friendly and the 24-hour availability is a huge plus for emergencies.",
    created_at: "2024-01-08T16:45:00Z",
  },
  {
    id: 4,
    patientname: "Rajesh Kumar",
    service: "Tooth Extraction",
    rating: 4,
    comment: "Very professional service. The extraction was quick and painless. Great location near Akurdi railway station, easy to find.",
    created_at: "2024-01-05T11:15:00Z",
  },
  {
    id: 5,
    patientname: "Anjali Joshi",
    service: "General Checkup",
    rating: 5,
    comment: "Best dental clinic in Pimpri-Chinchwad! Dr. Ghuge is very knowledgeable and takes time to answer all questions. Highly satisfied!",
    created_at: "2024-01-03T09:00:00Z",
  },
  {
    id: 6,
    patientname: "Vikram Bhosale",
    service: "Braces Consultation",
    rating: 5,
    comment: "Wonderful experience from start to finish. The clinic uses modern equipment and the treatment plan was explained in detail. Thank you Dr. Ghuge!",
    created_at: "2023-12-28T13:30:00Z",
  },
  {
    id: 7,
    patientname: "Kavita Rane",
    service: "Cavity Filling",
    rating: 5,
    comment: "Painless treatment and very affordable. The staff is courteous and the clinic maintains high hygiene standards. Will definitely return!",
    created_at: "2023-12-20T15:00:00Z",
  },
  {
    id: 8,
    patientname: "Sanjay Pawar",
    service: "Dental Cleaning",
    rating: 4,
    comment: "Good service and convenient location. The 24-hour facility is perfect for working professionals like me. Recommend for quality dental care.",
    created_at: "2023-12-15T10:45:00Z",
  },
];

export const mockFaqs = [
  {
    id: 1,
    question: "How often should I visit the dentist?",
    answer: "It is recommended to visit the dentist every 6 months for a regular checkup and professional cleaning to maintain optimal oral health.",
  },
  {
    id: 2,
    question: "Is root canal treatment painful?",
    answer: "No, modern root canal treatments are virtually painless. We use advanced anesthesia techniques and the latest technology to ensure your comfort throughout the procedure.",
  },
  {
    id: 3,
    question: "How long does teeth whitening last?",
    answer: "Professional teeth whitening can last from 6 months to 2 years, depending on your oral hygiene habits and lifestyle choices like smoking or consuming staining foods and beverages.",
  },
  {
    id: 4,
    question: "Do you accept dental insurance?",
    answer: "Yes, we accept most major dental insurance plans. Please contact our office with your insurance details, and our team will help verify your coverage and benefits.",
  },
  {
    id: 5,
    question: "What are dental implants and how long do they last?",
    answer: "Dental implants are permanent tooth replacements made of titanium that fuse with your jawbone. With proper care and maintenance, they can last 20-30 years or even a lifetime.",
  },
  {
    id: 6,
    question: "Are you open for dental emergencies?",
    answer: "Yes, we are open 24 hours and provide emergency dental services. If you have a dental emergency like severe toothache, broken tooth, or trauma, contact us immediately.",
  },
  {
    id: 7,
    question: "At what age should my child first visit the dentist?",
    answer: "Children should have their first dental visit by their first birthday or within 6 months after their first tooth appears. Early visits help establish good oral health habits.",
  },
  {
    id: 8,
    question: "How much time does a typical dental appointment take?",
    answer: "A routine checkup and cleaning typically takes 30-60 minutes. More complex procedures like root canals or implants may require 1-2 hours or multiple visits depending on the treatment.",
  },
];

export const mockReports = [
  {
    id: 101,
    appointment_id: "AABHA-PU-210-XYZA",
    diagnosis: "Dental Caries",
    observations: "Cavity in lower left molar",
    treatment: "Root Canal",
    next_visit: "2023-11-01",
    created_at: new Date().toISOString(),
  },
];

export const mockMedicines = [
  {
    id: 1,
    report_id: 101,
    name: "Amoxicillin",
    dosage: "500mg twice a day",
  },
];

export const mockDocuments = [
  {
    id: 1,
    report_id: 101,
    name: "X-Ray",
    url: "/images/xray-sample.jpg",
    type: "image",
  },
];

export const mockContacts = [];
