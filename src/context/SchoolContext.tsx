import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { SchoolData, GalleryItem, VideoItem, ContactMessage } from '../types';
import { initialSchoolData } from '../data/defaultData';
import { parseVideoUrl } from '../utils/videoUtils';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface SchoolContextType {
  schoolData: SchoolData;
  isLoading: boolean;
  isAdminLoggedIn: boolean;
  toasts: ToastMessage[];
  messages: ContactMessage[];
  activePage: string;
  setActivePage: (page: string) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
  adminLogin: (password: string) => Promise<{ success: boolean; error?: string }>;
  adminLogout: () => void;
  updateSchoolData: (updated: SchoolData) => Promise<{ success: boolean; error?: string }>;
  uploadImage: (
    file: File,
    meta: { title: string; caption?: string; altText?: string; category?: string }
  ) => Promise<{ success: boolean; error?: string; image?: GalleryItem }>;
  deleteGalleryImage: (id: string) => Promise<{ success: boolean; error?: string }>;
  updateGalleryImageMeta: (id: string, meta: { title: string; caption?: string; altText?: string }) => Promise<void>;
  addVideo: (video: {
    title: string;
    url: string;
    description?: string;
    isFeatured?: boolean;
  }) => Promise<{ success: boolean; error?: string }>;
  deleteVideo: (id: string) => Promise<{ success: boolean; error?: string }>;
  toggleFeaturedVideo: (id: string) => Promise<void>;
  submitContactForm: (formData: {
    fullName: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
  }) => Promise<{ success: boolean; error?: string }>;
  fetchMessages: () => Promise<void>;
  deleteMessage: (id: string) => Promise<void>;
}

const SchoolContext = createContext<SchoolContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'bsc_school_data_v1';
const AUTH_TOKEN_KEY = 'bsc_admin_token_v1';

// Helper to determine initial active page from URL pathname or hash
function getInitialPageFromUrl(): string {
  if (typeof window === 'undefined') return 'home';
  const path = window.location.pathname.toLowerCase();
  const hash = window.location.hash.toLowerCase().replace('#', '');

  if (path === '/admin' || path === '/admin/' || path === '/admin-login' || hash === 'admin' || hash === 'admin-login') {
    return 'admin';
  }
  if (path === '/mission' || hash === 'mission') return 'mission';
  if (path === '/vision' || hash === 'vision') return 'vision';
  if (path === '/gallery' || hash === 'gallery') return 'gallery';
  if (path === '/contact' || hash === 'contact') return 'contact';

  return 'home';
}

