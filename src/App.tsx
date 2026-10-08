import React, { useState } from 'react';
import { SchoolProvider, useSchool } from './context/SchoolContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HomePage } from './components/pages/HomePage';
import { MissionPage } from './components/pages/MissionPage';
import { VisionPage } from './components/pages/VisionPage';
import { GalleryPage } from './components/pages/GalleryPage';
import { ContactPage } from './components/pages/ContactPage';
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { Lightbox } from './components/common/Lightbox';
import { ToastContainer } from './components/common/Toast';
import { FloatingHelpWidget } from './components/common/FloatingHelpWidget';

const AppContent: React.FC = () => {
  const { activePage, setActivePage, schoolData, isAdminLoggedIn } = useSchool();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const handleOpenLightbox = (index: number) => {
    setLightboxIndex(index);
  };

  const handleCloseLightbox = () => {
    setLightboxIndex(null);
  };

  // Structured Data Schema (JSON-LD) for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: schoolData.settings.schoolName || 'Bright Star College',
    description: 'Premier private school in Lekki, Lagos, Nigeria providing qualitative education, character development, and academic excellence.',
    address: {
      '@type': 'PostalAddress',
      streetAddress: schoolData.settings.address,
      addressLocality: 'Lekki',
      addressRegion: 'Lagos State',
      addressCountry: 'NG',
    },
    telephone: schoolData.settings.phonePlaceholder,
    email: schoolData.settings.emailPlaceholder,
  };

  const isCurrentAdminPage = activePage === 'admin';
  const isCurrentLoginPage = activePage === 'admin-login';

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-800 selection:bg-blue-600 selection:text-white">
      {/* Inject JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Main Public Navbar (hidden inside Admin Console for focused workspace) */}
      {!isCurrentAdminPage && (
        <Navbar onOpenAdminLogin={() => setActivePage('admin-login')} />
      )}

      {/* Main Content Router */}
      <main className="flex-1">
        {activePage === 'home' && (
          <HomePage onOpenLightbox={handleOpenLightbox} />
        )}
        {activePage === 'mission' && <MissionPage />}
        {activePage === 'vision' && <VisionPage />}
        {activePage === 'gallery' && (
          <GalleryPage onOpenLightbox={handleOpenLightbox} />
        )}
        {activePage === 'contact' && <ContactPage />}
        {activePage === 'admin-login' && (
          <AdminLogin onBackToHome={() => setActivePage('home')} />
        )}
        {activePage === 'admin' && (
          isAdminLoggedIn ? (
            <AdminDashboard />
          ) : (
            <AdminLogin onBackToHome={() => setActivePage('home')} />
          )
        )}
      </main>

      {/* Footer on Public Pages */}
      {!isCurrentAdminPage && !isCurrentLoginPage && (
        <Footer onOpenAdminLogin={() => setActivePage('admin-login')} />
      )}

      {/* Fullscreen Photo Lightbox Modal */}
      {lightboxIndex !== null && schoolData.gallery.length > 0 && (
        <Lightbox
          images={schoolData.gallery}
          currentIndex={lightboxIndex}
          onClose={handleCloseLightbox}
          onNavigate={(newIdx) => setLightboxIndex(newIdx)}
        />
      )}

      {/* System Toast Alerts */}
      <ToastContainer />

      {/* Floating School WhatsApp & AI Assistant Widget */}
      {!isCurrentAdminPage && <FloatingHelpWidget />}
    </div>
  );
};

export default function App() {
  return (
    <SchoolProvider>
      <AppContent />
    </SchoolProvider>
  );
}
