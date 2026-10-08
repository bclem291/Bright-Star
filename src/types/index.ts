export interface GalleryItem {
  id: string;
  url: string; // Base64 data URL or uploaded path
  title: string;
  caption?: string;
  altText: string;
  uploadedAt: string;
  fileSize?: string;
  category?: string;
}

export interface VideoItem {
  id: string;
  title: string;
  url: string;
  source: 'youtube' | 'google-drive';
  embedUrl: string;
  description?: string;
  isFeatured?: boolean;
  createdAt: string;
}

export interface FeatureCard {
  id: string;
  title: string;
  description: string;
  iconName: string;
}

export interface ContactMessage {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  createdAt: string;
  isRead?: boolean;
}

export interface SchoolData {
  settings: {
    schoolName: string;
    tagline: string;
    motto: string;
    logoUrl?: string; // If undefined, renders text BSC badge
    address: string;
    cityState: string;
    country: string;
    phonePlaceholder: string;
    emailPlaceholder: string;
    whatsappNumber: string;
    officeHours: string;
    mapQuery: string;
    socialLinks: {
      facebook?: string;
      instagram?: string;
      twitter?: string;
      linkedin?: string;
      youtube?: string;
    };
    footerCopyright: string;
  };
  home: {
    heroTitle: string;
    heroSubtitle: string;
    heroCtaPrimary: string;
    heroCtaSecondary: string;
    heroImageUrl?: string;
    aboutTitle: string;
    aboutSubtitle: string;
    aboutContent: string;
    aboutHighlights: string[];
    features: FeatureCard[];
    contactCtaTitle: string;
    contactCtaSubtitle: string;
  };
  mission: {
    title: string;
    leadStatement: string;
    fullContent: string;
    pillars: {
      title: string;
      description: string;
    }[];
    lastUpdated: string;
  };
  vision: {
    title: string;
    leadStatement: string;
    fullContent: string;
    coreOutcomes: {
      title: string;
      description: string;
    }[];
    lastUpdated: string;
  };
  gallery: GalleryItem[];
  videos: VideoItem[];
}
