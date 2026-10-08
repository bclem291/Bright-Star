import { SchoolData } from '../types';

export const initialSchoolData: SchoolData = {
  settings: {
    schoolName: "BRIGHT STAR COLLEGE",
    tagline: "Building Bright Minds for a Brighter Future",
    motto: "Excellence · Integrity · Discipline",
    logoUrl: "", // Empty: uses the professional text-based 'BSC' crest badge
    address: "Lekki Peninsula Corridor",
    cityState: "Lekki, Lagos State",
    country: "Nigeria",
    phonePlaceholder: "+234 (0) 800 000 0000 / +234 (0) 801 234 5678",
    emailPlaceholder: "info@brightstarcollege.ng / admissions@brightstarcollege.ng",
    whatsappNumber: "+2348000000000",
    officeHours: "Monday – Friday: 7:30 AM – 4:30 PM",
    mapQuery: "Lekki, Lagos, Nigeria",
    socialLinks: {
      // Intentionally empty until official school accounts are configured
      facebook: "",
      instagram: "",
      twitter: "",
      linkedin: "",
      youtube: ""
    },
    footerCopyright: `© ${new Date().getFullYear()} Bright Star College. All Rights Reserved.`
  },
  home: {
    heroTitle: "Building Bright Minds for a Brighter Future",
    heroSubtitle: "Providing qualitative education in a nurturing, disciplined, and technologically enriched learning environment in Lekki, Lagos. Empowering young leaders for global relevance and personal integrity.",
    heroCtaPrimary: "LEARN MORE",
    heroCtaSecondary: "CONTACT US",
    heroImageUrl: "https://i.ibb.co/PvLmXqc3/312891.jpg",
    aboutTitle: "Welcome to Bright Star College",
    aboutSubtitle: "Dedicated to Academic Distinction and Moral Integrity",
    aboutContent: "Bright Star College, Lekki, Lagos is committed to providing quality education, developing confident learners, and preparing students for future success. In a rapidly evolving world, we combine rigorous academic foundations with sound character formation, moral discipline, and 21st-century problem-solving capabilities. Our school community fosters curiosity, mutual respect, and high personal standards, ensuring that every learner discovers their unique potential.",
    aboutHighlights: [
      "Rigorous British and Nigerian national curriculum integration",
      "Disciplined, secure, and serene learning environment in Lekki",
      "Emphasis on character formation, civic responsibility, and moral leadership",
      "Individualized student support and comprehensive pastoral care",
      "Modern science, ICT, and creative arts learning facilities"
    ],
    features: [
      {
        id: "feat-1",
        title: "Quality Education",
        description: "A well-rounded academic curriculum blending Nigerian and international standards designed to ignite intellectual curiosity and mastery.",
        iconName: "GraduationCap"
      },
      {
        id: "feat-2",
        title: "Experienced Educators",
        description: "Passionate, certified teachers and subject matter specialists committed to nurturing every learner's cognitive and personal growth.",
        iconName: "Users"
      },
      {
        id: "feat-3",
        title: "Safe Learning Environment",
        description: "A secure, modern, and supportive campus designed to safeguard our students' physical well-being and emotional development.",
        iconName: "ShieldCheck"
      },
      {
        id: "feat-4",
        title: "Character Development",
        description: "Instilling timeless values of integrity, empathy, personal discipline, and respect across all curricular and extracurricular activities.",
        iconName: "HeartHandshake"
      },
      {
        id: "feat-5",
        title: "Modern Learning Approach",
        description: "Practical STEM laboratories, digital literacy, and collaborative classroom methodologies preparing students for the 21st century.",
        iconName: "Sparkles"
      },
      {
        id: "feat-6",
        title: "Student-Centred Education",
        description: "Prioritising each child's individual pace, strengths, and talents through attentive mentoring and tailored enrichment.",
        iconName: "Award"
      }
    ],
    contactCtaTitle: "Give Your Child a Bright Future",
    contactCtaSubtitle: "Enrollment inquiries and campus visit reservations for Bright Star College are now open. Speak with our admissions team today."
  },
  mission: {
    title: "Our Mission",
    leadStatement: "To cultivate an inspiring, disciplined, and inclusive educational atmosphere where every child attains academic excellence, demonstrates moral integrity, and develops critical thinking skills to positively impact their community and the world.",
    fullContent: "At Bright Star College, our mission is rooted in the belief that education is the foundation for individual empowerment and societal progress. We exist to deliver comprehensive education that stimulates intellectual rigor, moral uprightness, creative inquiry, and civic responsibility. We partner closely with parents and guardians to guide students into becoming resilient, ethical, and self-motivated global citizens who lead with honour and purpose.",
    pillars: [
      {
        title: "Academic Excellence",
        description: "Challenging every student to achieve their highest intellectual potential through conceptual understanding and disciplined study habits."
      },
      {
        title: "Character & Discipline",
        description: "Cultivating respect, punctuality, integrity, and personal accountability as daily core habits of mind."
      },
      {
        title: "Creativity & Critical Thinking",
        description: "Encouraging learners to question constructively, analyse critically, and innovate creative solutions to real-world challenges."
      },
      {
        title: "Responsible Citizenship",
        description: "Instilling deep appreciation for community service, cultural diversity, and responsible contribution to Nigerian society and the wider world."
      },
      {
        title: "Future Readiness",
        description: "Equipping learners with digital literacy, communication dexterity, and adaptability essential for higher education and future careers."
      }
    ],
    lastUpdated: new Date().toLocaleDateString('en-GB')
  },
  vision: {
    title: "Our Vision",
    leadStatement: "To be a benchmark of educational distinction in Lagos and Nigeria, renowned for raising confident, creative, and principled leaders poised to excel on both national and international stages.",
    fullContent: "Our vision is to build an enduring citadel of learning where students are transformed into independent thinkers, ethical problem solvers, and lifelong scholars. We envision a community where tradition and innovation meet—where high academic standards coexist harmoniously with compassionate character building, producing graduates who stand as beacons of hope and excellence wherever they go.",
    coreOutcomes: [
      {
        title: "Confident Learners",
        description: "Students who trust in their abilities, articulate their perspectives with poise, and approach unfamiliar challenges without fear."
      },
      {
        title: "Responsible Citizens",
        description: "Individuals who value community welfare, show empathy toward others, and uphold ethical principles in all actions."
      },
      {
        title: "Future Leaders",
        description: "Visionary thinkers equipped with moral clarity, teamwork capabilities, and the resilience to guide others constructively."
      },
      {
        title: "Creative Thinkers",
        description: "Inventive minds capable of thinking outside conventional boundaries, synthesising ideas, and pioneering resourceful solutions."
      },
      {
        title: "Lifelong Learners",
        description: "Graduates possessing insatiable intellectual curiosity, self-discipline, and a persistent drive for continual self-improvement."
      }
    ],
    lastUpdated: new Date().toLocaleDateString('en-GB')
  },
  gallery: [], // Initial state: strictly no random stock images! Ready for administrator upload
  videos: []   // Initial state: strictly no random YouTube videos! Ready for administrator upload
};