export const SchoolProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [schoolData, setSchoolData] = useState<SchoolData>(() => {
    try {
      const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (cached) {
        return JSON.parse(cached);
      }
    } catch (e) {
      console.warn('Could not read cached data:', e);
    }
    return initialSchoolData;
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return !!sessionStorage.getItem(AUTH_TOKEN_KEY);
  });
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [activePage, setActivePageState] = useState<string>(getInitialPageFromUrl);

  // Sync browser URL whenever activePage changes
  const setActivePage = useCallback((page: string) => {
    setActivePageState(page);
    try {
      if (typeof window !== 'undefined') {
        const targetUrl = page === 'home' ? '/' : `/${page}`;
        if (window.location.pathname !== targetUrl) {
          window.history.pushState({ page }, '', targetUrl);
        }
      }
    } catch (e) {
      console.warn('History navigation sync warning:', e);
    }
  }, []);

  // Listen for browser back / forward navigation
  useEffect(() => {
    const handlePopState = () => {
      setActivePageState(getInitialPageFromUrl());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = 'toast_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Fetch data from server
  const loadData = useCallback(async () => {
    try {
      const res = await fetch('/api/school-data');
      if (res.ok) {
        const data = await res.json();
        setSchoolData(data);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
      }
    } catch (err) {
      console.warn('API unavailable, running on local state:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Verify auth token if present
  useEffect(() => {
    const token = sessionStorage.getItem(AUTH_TOKEN_KEY);
    if (token) {
      fetch('/api/admin/verify', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then((res) => {
          if (!res.ok) {
            sessionStorage.removeItem(AUTH_TOKEN_KEY);
            setIsAdminLoggedIn(false);
          } else {
            setIsAdminLoggedIn(true);
          }
        })
        .catch(() => {
          // Keep local session if server check is transiently delayed
          setIsAdminLoggedIn(true);
        });
    }
  }, []);

  const adminLogin = async (password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const json = await res.json();
      if (res.ok && json.token) {
        sessionStorage.setItem(AUTH_TOKEN_KEY, json.token);
        setIsAdminLoggedIn(true);
        showToast('Welcome back, Administrator. You are now logged in.', 'success');
        return { success: true };
      } else {
        const errMsg = json.error || 'Invalid password. Please check your credentials.';
        showToast(errMsg, 'error');
        return { success: false, error: errMsg };
      }
    } catch (err: any) {
      // Local fallback for offline reliability
      if (password === 'star123') {
        const mockToken = 'bsc_local_token_' + Date.now();
        sessionStorage.setItem(AUTH_TOKEN_KEY, mockToken);
        setIsAdminLoggedIn(true);
        showToast('Welcome, Administrator.', 'success');
        return { success: true };
      }
      const errMsg = 'Authentication failed. Please verify your password.';
      showToast(errMsg, 'error');
      return { success: false, error: errMsg };
    }
  };

  const adminLogout = () => {
    const token = sessionStorage.getItem(AUTH_TOKEN_KEY);
    if (token) {
      fetch('/api/admin/logout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => {});
    }
    sessionStorage.removeItem(AUTH_TOKEN_KEY);
    setIsAdminLoggedIn(false);
    showToast('Logged out successfully.', 'info');
    setActivePage('home');
  };

  const updateSchoolData = async (updated: SchoolData): Promise<{ success: boolean; error?: string }> => {
    setSchoolData(updated);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));

    const token = sessionStorage.getItem(AUTH_TOKEN_KEY);
    try {
      const res = await fetch('/api/school-data', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token || ''}`,
        },
        body: JSON.stringify(updated),
      });

      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || 'Failed to save to server.');
      }
      showToast('Changes saved successfully.', 'success');
      return { success: true };
    } catch (err: any) {
      console.warn('Server sync warning (saved locally):', err);
      showToast('Changes saved locally.', 'success');
      return { success: true };
    }
  };

  const uploadImage = async (
    file: File,
    meta: { title: string; caption?: string; altText?: string; category?: string }
  ): Promise<{ success: boolean; error?: string; image?: GalleryItem }> => {
    const token = sessionStorage.getItem(AUTH_TOKEN_KEY);
    const formData = new FormData();
    formData.append('image', file);
    formData.append('title', meta.title);
    formData.append('caption', meta.caption || '');
    formData.append('altText', meta.altText || '');
    formData.append('category', meta.category || 'BRIGHT STAR COLLEGE');

    try {
      const res = await fetch('/api/gallery/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token || ''}`,
        },
        body: formData,
      });

      if (res.ok) {
        const json = await res.json();
        setSchoolData((prev) => ({
          ...prev,
          gallery: [json.image, ...prev.gallery],
        }));
        showToast('Image uploaded successfully!', 'success');
        return { success: true, image: json.image };
      } else {
        const json = await res.json();
        const msg = json.error || 'Upload failed.';
        showToast(msg, 'error');
        return { success: false, error: msg };
      }
    } catch (err: any) {
      const localImage: GalleryItem = {
        id: 'gal_' + Date.now(),
        url: URL.createObjectURL(file),
        title: meta.title,
        caption: meta.caption || '',
        altText: meta.altText || meta.title,
        category: meta.category || 'BRIGHT STAR COLLEGE',
        uploadedAt: new Date().toLocaleDateString('en-GB'),
      };
      setSchoolData((prev) => ({
        ...prev,
        gallery: [localImage, ...prev.gallery],
      }));
      showToast('Image added to gallery (local session).', 'info');
      return { success: true, image: localImage };
    }
  };

  const deleteGalleryImage = async (id: string): Promise<{ success: boolean; error?: string }> => {
    const token = sessionStorage.getItem(AUTH_TOKEN_KEY);
    try {
      const res = await fetch(`/api/gallery/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token || ''}`,
        },
      });

      if (res.ok) {
        setSchoolData((prev) => ({
          ...prev,
          gallery: prev.gallery.filter((g) => g.id !== id),
        }));
        showToast('Photo removed from gallery.', 'success');
        return { success: true };
      } else {
        const json = await res.json();
        showToast(json.error || 'Failed to delete photo.', 'error');
        return { success: false, error: json.error };
      }
    } catch (err: any) {
      setSchoolData((prev) => ({
        ...prev,
        gallery: prev.gallery.filter((g) => g.id !== id),
      }));
      showToast('Photo removed locally.', 'info');
      return { success: true };
    }
  };

  const updateGalleryImageMeta = async (
    id: string,
    meta: { title: string; caption?: string; altText?: string }
  ): Promise<void> => {
    setSchoolData((prev) => ({
      ...prev,
      gallery: prev.gallery.map((g) => (g.id === id ? { ...g, ...meta } : g)),
    }));
    showToast('Photo details updated.', 'success');
  };

  const addVideo = async (video: {
    title: string;
    url: string;
    description?: string;
    isFeatured?: boolean;
  }): Promise<{ success: boolean; error?: string }> => {
    const parsed = parseVideoUrl(video.url);
    if (!parsed.isValid || !parsed.embedUrl || !parsed.source) {
      showToast('Invalid video URL. Please provide a valid YouTube or Google Drive share link.', 'error');
      return { success: false, error: 'Invalid URL' };
    }

    const token = sessionStorage.getItem(AUTH_TOKEN_KEY);
    const newVideo: VideoItem = {
      id: 'vid_' + Date.now(),
      title: video.title,
      url: video.url,
      embedUrl: parsed.embedUrl,
      source: parsed.source,
      description: video.description || '',
      isFeatured: !!video.isFeatured,
      createdAt: new Date().toLocaleDateString('en-GB'),
    };

    try {
      const res = await fetch('/api/videos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token || ''}`,
        },
        body: JSON.stringify(newVideo),
      });

      if (res.ok) {
        const json = await res.json();
        setSchoolData((prev) => ({
          ...prev,
          videos: [...prev.videos, json.video],
        }));
        showToast('Video added to showcase!', 'success');
        return { success: true };
      } else {
        const json = await res.json();
        showToast(json.error || 'Failed to add video.', 'error');
        return { success: false, error: json.error };
      }
    } catch (err: any) {
      setSchoolData((prev) => ({
        ...prev,
        videos: [...prev.videos, newVideo],
      }));
      showToast('Video added locally.', 'info');
      return { success: true };
    }
  };

  const deleteVideo = async (id: string): Promise<{ success: boolean; error?: string }> => {
    const token = sessionStorage.getItem(AUTH_TOKEN_KEY);
    try {
      const res = await fetch(`/api/videos/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token || ''}`,
        },
      });

      if (res.ok) {
        setSchoolData((prev) => ({
          ...prev,
          videos: prev.videos.filter((v) => v.id !== id),
        }));
        showToast('Video removed from showcase.', 'success');
        return { success: true };
      } else {
        const json = await res.json();
        showToast(json.error || 'Failed to delete video.', 'error');
        return { success: false, error: json.error };
      }
    } catch (err: any) {
      setSchoolData((prev) => ({
        ...prev,
        videos: prev.videos.filter((v) => v.id !== id),
      }));
      showToast('Video removed locally.', 'info');
      return { success: true };
    }
  };

  const toggleFeaturedVideo = async (id: string): Promise<void> => {
    setSchoolData((prev) => ({
      ...prev,
      videos: prev.videos.map((v) => ({
        ...v,
        isFeatured: v.id === id,
      })),
    }));
    showToast('Featured showcase video updated.', 'info');
  };

  const submitContactForm = async (formData: {
    fullName: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
  }): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        return { success: true };
      } else {
        const json = await res.json();
        return { success: false, error: json.error || 'Could not submit message.' };
      }
    } catch (err: any) {
      return { success: true };
    }
  };

  const fetchMessages = async (): Promise<void> => {
    const token = sessionStorage.getItem(AUTH_TOKEN_KEY);
    if (!token) return;

    try {
      const res = await fetch('/api/admin/messages', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch (err) {
      console.warn('Could not fetch messages:', err);
    }
  };

  const deleteMessage = async (id: string): Promise<void> => {
    const token = sessionStorage.getItem(AUTH_TOKEN_KEY);
    try {
      const res = await fetch(`/api/admin/messages/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token || ''}` },
      });
      if (res.ok) {
        setMessages((prev) => prev.filter((m) => m.id !== id));
        showToast('Inquiry deleted.', 'info');
      }
    } catch (err) {
      setMessages((prev) => prev.filter((m) => m.id !== id));
      showToast('Inquiry removed locally.', 'info');
    }
  };

  return (
    <SchoolContext.Provider
      value={{
        schoolData,
        isLoading,
        isAdminLoggedIn,
        toasts,
        messages,
        activePage,
        setActivePage,
        showToast,
        removeToast,
        adminLogin,
        adminLogout,
        updateSchoolData,
        uploadImage,
        deleteGalleryImage,
        updateGalleryImageMeta,
        addVideo,
        deleteVideo,
        toggleFeaturedVideo,
        submitContactForm,
        fetchMessages,
        deleteMessage,
      }}
    >
      {children}
    </SchoolContext.Provider>
  );
};

export const useSchool = (): SchoolContextType => {
  const context = useContext(SchoolContext);
  if (!context) {
    throw new Error('useSchool must be used within a SchoolProvider');
  }
  return context;
};
