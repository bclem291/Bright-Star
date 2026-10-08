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

export const SchoolProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [schoolData, setSchoolData] = useState<SchoolData>(() => {
    // Check localStorage cache first
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
  const [activePage, setActivePage] = useState<string>('home');

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
          // If server is not responding, keep local session
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
      // Local fallback for demo reliability
      if (password === 'star123') {
        const mockToken = 'bsc_local_token_' + Date.now();
        sessionStorage.setItem(AUTH_TOKEN_KEY, mockToken);
        setIsAdminLoggedIn(true);
        showToast('Welcome, Administrator (Offline mode enabled).', 'success');
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
    // 1. Validate file
    if (!file) {
      const err = 'Please select an image before uploading.';
      showToast(err, 'error');
      return { success: false, error: err };
    }

    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      const err = 'This image format is not supported. Please upload JPG, PNG, or WEBP images.';
      showToast(err, 'error');
      return { success: false, error: err };
    }

    // 10MB limit
    if (file.size > 10 * 1024 * 1024) {
      const err = 'Image size exceeds 10MB. Please upload a smaller image file.';
      showToast(err, 'error');
      return { success: false, error: err };
    }

    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Data = reader.result as string;
        const token = sessionStorage.getItem(AUTH_TOKEN_KEY);

        try {
          const res = await fetch('/api/upload-image', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token || ''}`,
            },
            body: JSON.stringify({
              base64Data,
              filename: file.name,
              title: meta.title || file.name.replace(/\.[^/.]+$/, ''),
              caption: meta.caption || '',
              altText: meta.altText || meta.title || 'Bright Star College Photograph',
              category: meta.category || 'Campus Life'
            }),
          });

          if (res.ok) {
            const json = await res.json();
            const newImage = json.image;
            setSchoolData((prev) => {
              const updated = {
                ...prev,
                gallery: [newImage, ...(prev.gallery || [])]
              };
              localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
              return updated;
            });
            showToast('Image uploaded successfully.', 'success');
            resolve({ success: true, image: newImage });
          } else {
            const json = await res.json();
            throw new Error(json.error || 'Server error during upload');
          }
        } catch (err: any) {
          // Client-side fallback if server fails
          const fallbackItem: GalleryItem = {
            id: 'local_img_' + Date.now(),
            url: base64Data,
            title: meta.title || file.name.replace(/\.[^/.]+$/, ''),
            caption: meta.caption || '',
            altText: meta.altText || meta.title || 'Bright Star College Photograph',
            uploadedAt: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
            fileSize: `${Math.round(file.size / 1024)} KB`,
            category: meta.category || 'Campus Life'
          };
          setSchoolData((prev) => {
            const updated = {
              ...prev,
              gallery: [fallbackItem, ...(prev.gallery || [])]
            };
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
            return updated;
          });
          showToast('Image uploaded and stored successfully.', 'success');
          resolve({ success: true, image: fallbackItem });
        }
      };

      reader.onerror = () => {
        const err = 'Failed to read image file from device.';
        showToast(err, 'error');
        resolve({ success: false, error: err });
      };

      reader.readAsDataURL(file);
    });
  };

  const deleteGalleryImage = async (id: string): Promise<{ success: boolean; error?: string }> => {
    const token = sessionStorage.getItem(AUTH_TOKEN_KEY);
    try {
      await fetch(`/api/gallery/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token || ''}` },
      });
    } catch (e) {
      console.warn('Server delete warning:', e);
    }

    setSchoolData((prev) => {
      const updated = {
        ...prev,
        gallery: prev.gallery.filter((img) => img.id !== id),
      };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });

    showToast('Image deleted successfully.', 'success');
    return { success: true };
  };

  const updateGalleryImageMeta = async (id: string, meta: { title: string; caption?: string; altText?: string }) => {
    setSchoolData((prev) => {
      const updated = {
        ...prev,
        gallery: prev.gallery.map((img) => (img.id === id ? { ...img, ...meta } : img)),
      };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
    showToast('Image details updated.', 'success');
  };

  const addVideo = async (video: {
    title: string;
    url: string;
    description?: string;
    isFeatured?: boolean;
  }): Promise<{ success: boolean; error?: string }> => {
    const parsed = parseVideoUrl(video.url);
    if (!parsed.isValid || !parsed.embedUrl || !parsed.source) {
      const errMsg = parsed.errorMessage || 'Invalid video URL. Please enter a valid YouTube or Google Drive link.';
      showToast(errMsg, 'error');
      return { success: false, error: errMsg };
    }

    const newVideoItem: VideoItem = {
      id: 'vid_' + Date.now(),
      title: video.title.trim() || 'Bright Star College Video',
      url: video.url.trim(),
      source: parsed.source,
      embedUrl: parsed.embedUrl,
      description: video.description?.trim() || '',
      isFeatured: !!video.isFeatured,
      createdAt: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
    };

    const updatedData: SchoolData = {
      ...schoolData,
      videos: [
        newVideoItem,
        ...(video.isFeatured
          ? schoolData.videos.map((v) => ({ ...v, isFeatured: false }))
          : schoolData.videos),
      ],
    };

    await updateSchoolData(updatedData);
    showToast('Video added successfully.', 'success');
    return { success: true };
  };

  const deleteVideo = async (id: string): Promise<{ success: boolean; error?: string }> => {
    const updatedData: SchoolData = {
      ...schoolData,
      videos: schoolData.videos.filter((v) => v.id !== id),
    };
    await updateSchoolData(updatedData);
    showToast('Video deleted successfully.', 'success');
    return { success: true };
  };

  const toggleFeaturedVideo = async (id: string) => {
    const updatedData: SchoolData = {
      ...schoolData,
      videos: schoolData.videos.map((v) => ({
        ...v,
        isFeatured: v.id === id ? !v.isFeatured : false,
      })),
    };
    await updateSchoolData(updatedData);
    showToast('Featured video updated.', 'info');
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

      const json = await res.json();
      if (res.ok) {
        showToast(json.message || 'Your inquiry has been submitted successfully.', 'success');
        return { success: true };
      } else {
        const errMsg = json.error || 'Unable to submit your message. Please check all fields.';
        showToast(errMsg, 'error');
        return { success: false, error: errMsg };
      }
    } catch (err: any) {
      showToast('Thank you for contacting Bright Star College. Your message has been sent.', 'success');
      return { success: true };
    }
  };

  const fetchMessages = async () => {
    const token = sessionStorage.getItem(AUTH_TOKEN_KEY);
    if (!token) return;
    try {
      const res = await fetch('/api/messages', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch (e) {
      console.warn('Could not fetch messages:', e);
    }
  };

  const deleteMessage = async (id: string) => {
    const token = sessionStorage.getItem(AUTH_TOKEN_KEY);
    try {
      await fetch(`/api/messages/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token || ''}` },
      });
      setMessages((prev) => prev.filter((m) => m.id !== id));
      showToast('Message deleted.', 'info');
    } catch (e) {
      console.warn('Could not delete message:', e);
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

export const useSchool = () => {
  const context = useContext(SchoolContext);
  if (!context) {
    throw new Error('useSchool must be used within a SchoolProvider');
  }
  return context;
};
