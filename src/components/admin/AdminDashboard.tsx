import React, { useState, useEffect } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { SchoolData, GalleryItem, VideoItem, FeatureCard } from '../../types';
import { parseVideoUrl } from '../../utils/videoUtils';
import {
  LayoutDashboard,
  Home,
  BookOpen,
  Compass,
  Image as ImageIcon,
  Video,
  PhoneCall,
  Settings,
  LogOut,
  Upload,
  Trash2,
  Plus,
  Save,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Star,
  Eye,
  Shield,
  MessageSquare,
  HelpCircle,
  Play,
  RotateCcw,
  X,
  Database,
  Copy,
  Check,
  Link2,
  Globe,
  Key,
  CheckCircle
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    schoolData,
    adminLogout,
    updateSchoolData,
    uploadImage,
    deleteGalleryImage,
    updateGalleryImageMeta,
    addVideo,
    deleteVideo,
    toggleFeaturedVideo,
    messages,
    fetchMessages,
    deleteMessage,
    showToast,
    setActivePage
  } = useSchool();

  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Local draft states for editable sections
  const [homeDraft, setHomeDraft] = useState(schoolData.home);
  const [missionDraft, setMissionDraft] = useState(schoolData.mission);
  const [visionDraft, setVisionDraft] = useState(schoolData.vision);
  const [settingsDraft, setSettingsDraft] = useState(schoolData.settings);

  // Video Form state
  const [videoTitle, setVideoTitle] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [videoDescription, setVideoDescription] = useState('');
  const [videoIsFeatured, setVideoIsFeatured] = useState(false);
  const [isAddingVideo, setIsAddingVideo] = useState(false);

  // Image Upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [imageTitle, setImageTitle] = useState('');
  const [imageCaption, setImageCaption] = useState('');
  const [imageAltText, setImageAltText] = useState('');
  const [imageCategory, setImageCategory] = useState('Campus Life');
  const [isUploading, setIsUploading] = useState(false);

  // Logo Upload state
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [copiedSql, setCopiedSql] = useState(false);

  // Supabase Link state
  const [supabaseUrl, setSupabaseUrl] = useState('');
  const [supabaseAnonKey, setSupabaseAnonKey] = useState('');
  const [supabaseConnStr, setSupabaseConnStr] = useState('');
  const [isSupabaseConnected, setIsSupabaseConnected] = useState(false);
  const [supabaseUpdatedAt, setSupabaseUpdatedAt] = useState('');
  const [supabaseProjectRef, setSupabaseProjectRef] = useState('');
  const [isSavingSupabase, setIsSavingSupabase] = useState(false);

  // Confirmation modal
  const [deleteConfirm, setDeleteConfirm] = useState<{
    type: 'image' | 'video' | 'message';
    id: string;
    name: string;
  } | null>(null);

  // Sync draft states when schoolData changes
  useEffect(() => {
    setHomeDraft(schoolData.home);
    setMissionDraft(schoolData.mission);
    setVisionDraft(schoolData.vision);
    setSettingsDraft(schoolData.settings);
  }, [schoolData]);

  // Fetch parent messages on load
  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  // Fetch Supabase configuration
  const fetchSupabaseConfig = async () => {
    try {
      const token = sessionStorage.getItem('bsc_admin_token_v1');
      const res = await fetch('/api/supabase-config', {
        headers: { Authorization: `Bearer ${token || ''}` },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.projectUrl || data.isConnected) {
          setSupabaseUrl(data.projectUrl || '');
          setSupabaseAnonKey(data.anonKey || '');
          setSupabaseConnStr(data.connectionString || '');
          setIsSupabaseConnected(!!data.isConnected);
          setSupabaseUpdatedAt(data.updatedAt || '');
          setSupabaseProjectRef(data.projectRef || '');
        }
      }
    } catch (e) {
      console.warn('Could not fetch Supabase config:', e);
    }
  };

  useEffect(() => {
    fetchSupabaseConfig();
  }, []);

  const handleSaveSupabaseLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabaseUrl.trim() && !supabaseConnStr.trim()) {
      showToast('Please insert your Supabase Project URL or Connection String.', 'error');
      return;
    }

    setIsSavingSupabase(true);
    try {
      const token = sessionStorage.getItem('bsc_admin_token_v1');
      const res = await fetch('/api/supabase-config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token || ''}`,
        },
        body: JSON.stringify({
          projectUrl: supabaseUrl.trim(),
          anonKey: supabaseAnonKey.trim(),
          connectionString: supabaseConnStr.trim(),
        }),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        setIsSupabaseConnected(true);
        setSupabaseUpdatedAt(json.config.updatedAt);
        setSupabaseProjectRef(json.config.projectRef || '');
        showToast('Supabase link successfully connected and saved!', 'success');
      } else {
        showToast(json.error || 'Failed to save Supabase connection.', 'error');
      }
    } catch (err: any) {
      showToast('Error connecting to Supabase: ' + err.message, 'error');
    } finally {
      setIsSavingSupabase(false);
    }
  };

  const handleDisconnectSupabase = async () => {
    try {
      const token = sessionStorage.getItem('bsc_admin_token_v1');
      await fetch('/api/supabase-config', {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token || ''}` },
      });
      setIsSupabaseConnected(false);
      setSupabaseUrl('');
      setSupabaseAnonKey('');
      setSupabaseConnStr('');
      setSupabaseProjectRef('');
      setSupabaseUpdatedAt('');
      showToast('Supabase connection unlinked.', 'info');
    } catch (e) {
      showToast('Failed to unlink Supabase.', 'error');
    }
  };

  // Handlers for Saving
  const handleSaveHome = async () => {
    await updateSchoolData({
      ...schoolData,
      home: homeDraft,
    });
  };

  const handleSaveMission = async () => {
    await updateSchoolData({
      ...schoolData,
      mission: {
        ...missionDraft,
        lastUpdated: new Date().toLocaleDateString('en-GB'),
      },
    });
  };

  const handleSaveVision = async () => {
    await updateSchoolData({
      ...schoolData,
      vision: {
        ...visionDraft,
        lastUpdated: new Date().toLocaleDateString('en-GB'),
      },
    });
  };

  const handleSaveSettings = async () => {
    await updateSchoolData({
      ...schoolData,
      settings: settingsDraft,
    });
  };

  // Image upload handling
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setImageTitle(file.name.replace(/\.[^/.]+$/, ''));
      setImageAltText(file.name.replace(/\.[^/.]+$/, ''));

      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      showToast('Please select an image file to upload.', 'error');
      return;
    }

    setIsUploading(true);
    const result = await uploadImage(selectedFile, {
      title: imageTitle.trim(),
      caption: imageCaption.trim(),
      altText: imageAltText.trim(),
      category: imageCategory,
    });
    setIsUploading(false);

    if (result.success) {
      setSelectedFile(null);
      setImagePreview('');
      setImageTitle('');
      setImageCaption('');
      setImageAltText('');
    }
  };

  // Video submit handler
  const handleAddVideoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoUrl.trim()) {
      showToast('Please enter a YouTube or Google Drive URL.', 'error');
      return;
    }

    setIsAddingVideo(true);
    const result = await addVideo({
      title: videoTitle.trim() || 'Bright Star College Video',
      url: videoUrl.trim(),
      description: videoDescription.trim(),
      isFeatured: videoIsFeatured,
    });
    setIsAddingVideo(false);

    if (result.success) {
      setVideoTitle('');
      setVideoUrl('');
      setVideoDescription('');
      setVideoIsFeatured(false);
    }
  };

  // Logo upload handler
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = async () => {
        const logoDataUrl = reader.result as string;
        setSettingsDraft((prev) => ({
          ...prev,
          logoUrl: logoDataUrl,
        }));
        await updateSchoolData({
          ...schoolData,
          settings: {
            ...schoolData.settings,
            logoUrl: logoDataUrl,
          },
        });
        showToast('School logo updated successfully.', 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResetLogo = async () => {
    setSettingsDraft((prev) => ({
      ...prev,
      logoUrl: '',
    }));
    await updateSchoolData({
      ...schoolData,
      settings: {
        ...schoolData.settings,
        logoUrl: '',
      },
    });
    showToast('Reset logo to default BSC crest.', 'info');
  };

  // Execute confirmed deletion
  const executeConfirmedDelete = async () => {
    if (!deleteConfirm) return;
    if (deleteConfirm.type === 'image') {
      await deleteGalleryImage(deleteConfirm.id);
    } else if (deleteConfirm.type === 'video') {
      await deleteVideo(deleteConfirm.id);
    } else if (deleteConfirm.type === 'message') {
      await deleteMessage(deleteConfirm.id);
    }
    setDeleteConfirm(null);
  };

  return (
    <div className="min-h-screen bg-slate-100/70 pb-20">
      {/* Top Admin Topbar */}
      <header className="bg-slate-900 text-white border-b border-slate-800 px-4 sm:px-6 py-3 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-800 text-amber-400 flex items-center justify-center font-bold text-xs border border-blue-700">
              BSC
            </div>
            <div>
              <h1 className="font-bold text-sm tracking-tight text-white">
                Bright Star College Admin Console
              </h1>
              <p className="text-[11px] text-amber-400">
                Lekki, Lagos · Content Management System
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setActivePage('home')}
              className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg border border-slate-700 transition-colors flex items-center gap-1.5"
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">View Public Website</span>
            </button>

            <button
              onClick={adminLogout}
              className="text-xs bg-rose-600 hover:bg-rose-500 text-white font-semibold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Dashboard Workspace */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sidebar Navigation */}
          <aside className="lg:col-span-3">
            <nav className="bg-white rounded-2xl p-3 border border-slate-200/80 shadow-xs space-y-1 sticky top-20">
              <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Administration
              </div>

              <button
                onClick={() => setActiveTab('dashboard')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 'dashboard'
                    ? 'bg-blue-900 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard Overview</span>
              </button>

              <button
                onClick={() => setActiveTab('home')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 'home'
                    ? 'bg-blue-900 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Home className="w-4 h-4" />
                <span>Home Content</span>
              </button>

              <button
                onClick={() => setActiveTab('mission')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 'mission'
                    ? 'bg-blue-900 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>Mission Management</span>
              </button>

              <button
                onClick={() => setActiveTab('vision')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 'vision'
                    ? 'bg-blue-900 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Compass className="w-4 h-4" />
                <span>Vision Management</span>
              </button>

              <button
                onClick={() => setActiveTab('gallery')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 'gallery'
                    ? 'bg-blue-900 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <ImageIcon className="w-4 h-4" />
                <span>Gallery ({schoolData.gallery.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('videos')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 'videos'
                    ? 'bg-blue-900 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Video className="w-4 h-4" />
                <span>Videos ({schoolData.videos.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('contact')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 'contact'
                    ? 'bg-blue-900 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <PhoneCall className="w-4 h-4" />
                <span>Contact & Campus Info</span>
              </button>

              <button
                onClick={() => setActiveTab('inquiries')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 'inquiries'
                    ? 'bg-blue-900 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span className="flex items-center gap-3">
                  <MessageSquare className="w-4 h-4" />
                  <span>Parent Inquiries</span>
                </span>
                {messages.length > 0 && (
                  <span className="bg-amber-500 text-blue-950 font-bold px-1.5 py-0.5 rounded-full text-[10px]">
                    {messages.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 'settings'
                    ? 'bg-blue-900 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Settings className="w-4 h-4" />
                <span>Site Settings & Logo</span>
              </button>

              <button
                onClick={() => setActiveTab('database')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 'database'
                    ? 'bg-blue-900 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span className="flex items-center gap-3">
                  <Database className="w-4 h-4" />
                  <span>Connect Supabase Link</span>
                </span>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                  isSupabaseConnected ? 'bg-emerald-500 text-white' : 'bg-amber-400 text-blue-950'
                }`}>
                  {isSupabaseConnected ? 'LINKED' : 'INSERT LINK'}
                </span>
              </button>
            </nav>
          </aside>

          {/* Main Work Area */}
          <main className="lg:col-span-9 space-y-6">
            {/* TAB 1: DASHBOARD OVERVIEW */}
            {activeTab === 'dashboard' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
                  <span className="text-xs font-bold text-orange-600 uppercase tracking-wider block">
                    OVERVIEW & METRICS
                  </span>
                  <h2 className="text-2xl font-extrabold text-blue-950 mt-1">
                    Administrative Summary
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Manage all public content, uploads, videos, and parental inquiries for Bright Star College, Lekki.
                  </p>

                  {/* Summary Metric Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mt-6">
                    <div className="bg-blue-50/70 border border-blue-100 p-4 rounded-xl">
                      <span className="text-[11px] font-bold text-slate-500 uppercase block">
                        Total Gallery Images
                      </span>
                      <span className="text-2xl font-black text-blue-900 mt-1 block">
                        {schoolData.gallery.length}
                      </span>
                    </div>

                    <div className="bg-amber-50/70 border border-amber-100 p-4 rounded-xl">
                      <span className="text-[11px] font-bold text-slate-500 uppercase block">
                        Total Videos
                      </span>
                      <span className="text-2xl font-black text-amber-800 mt-1 block">
                        {schoolData.videos.length}
                      </span>
                    </div>

                    <div className="bg-emerald-50/70 border border-emerald-100 p-4 rounded-xl">
                      <span className="text-[11px] font-bold text-slate-500 uppercase block">
                        Mission Status
                      </span>
                      <span className="text-sm font-bold text-emerald-800 mt-2 block flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> Configured
                      </span>
                    </div>

                    <div className="bg-indigo-50/70 border border-indigo-100 p-4 rounded-xl">
                      <span className="text-[11px] font-bold text-slate-500 uppercase block">
                        Vision Status
                      </span>
                      <span className="text-sm font-bold text-indigo-800 mt-2 block flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> Configured
                      </span>
                    </div>

                    <div className="bg-teal-50/70 border border-teal-100 p-4 rounded-xl">
                      <span className="text-[11px] font-bold text-slate-500 uppercase block">
                        Website Status
                      </span>
                      <span className="text-sm font-bold text-teal-800 mt-2 block flex items-center gap-1">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                        Live & Ready
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quick Action Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
                    <div>
                      <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center mb-3">
                        <Database className="w-5 h-5 text-emerald-700" />
                      </div>
                      <h3 className="text-sm font-bold text-blue-950 flex items-center justify-between">
                        <span>Supabase Link</span>
                        {isSupabaseConnected ? (
                          <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        ) : (
                          <span className="text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded font-normal">
                            Not Linked
                          </span>
                        )}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1">
                        {isSupabaseConnected
                          ? `Connected: ${supabaseProjectRef || 'Supabase Project'}`
                          : 'Insert your copied Supabase project link to connect live tables.'}
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveTab('database')}
                      className="mt-4 text-xs font-bold text-emerald-800 hover:text-emerald-700 inline-flex items-center gap-1"
                    >
                      <span>{isSupabaseConnected ? 'View Connection' : 'Insert Link Here'}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
                    <div>
                      <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-900 flex items-center justify-center mb-3">
                        <Upload className="w-5 h-5 text-blue-700" />
                      </div>
                      <h3 className="text-sm font-bold text-blue-950">
                        Upload School Photos
                      </h3>
                      <p className="text-xs text-slate-500 mt-1">
                        Add genuine school photographs of students, labs, campus grounds, or events.
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveTab('gallery')}
                      className="mt-4 text-xs font-bold text-blue-900 hover:text-blue-700 inline-flex items-center gap-1"
                    >
                      <span>Open Gallery Upload</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
                    <div>
                      <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-800 flex items-center justify-center mb-3">
                        <Video className="w-5 h-5 text-amber-700" />
                      </div>
                      <h3 className="text-sm font-bold text-blue-950">
                        Link Official Videos
                      </h3>
                      <p className="text-xs text-slate-500 mt-1">
                        Add YouTube or Google Drive video links for campus tours or assembly highlights.
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveTab('videos')}
                      className="mt-4 text-xs font-bold text-amber-800 hover:text-amber-700 inline-flex items-center gap-1"
                    >
                      <span>Open Video Manager</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
                    <div>
                      <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center mb-3">
                        <MessageSquare className="w-5 h-5 text-emerald-700" />
                      </div>
                      <h3 className="text-sm font-bold text-blue-950">
                        Parent Inquiries
                      </h3>
                      <p className="text-xs text-slate-500 mt-1">
                        {messages.length} inquiries received from the public Contact page.
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveTab('inquiries')}
                      className="mt-4 text-xs font-bold text-emerald-800 hover:text-emerald-700 inline-flex items-center gap-1"
                    >
                      <span>View Inquiries</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Important Notice Regarding Photos */}
                <div className="bg-blue-900 text-white rounded-2xl p-6 border border-blue-800 flex items-start gap-4">
                  <Shield className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
                  <div className="text-xs leading-relaxed space-y-1">
                    <span className="font-bold text-sm block text-amber-300">
                      School Branding Policy & Authentic Imagery
                    </span>
                    <p className="text-blue-100">
                      As mandated, the public website displays clean branded educational placeholders until you upload official Bright Star College photographs and videos. Use the <strong>Gallery</strong> tab to upload real images taken on the Lekki campus.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: HOME CONTENT MANAGEMENT */}
            {activeTab === 'home' && (
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6 animate-in fade-in duration-200">
                <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                  <div>
                    <h2 className="text-xl font-bold text-blue-950">
                      Homepage Content Management
                    </h2>
                    <p className="text-xs text-slate-500">
                      Modify hero headlines, introduction, features, and call-to-action text.
                    </p>
                  </div>
                  <button
                    onClick={handleSaveHome}
                    className="bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs inline-flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>SAVE CHANGES</span>
                  </button>
                </div>

                {/* Hero Section Inputs */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider border-l-4 border-orange-500 pl-2">
                    Hero Section
                  </h3>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Hero Headline
                    </label>
                    <input
                      type="text"
                      value={homeDraft.heroTitle}
                      onChange={(e) => setHomeDraft({ ...homeDraft, heroTitle: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Hero Subtitle / Description
                    </label>
                    <textarea
                      rows={3}
                      value={homeDraft.heroSubtitle}
                      onChange={(e) => setHomeDraft({ ...homeDraft, heroSubtitle: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Primary CTA Button Text
                      </label>
                      <input
                        type="text"
                        value={homeDraft.heroCtaPrimary}
                        onChange={(e) => setHomeDraft({ ...homeDraft, heroCtaPrimary: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Secondary CTA Button Text
                      </label>
                      <input
                        type="text"
                        value={homeDraft.heroCtaSecondary}
                        onChange={(e) => setHomeDraft({ ...homeDraft, heroCtaSecondary: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* About Section Inputs */}
                <div className="space-y-4 pt-4 border-t border-slate-200">
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider border-l-4 border-orange-500 pl-2">
                    About Section
                  </h3>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      About Title
                    </label>
                    <input
                      type="text"
                      value={homeDraft.aboutTitle}
                      onChange={(e) => setHomeDraft({ ...homeDraft, aboutTitle: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      About Content
                    </label>
                    <textarea
                      rows={5}
                      value={homeDraft.aboutContent}
                      onChange={(e) => setHomeDraft({ ...homeDraft, aboutContent: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none resize-none"
                    />
                  </div>
                </div>

                {/* Features Management */}
                <div className="space-y-4 pt-4 border-t border-slate-200">
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider border-l-4 border-orange-500 pl-2">
                    Why Choose Us Features ({homeDraft.features.length})
                  </h3>

                  <div className="space-y-3">
                    {homeDraft.features.map((feat, idx) => (
                      <div key={feat.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-blue-900">
                            Feature #{idx + 1}
                          </span>
                        </div>
                        <input
                          type="text"
                          value={feat.title}
                          onChange={(e) => {
                            const updated = [...homeDraft.features];
                            updated[idx] = { ...updated[idx], title: e.target.value };
                            setHomeDraft({ ...homeDraft, features: updated });
                          }}
                          className="w-full px-3 py-1.5 rounded border border-slate-300 text-xs font-semibold"
                        />
                        <textarea
                          rows={2}
                          value={feat.description}
                          onChange={(e) => {
                            const updated = [...homeDraft.features];
                            updated[idx] = { ...updated[idx], description: e.target.value };
                            setHomeDraft({ ...homeDraft, features: updated });
                          }}
                          className="w-full px-3 py-1.5 rounded border border-slate-300 text-xs resize-none"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200 flex justify-end">
                  <button
                    onClick={handleSaveHome}
                    className="bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-xs inline-flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>SAVE CHANGES</span>
                  </button>
                </div>
              </div>
            )}

            {/* TAB 3: MISSION MANAGEMENT */}
            {activeTab === 'mission' && (
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6 animate-in fade-in duration-200">
                <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                  <div>
                    <h2 className="text-xl font-bold text-blue-950">
                      Mission Management
                    </h2>
                    <p className="text-xs text-slate-500">
                      Edit the official school mission statement and delivery pillars.
                    </p>
                  </div>
                  <button
                    onClick={handleSaveMission}
                    className="bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs inline-flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>SAVE MISSION</span>
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Mission Heading
                  </label>
                  <input
                    type="text"
                    value={missionDraft.title}
                    onChange={(e) => setMissionDraft({ ...missionDraft, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Lead Mission Statement
                  </label>
                  <textarea
                    rows={3}
                    value={missionDraft.leadStatement}
                    onChange={(e) => setMissionDraft({ ...missionDraft, leadStatement: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Detailed Mission Content
                  </label>
                  <textarea
                    rows={6}
                    value={missionDraft.fullContent}
                    onChange={(e) => setMissionDraft({ ...missionDraft, fullContent: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none resize-none"
                  />
                </div>

                {/* Pillars Editing */}
                <div className="space-y-4 pt-4 border-t border-slate-200">
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                    Mission Delivery Pillars
                  </h3>
                  <div className="space-y-3">
                    {missionDraft.pillars.map((pillar, idx) => (
                      <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                        <span className="text-xs font-bold text-blue-900 block">
                          Pillar #{idx + 1}
                        </span>
                        <input
                          type="text"
                          value={pillar.title}
                          onChange={(e) => {
                            const updated = [...missionDraft.pillars];
                            updated[idx] = { ...updated[idx], title: e.target.value };
                            setMissionDraft({ ...missionDraft, pillars: updated });
                          }}
                          className="w-full px-3 py-1.5 rounded border border-slate-300 text-xs font-semibold"
                        />
                        <textarea
                          rows={2}
                          value={pillar.description}
                          onChange={(e) => {
                            const updated = [...missionDraft.pillars];
                            updated[idx] = { ...updated[idx], description: e.target.value };
                            setMissionDraft({ ...missionDraft, pillars: updated });
                          }}
                          className="w-full px-3 py-1.5 rounded border border-slate-300 text-xs resize-none"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200 flex justify-end">
                  <button
                    onClick={handleSaveMission}
                    className="bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-xs inline-flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>SAVE MISSION</span>
                  </button>
                </div>
              </div>
            )}

            {/* TAB 4: VISION MANAGEMENT */}
            {activeTab === 'vision' && (
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6 animate-in fade-in duration-200">
                <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                  <div>
                    <h2 className="text-xl font-bold text-blue-950">
                      Vision Management
                    </h2>
                    <p className="text-xs text-slate-500">
                      Edit the official school vision statement and graduate outcomes.
                    </p>
                  </div>
                  <button
                    onClick={handleSaveVision}
                    className="bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs inline-flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>SAVE VISION</span>
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Vision Heading
                  </label>
                  <input
                    type="text"
                    value={visionDraft.title}
                    onChange={(e) => setVisionDraft({ ...visionDraft, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Lead Vision Statement
                  </label>
                  <textarea
                    rows={3}
                    value={visionDraft.leadStatement}
                    onChange={(e) => setVisionDraft({ ...visionDraft, leadStatement: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Detailed Vision Content
                  </label>
                  <textarea
                    rows={6}
                    value={visionDraft.fullContent}
                    onChange={(e) => setVisionDraft({ ...visionDraft, fullContent: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none resize-none"
                  />
                </div>

                {/* Core Outcomes Editing */}
                <div className="space-y-4 pt-4 border-t border-slate-200">
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                    Graduate Outcomes
                  </h3>
                  <div className="space-y-3">
                    {visionDraft.coreOutcomes.map((outcome, idx) => (
                      <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                        <span className="text-xs font-bold text-blue-900 block">
                          Outcome #{idx + 1}
                        </span>
                        <input
                          type="text"
                          value={outcome.title}
                          onChange={(e) => {
                            const updated = [...visionDraft.coreOutcomes];
                            updated[idx] = { ...updated[idx], title: e.target.value };
                            setVisionDraft({ ...visionDraft, coreOutcomes: updated });
                          }}
                          className="w-full px-3 py-1.5 rounded border border-slate-300 text-xs font-semibold"
                        />
                        <textarea
                          rows={2}
                          value={outcome.description}
                          onChange={(e) => {
                            const updated = [...visionDraft.coreOutcomes];
                            updated[idx] = { ...updated[idx], description: e.target.value };
                            setVisionDraft({ ...visionDraft, coreOutcomes: updated });
                          }}
                          className="w-full px-3 py-1.5 rounded border border-slate-300 text-xs resize-none"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200 flex justify-end">
                  <button
                    onClick={handleSaveVision}
                    className="bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-xs inline-flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>SAVE VISION</span>
                  </button>
                </div>
              </div>
            )}

            {/* TAB 5: GALLERY MANAGEMENT */}
            {activeTab === 'gallery' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                {/* Upload Form Box */}
                <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
                  <div className="border-b border-slate-200 pb-4 mb-6">
                    <h2 className="text-xl font-bold text-blue-950">
                      Upload School Photograph
                    </h2>
                    <p className="text-xs text-slate-500">
                      Upload high-resolution photographs directly from your computer or phone (JPG, PNG, WEBP, max 10MB).
                    </p>
                  </div>

                  <form onSubmit={handleUploadSubmit} className="space-y-5">
                    {/* File Picker */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                        Select Image File <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleFileChange}
                        className="block w-full text-xs text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-900 hover:file:bg-blue-100 cursor-pointer border border-slate-300 rounded-xl p-2"
                      />
                    </div>

                    {/* Preview Box */}
                    {imagePreview && (
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-4">
                        <img
                          src={imagePreview}
                          alt="Upload preview"
                          className="w-20 h-20 object-cover rounded-lg border border-slate-300"
                        />
                        <div className="text-xs text-slate-600 space-y-0.5">
                          <span className="font-bold text-slate-800 block">
                            File selected: {selectedFile?.name}
                          </span>
                          <span>Size: {Math.round((selectedFile?.size || 0) / 1024)} KB</span>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                          Photograph Title <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={imageTitle}
                          onChange={(e) => setImageTitle(e.target.value)}
                          placeholder="e.g. Science Laboratory Practical"
                          className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                          Category
                        </label>
                        <select
                          value={imageCategory}
                          onChange={(e) => setImageCategory(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none bg-white"
                        >
                          <option value="BRIGHT STAR COLLEGE">BRIGHT STAR COLLEGE</option>
                          <option value="Cross section of students">Cross section of students</option>
                          <option value="LABS">LABS</option>
                          <option value="ICT">ICT</option>
                          <option value="Library">Library</option>
                          <option value="students">students</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Optional Caption
                      </label>
                      <input
                        type="text"
                        value={imageCaption}
                        onChange={(e) => setImageCaption(e.target.value)}
                        placeholder="e.g. Senior secondary students conducting chemistry titrations"
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Accessible Alt Text (for SEO & Screen Readers)
                      </label>
                      <input
                        type="text"
                        value={imageAltText}
                        onChange={(e) => setImageAltText(e.target.value)}
                        placeholder="e.g. Bright Star College students in the Lekki science lab"
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                      />
                    </div>

                    <div>
                      <button
                        type="submit"
                        disabled={isUploading || !selectedFile}
                        className="bg-orange-600 hover:bg-orange-500 disabled:bg-slate-300 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-xs transition-all uppercase inline-flex items-center gap-2"
                      >
                        {isUploading ? (
                          <span>UPLOADING IMAGE...</span>
                        ) : (
                          <>
                            <Upload className="w-4 h-4" />
                            <span>UPLOAD IMAGE</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>

                {/* Uploaded Gallery Grid */}
                <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-base font-bold text-blue-950">
                      Uploaded Photographs ({schoolData.gallery.length})
                    </h3>
                    <span className="text-xs text-slate-400">
                      Automatically appears on public gallery
                    </span>
                  </div>

                  {schoolData.gallery.length === 0 ? (
                    <div className="text-center py-12 text-slate-400 border border-dashed border-slate-200 rounded-xl">
                      <ImageIcon className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                      <p className="text-xs font-medium">No gallery photographs uploaded yet.</p>
                      <p className="text-[11px] text-slate-400">Use the form above to add your first photo.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                      {schoolData.gallery.map((img) => (
                        <div
                          key={img.id}
                          className="bg-slate-50 rounded-xl overflow-hidden border border-slate-200 flex flex-col justify-between"
                        >
                          <div className="relative aspect-4/3 bg-slate-200">
                            <img
                              src={img.url}
                              alt={img.altText || img.title}
                              className="w-full h-full object-cover"
                            />
                            {img.category && (
                              <span className="absolute top-2 left-2 bg-black/70 text-amber-300 text-[10px] px-2 py-0.5 rounded font-bold">
                                {img.category}
                              </span>
                            )}
                          </div>

                          <div className="p-3.5 space-y-2">
                            <div>
                              <h4 className="text-xs font-bold text-slate-800 truncate">
                                {img.title}
                              </h4>
                              {img.caption && (
                                <p className="text-[11px] text-slate-500 line-clamp-1">
                                  {img.caption}
                                </p>
                              )}
                              <span className="text-[10px] text-slate-400 block mt-1">
                                Uploaded: {img.uploadedAt} {img.fileSize && `· ${img.fileSize}`}
                              </span>
                            </div>

                            <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                              <button
                                onClick={() =>
                                  setDeleteConfirm({
                                    type: 'image',
                                    id: img.id,
                                    name: img.title,
                                  })
                                }
                                className="text-rose-600 hover:text-rose-700 text-xs font-semibold inline-flex items-center gap-1"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Delete</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 6: VIDEO MANAGEMENT */}
            {activeTab === 'videos' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                {/* Add Video Card */}
                <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
                  <div className="border-b border-slate-200 pb-4 mb-6">
                    <h2 className="text-xl font-bold text-blue-950">
                      Add School Video
                    </h2>
                    <p className="text-xs text-slate-500">
                      Link videos hosted on YouTube or Google Drive. Video IDs are automatically parsed and converted into responsive embeds.
                    </p>
                  </div>

                  <form onSubmit={handleAddVideoSubmit} className="space-y-5">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Video URL (YouTube or Google Drive) <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="url"
                        value={videoUrl}
                        onChange={(e) => setVideoUrl(e.target.value)}
                        placeholder="https://www.youtube.com/watch?v=... or https://drive.google.com/file/d/.../view"
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                        required
                      />
                      <span className="text-[11px] text-slate-400 block mt-1">
                        Formats: youtube.com/watch?v=ID, youtu.be/ID, or drive.google.com/file/d/ID/view
                      </span>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Video Title <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={videoTitle}
                        onChange={(e) => setVideoTitle(e.target.value)}
                        placeholder="e.g. Bright Star College Campus Tour & Facilities"
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Video Description
                      </label>
                      <textarea
                        rows={2}
                        value={videoDescription}
                        onChange={(e) => setVideoDescription(e.target.value)}
                        placeholder="Brief overview of the video content..."
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none resize-none"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="featured-video-checkbox"
                        checked={videoIsFeatured}
                        onChange={(e) => setVideoIsFeatured(e.target.checked)}
                        className="rounded border-slate-300 text-blue-900 focus:ring-blue-600 w-4 h-4"
                      />
                      <label
                        htmlFor="featured-video-checkbox"
                        className="text-xs font-bold text-slate-700 cursor-pointer"
                      >
                        Set as Featured Video on Homepage
                      </label>
                    </div>

                    <div>
                      <button
                        type="submit"
                        disabled={isAddingVideo}
                        className="bg-blue-900 hover:bg-blue-800 disabled:bg-slate-300 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-xs transition-all uppercase inline-flex items-center gap-2"
                      >
                        {isAddingVideo ? (
                          <span>VALIDATING & ADDING...</span>
                        ) : (
                          <>
                            <Plus className="w-4 h-4 text-amber-400" />
                            <span>ADD VIDEO</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>

                {/* Video List */}
                <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
                  <h3 className="text-base font-bold text-blue-950 mb-4">
                    Current Videos ({schoolData.videos.length})
                  </h3>

                  {schoolData.videos.length === 0 ? (
                    <div className="text-center py-10 text-slate-400 border border-dashed border-slate-200 rounded-xl">
                      <Video className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                      <p className="text-xs font-medium">No videos added yet.</p>
                      <p className="text-[11px] text-slate-400">
                        Paste a YouTube or Google Drive URL above to display it on the website.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {schoolData.videos.map((vid) => (
                        <div
                          key={vid.id}
                          className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-100 text-blue-900">
                                {vid.source}
                              </span>
                              {vid.isFeatured && (
                                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-100 text-amber-800 flex items-center gap-1">
                                  <Star className="w-3 h-3 fill-amber-500" /> Featured
                                </span>
                              )}
                              <span className="text-[11px] text-slate-400">{vid.createdAt}</span>
                            </div>

                            <h4 className="text-sm font-bold text-slate-800">
                              {vid.title}
                            </h4>
                            {vid.description && (
                              <p className="text-xs text-slate-500 line-clamp-1">
                                {vid.description}
                              </p>
                            )}
                            <a
                              href={vid.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[11px] text-blue-600 hover:underline inline-flex items-center gap-1"
                            >
                              <span>{vid.url}</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => toggleFeaturedVideo(vid.id)}
                              className={`text-xs px-3 py-1.5 rounded-lg border font-semibold transition-colors ${
                                vid.isFeatured
                                  ? 'bg-amber-100 text-amber-900 border-amber-300'
                                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                              }`}
                            >
                              {vid.isFeatured ? 'Featured' : 'Set Featured'}
                            </button>

                            <button
                              onClick={() =>
                                setDeleteConfirm({
                                  type: 'video',
                                  id: vid.id,
                                  name: vid.title,
                                })
                              }
                              className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                              title="Delete Video"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 7: CONTACT & CAMPUS INFO */}
            {activeTab === 'contact' && (
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6 animate-in fade-in duration-200">
                <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                  <div>
                    <h2 className="text-xl font-bold text-blue-950">
                      Contact Information Management
                    </h2>
                    <p className="text-xs text-slate-500">
                      Update official telephone numbers, email, physical address, and operating hours.
                    </p>
                  </div>
                  <button
                    onClick={handleSaveSettings}
                    className="bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs inline-flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>SAVE CONTACT INFO</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Campus Street Address
                    </label>
                    <input
                      type="text"
                      value={settingsDraft.address}
                      onChange={(e) => setSettingsDraft({ ...settingsDraft, address: e.target.value })}
                      placeholder="e.g. Lekki Peninsula Corridor"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      City, State & Country
                    </label>
                    <input
                      type="text"
                      value={settingsDraft.cityState}
                      onChange={(e) => setSettingsDraft({ ...settingsDraft, cityState: e.target.value })}
                      placeholder="e.g. Lekki, Lagos State"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Official Phone Number(s)
                    </label>
                    <input
                      type="text"
                      value={settingsDraft.phonePlaceholder}
                      onChange={(e) => setSettingsDraft({ ...settingsDraft, phonePlaceholder: e.target.value })}
                      placeholder="+234 (0) 800 000 0000"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Official Email Address(es)
                    </label>
                    <input
                      type="text"
                      value={settingsDraft.emailPlaceholder}
                      onChange={(e) => setSettingsDraft({ ...settingsDraft, emailPlaceholder: e.target.value })}
                      placeholder="info@brightstarcollege.ng"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      WhatsApp Contact Number
                    </label>
                    <input
                      type="text"
                      value={settingsDraft.whatsappNumber}
                      onChange={(e) => setSettingsDraft({ ...settingsDraft, whatsappNumber: e.target.value })}
                      placeholder="+2348000000000"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Administrative Office Hours
                    </label>
                    <input
                      type="text"
                      value={settingsDraft.officeHours}
                      onChange={(e) => setSettingsDraft({ ...settingsDraft, officeHours: e.target.value })}
                      placeholder="Monday – Friday: 7:30 AM – 4:30 PM"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Social media links */}
                <div className="space-y-4 pt-4 border-t border-slate-200">
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                    Official Social Media Channels (Leave empty if none)
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Facebook URL
                      </label>
                      <input
                        type="url"
                        value={settingsDraft.socialLinks?.facebook || ''}
                        onChange={(e) =>
                          setSettingsDraft({
                            ...settingsDraft,
                            socialLinks: { ...settingsDraft.socialLinks, facebook: e.target.value },
                          })
                        }
                        placeholder="https://facebook.com/..."
                        className="w-full px-3.5 py-2 rounded border border-slate-300 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Instagram URL
                      </label>
                      <input
                        type="url"
                        value={settingsDraft.socialLinks?.instagram || ''}
                        onChange={(e) =>
                          setSettingsDraft({
                            ...settingsDraft,
                            socialLinks: { ...settingsDraft.socialLinks, instagram: e.target.value },
                          })
                        }
                        placeholder="https://instagram.com/..."
                        className="w-full px-3.5 py-2 rounded border border-slate-300 text-xs"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200 flex justify-end">
                  <button
                    onClick={handleSaveSettings}
                    className="bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-xs inline-flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>SAVE CONTACT INFO</span>
                  </button>
                </div>
              </div>
            )}

            {/* TAB 8: PARENT INQUIRIES */}
            {activeTab === 'inquiries' && (
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6 animate-in fade-in duration-200">
                <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                  <div>
                    <h2 className="text-xl font-bold text-blue-950">
                      Parent Inquiries & Admissions Messages
                    </h2>
                    <p className="text-xs text-slate-500">
                      Inquiries submitted by parents through the public Contact page.
                    </p>
                  </div>
                  <span className="text-xs font-bold text-blue-900 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200">
                    Total: {messages.length}
                  </span>
                </div>

                {messages.length === 0 ? (
                  <div className="text-center py-12 text-slate-400 border border-dashed border-slate-200 rounded-xl">
                    <MessageSquare className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    <p className="text-xs font-medium">No parent inquiries submitted yet.</p>
                    <p className="text-[11px] text-slate-400">
                      Messages sent through the Contact Us form will appear here.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-3"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
                          <div>
                            <span className="text-sm font-bold text-blue-950">
                              {msg.fullName}
                            </span>
                            <span className="text-xs text-slate-400 ml-2">
                              {msg.createdAt}
                            </span>
                          </div>

                          <div className="flex items-center gap-3 text-xs">
                            <a
                              href={`mailto:${msg.email}?subject=RE: ${encodeURIComponent(msg.subject)}`}
                              className="text-blue-700 hover:underline font-semibold"
                            >
                              Reply via Email
                            </a>
                            <button
                              onClick={() =>
                                setDeleteConfirm({
                                  type: 'message',
                                  id: msg.id,
                                  name: `Inquiry from ${msg.fullName}`,
                                })
                              }
                              className="text-rose-600 hover:text-rose-700 p-1"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
                          <div>
                            <span className="font-semibold text-slate-700">Email: </span>
                            <span>{msg.email}</span>
                          </div>
                          {msg.phone && (
                            <div>
                              <span className="font-semibold text-slate-700">Phone: </span>
                              <span>{msg.phone}</span>
                            </div>
                          )}
                          <div className="sm:col-span-2">
                            <span className="font-semibold text-slate-700">Subject: </span>
                            <span className="font-medium text-slate-900">{msg.subject}</span>
                          </div>
                        </div>

                        <div className="p-3 bg-white rounded-lg border border-slate-200 text-xs text-slate-800 leading-relaxed whitespace-pre-wrap">
                          {msg.message}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 9: SITE SETTINGS & LOGO */}
            {activeTab === 'settings' && (
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6 animate-in fade-in duration-200">
                <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                  <div>
                    <h2 className="text-xl font-bold text-blue-950">
                      Site Settings & School Logo
                    </h2>
                    <p className="text-xs text-slate-500">
                      Manage official school name, motto, logo asset, and footer text.
                    </p>
                  </div>
                  <button
                    onClick={handleSaveSettings}
                    className="bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs inline-flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>SAVE SETTINGS</span>
                  </button>
                </div>

                {/* Logo Section */}
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                    Official School Logo
                  </h3>

                  <div className="flex flex-col sm:flex-row items-center gap-6">
                    {/* Current Logo / Temporary Badge */}
                    <div className="shrink-0 text-center">
                      <span className="text-[11px] text-slate-400 block mb-2">
                        Current Display
                      </span>
                      {settingsDraft.logoUrl ? (
                        <div className="p-2 bg-white rounded-xl border border-slate-300 shadow-xs inline-block">
                          <img
                            src={settingsDraft.logoUrl}
                            alt="Uploaded Logo"
                            className="h-16 w-auto object-contain"
                          />
                        </div>
                      ) : (
                        <div className="w-16 h-16 rounded-xl bg-linear-to-b from-blue-900 to-blue-950 border-2 border-amber-400/80 shadow-md flex flex-col items-center justify-center text-white mx-auto">
                          <div className="flex items-center gap-0.5 text-amber-400 -mb-0.5">
                            <Star className="w-2.5 h-2.5 fill-amber-400" />
                            <Shield className="w-3.5 h-3.5 text-amber-400" />
                            <Star className="w-2.5 h-2.5 fill-amber-400" />
                          </div>
                          <span className="font-extrabold text-sm tracking-wider">BSC</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-3 flex-1">
                      <p className="text-xs text-slate-600 leading-relaxed">
                        If no official logo is supplied, the site displays the text-based <strong>BSC crest</strong>. When you have the official school logo file, upload it here.
                      </p>

                      <div className="flex flex-wrap items-center gap-3">
                        <label className="bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs px-4 py-2 rounded-xl cursor-pointer shadow-xs inline-flex items-center gap-2">
                          <Upload className="w-3.5 h-3.5" />
                          <span>Upload Official Logo</span>
                          <input
                            type="file"
                            accept="image/png,image/jpeg,image/webp,image/svg+xml"
                            onChange={handleLogoUpload}
                            className="hidden"
                          />
                        </label>

                        {settingsDraft.logoUrl && (
                          <button
                            onClick={handleResetLogo}
                            className="text-xs text-slate-600 hover:text-rose-600 font-semibold px-3 py-2 rounded-lg border border-slate-300 hover:border-rose-300 transition-colors inline-flex items-center gap-1.5"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Reset to BSC Crest</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Identity Inputs */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      School Name
                    </label>
                    <input
                      type="text"
                      value={settingsDraft.schoolName}
                      onChange={(e) => setSettingsDraft({ ...settingsDraft, schoolName: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Tagline
                    </label>
                    <input
                      type="text"
                      value={settingsDraft.tagline}
                      onChange={(e) => setSettingsDraft({ ...settingsDraft, tagline: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Motto
                    </label>
                    <input
                      type="text"
                      value={settingsDraft.motto}
                      onChange={(e) => setSettingsDraft({ ...settingsDraft, motto: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Footer Copyright Text
                    </label>
                    <input
                      type="text"
                      value={settingsDraft.footerCopyright}
                      onChange={(e) => setSettingsDraft({ ...settingsDraft, footerCopyright: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200 flex justify-end">
                  <button
                    onClick={handleSaveSettings}
                    className="bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-xs inline-flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>SAVE SETTINGS</span>
                  </button>
                </div>
              </div>
            )}

            {/* TAB 10: SUPABASE & SQL SCRIPT */}
            {activeTab === 'database' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                {/* 1. INSERT SUPABASE LINK FORM (PROMINENT TOP CARD) */}
                <div className="bg-white rounded-2xl p-6 sm:p-8 border-2 border-emerald-500/50 shadow-md space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
                    <div>
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 text-[11px] font-bold uppercase tracking-wider mb-1">
                        <Link2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Supabase Connection</span>
                      </div>
                      <h2 className="text-xl sm:text-2xl font-extrabold text-blue-950">
                        Insert Supabase Project Link
                      </h2>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Paste the Project URL or database connection string you copied from your Supabase dashboard below.
                      </p>
                    </div>

                    {/* Live Connection Badge */}
                    <div className="shrink-0">
                      {isSupabaseConnected ? (
                        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-300 text-emerald-800 px-3.5 py-2 rounded-xl text-xs font-bold">
                          <CheckCircle className="w-4 h-4 text-emerald-600" />
                          <span>Connected to Supabase</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 bg-amber-50 border border-amber-300 text-amber-800 px-3.5 py-2 rounded-xl text-xs font-semibold">
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
                          <span>Waiting for Link</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Connected Status Summary Box */}
                  {isSupabaseConnected ? (
                    <div className="p-4 bg-emerald-50/80 rounded-xl border border-emerald-200 text-xs text-emerald-950 space-y-1.5">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <span className="font-bold flex items-center gap-1.5 text-sm text-emerald-900">
                          <Globe className="w-4 h-4 text-emerald-700" />
                          <span>Active Project URL: {supabaseUrl}</span>
                        </span>
                        <button
                          onClick={handleDisconnectSupabase}
                          className="text-xs text-rose-600 hover:text-rose-700 font-bold underline self-start sm:self-auto"
                        >
                          Unlink / Disconnect
                        </button>
                      </div>
                      <div className="text-[11px] text-emerald-700 flex flex-wrap items-center gap-4">
                        {supabaseUpdatedAt && <span>Last linked: {supabaseUpdatedAt}</span>}
                        {supabaseProjectRef && <span>Project Reference: {supabaseProjectRef}</span>}
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 bg-amber-50/70 rounded-xl border border-amber-200 text-xs text-amber-900 leading-relaxed">
                      <strong>Not connected yet.</strong> Once you create your project at <strong>supabase.com</strong>, copy the Project URL from <em>Settings → API</em> and paste it into the form below.
                    </div>
                  )}

                  {/* Step-by-Step Helper: Where to find the link */}
                  <div className="bg-blue-50/60 border border-blue-200/80 rounded-xl p-4 text-xs text-slate-700 space-y-2.5">
                    <span className="font-bold text-blue-950 text-xs uppercase tracking-wider block">
                      📌 Where to copy your link in Supabase:
                    </span>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-[11px]">
                      <div className="bg-white p-3 rounded-lg border border-blue-100 shadow-2xs space-y-1">
                        <span className="font-bold text-blue-900 block">1. Go to Project Settings</span>
                        <span className="text-slate-600">Open your Supabase project, then click <strong>Project Settings (⚙)</strong> at the bottom of the left sidebar.</span>
                      </div>
                      <div className="bg-white p-3 rounded-lg border border-blue-100 shadow-2xs space-y-1">
                        <span className="font-bold text-blue-900 block">2. Click &quot;API&quot;</span>
                        <span className="text-slate-600">Under Configuration, click <strong>API</strong>. You will see <strong>Project URL</strong> and <strong>Project API keys</strong>.</span>
                      </div>
                      <div className="bg-white p-3 rounded-lg border border-blue-100 shadow-2xs space-y-1">
                        <span className="font-bold text-blue-900 block">3. Copy &amp; Paste Here</span>
                        <span className="text-slate-600">Copy the URL (e.g. <code className="text-emerald-700">https://xyz.supabase.co</code>) and paste it into the input below.</span>
                      </div>
                    </div>
                  </div>

                  {/* The Actual Link Input Form */}
                  <form onSubmit={handleSaveSupabaseLink} className="space-y-4 pt-1">
                    <div>
                      <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <Globe className="w-4 h-4 text-blue-700" />
                          <span>Supabase Project URL (Paste your copied link here) <span className="text-rose-500">*</span></span>
                        </span>
                        <span className="text-[11px] text-slate-400 font-normal">e.g. https://your-project.supabase.co</span>
                      </label>
                      <input
                        type="text"
                        value={supabaseUrl}
                        onChange={(e) => setSupabaseUrl(e.target.value)}
                        placeholder="https://abcdefghijklm.supabase.co or postgresql://..."
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none font-mono bg-slate-50/50 shadow-2xs"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                          <Key className="w-4 h-4 text-amber-600" />
                          <span>Anon / Public API Key</span>
                        </label>
                        <input
                          type="password"
                          value={supabaseAnonKey}
                          onChange={(e) => setSupabaseAnonKey(e.target.value)}
                          placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none font-mono"
                        />
                        <span className="text-[11px] text-slate-400 block mt-1">
                          Found in: Project Settings → API → anon public key
                        </span>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                          <Database className="w-4 h-4 text-slate-600" />
                          <span>Database Connection String (Optional)</span>
                        </label>
                        <input
                          type="text"
                          value={supabaseConnStr}
                          onChange={(e) => setSupabaseConnStr(e.target.value)}
                          placeholder="postgresql://postgres.[ref]:[password]@..."
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none font-mono"
                        />
                        <span className="text-[11px] text-slate-400 block mt-1">
                          Found in: Project Settings → Database → URI
                        </span>
                      </div>
                    </div>

                    <div className="pt-2 flex flex-wrap items-center gap-3">
                      <button
                        type="submit"
                        disabled={isSavingSupabase}
                        className="bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-300 text-white font-bold text-xs px-6 py-3.5 rounded-xl shadow-md transition-all uppercase inline-flex items-center gap-2 cursor-pointer"
                      >
                        {isSavingSupabase ? (
                          <span>CONNECTING...</span>
                        ) : (
                          <>
                            <Check className="w-4 h-4" />
                            <span>CONNECT &amp; SAVE SUPABASE LINK</span>
                          </>
                        )}
                      </button>

                      {isSupabaseConnected && (
                        <button
                          type="button"
                          onClick={handleDisconnectSupabase}
                          className="bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-600 text-xs font-semibold px-4 py-3 rounded-xl border border-slate-300 transition-colors cursor-pointer"
                        >
                          Clear Link
                        </button>
                      )}
                    </div>
                  </form>
                </div>

                {/* 2. SQL MIGRATION SCRIPT RUNNER */}
                <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
                    <div>
                      <h3 className="text-lg font-bold text-blue-950 flex items-center gap-2">
                        <Database className="w-5 h-5 text-emerald-600" />
                        <span>Supabase SQL Migration Script (7 Tables)</span>
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Execute this once in the Supabase SQL Editor to create all school tables and policies.
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(`-- BRIGHT STAR COLLEGE SUPABASE SCHEMA
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS public.school_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_name TEXT NOT NULL DEFAULT 'BRIGHT STAR COLLEGE',
    tagline TEXT NOT NULL DEFAULT 'Building Bright Minds for a Brighter Future',
    motto TEXT NOT NULL DEFAULT 'Excellence · Integrity · Discipline',
    logo_url TEXT DEFAULT '',
    address TEXT NOT NULL DEFAULT 'Lekki Peninsula Corridor',
    city_state TEXT NOT NULL DEFAULT 'Lekki, Lagos State',
    country TEXT NOT NULL DEFAULT 'Nigeria',
    phone_placeholder TEXT NOT NULL DEFAULT '+234 (0) 800 000 0000 / +234 (0) 801 234 5678',
    email_placeholder TEXT NOT NULL DEFAULT 'info@brightstarcollege.ng / admissions@brightstarcollege.ng',
    whatsapp_number TEXT NOT NULL DEFAULT '+2348000000000',
    office_hours TEXT NOT NULL DEFAULT 'Monday – Friday: 7:30 AM – 4:30 PM',
    map_query TEXT NOT NULL DEFAULT 'Lekki, Lagos, Nigeria',
    social_links JSONB DEFAULT '{"facebook":"","instagram":"","twitter":"","linkedin":"","youtube":""}'::jsonb,
    footer_copyright TEXT NOT NULL DEFAULT '© 2026 Bright Star College. All Rights Reserved.',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.home_content (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    hero_title TEXT NOT NULL DEFAULT 'Building Bright Minds for a Brighter Future',
    hero_subtitle TEXT NOT NULL,
    hero_cta_primary TEXT NOT NULL DEFAULT 'LEARN MORE',
    hero_cta_secondary TEXT NOT NULL DEFAULT 'CONTACT US',
    hero_image_url TEXT DEFAULT 'https://i.ibb.co/PvLmXqc3/312891.jpg',
    about_title TEXT NOT NULL DEFAULT 'Welcome to Bright Star College',
    about_subtitle TEXT NOT NULL DEFAULT 'Dedicated to Academic Distinction and Moral Integrity',
    about_content TEXT NOT NULL,
    about_highlights JSONB DEFAULT '[]'::jsonb,
    features JSONB DEFAULT '[]'::jsonb,
    contact_cta_title TEXT NOT NULL DEFAULT 'Give Your Child a Bright Future',
    contact_cta_subtitle TEXT NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.mission_content (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL DEFAULT 'Our Mission',
    lead_statement TEXT NOT NULL,
    full_content TEXT NOT NULL,
    pillars JSONB DEFAULT '[]'::jsonb,
    last_updated TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.vision_content (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL DEFAULT 'Our Vision',
    lead_statement TEXT NOT NULL,
    full_content TEXT NOT NULL,
    core_outcomes JSONB DEFAULT '[]'::jsonb,
    last_updated TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.gallery_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    url TEXT NOT NULL,
    title TEXT NOT NULL,
    caption TEXT DEFAULT '',
    alt_text TEXT NOT NULL,
    category TEXT DEFAULT 'Campus Life',
    file_size TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.school_videos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    source TEXT NOT NULL CHECK (source IN ('youtube', 'google-drive')),
    embed_url TEXT NOT NULL,
    description TEXT DEFAULT '',
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.contact_inquiries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    subject TEXT DEFAULT 'General Inquiry',
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.school_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.home_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mission_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vision_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.school_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_inquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Read Settings" ON public.school_settings FOR SELECT USING (true);
CREATE POLICY "Public Read Home" ON public.home_content FOR SELECT USING (true);
CREATE POLICY "Public Read Mission" ON public.mission_content FOR SELECT USING (true);
CREATE POLICY "Public Read Vision" ON public.vision_content FOR SELECT USING (true);
CREATE POLICY "Public Read Gallery" ON public.gallery_images FOR SELECT USING (true);
CREATE POLICY "Public Read Videos" ON public.school_videos FOR SELECT USING (true);
CREATE POLICY "Public Insert Inquiries" ON public.contact_inquiries FOR INSERT WITH CHECK (true);

INSERT INTO public.home_content (
    hero_title, hero_subtitle, hero_cta_primary, hero_cta_secondary, hero_image_url,
    about_title, about_subtitle, about_content, contact_cta_title, contact_cta_subtitle
) VALUES (
    'Building Bright Minds for a Brighter Future',
    'Providing qualitative education in a nurturing, disciplined, and technologically enriched learning environment in Lekki, Lagos.',
    'LEARN MORE',
    'CONTACT US',
    'https://i.ibb.co/PvLmXqc3/312891.jpg',
    'Welcome to Bright Star College',
    'Dedicated to Academic Distinction and Moral Integrity',
    'Bright Star College is committed to providing quality education, developing confident learners and preparing students for future success in Lekki, Lagos.',
    'Give Your Child a Bright Future',
    'Enrollment inquiries and campus visits are open.'
) ON CONFLICT DO NOTHING;`);
                        setCopiedSql(true);
                        showToast('Supabase SQL script copied to clipboard!', 'success');
                        setTimeout(() => setCopiedSql(false), 3000);
                      }}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs inline-flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      {copiedSql ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      <span>{copiedSql ? 'COPIED TO CLIPBOARD!' : 'COPY SQL SCRIPT'}</span>
                    </button>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2">
                    <span className="font-bold text-slate-900 block">
                      How to execute the SQL script in Supabase:
                    </span>
                    <ol className="list-decimal list-inside space-y-1 text-slate-700">
                      <li>Go to <strong>supabase.com</strong> and open your project.</li>
                      <li>Click the <strong>SQL Editor</strong> tab on the left sidebar.</li>
                      <li>Click <strong>New Query</strong>, paste this script, and click <strong>Run</strong>.</li>
                    </ol>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      <span>PostgreSQL Script Preview</span>
                      <span className="text-slate-400 font-normal">Also saved in project root as /supabase_schema.sql</span>
                    </div>
                    <pre className="bg-slate-900 text-emerald-400 p-4 rounded-xl text-xs font-mono overflow-x-auto max-h-72 leading-relaxed border border-slate-800">
{`-- Run in Supabase SQL Editor
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS public.school_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_name TEXT NOT NULL DEFAULT 'BRIGHT STAR COLLEGE',
    tagline TEXT NOT NULL DEFAULT 'Building Bright Minds for a Brighter Future',
    motto TEXT NOT NULL DEFAULT 'Excellence · Integrity · Discipline',
    address TEXT NOT NULL DEFAULT 'Lekki Peninsula Corridor',
    city_state TEXT NOT NULL DEFAULT 'Lekki, Lagos State',
    country TEXT NOT NULL DEFAULT 'Nigeria',
    phone_placeholder TEXT NOT NULL DEFAULT '+234 (0) 800 000 0000',
    email_placeholder TEXT NOT NULL DEFAULT 'info@brightstarcollege.ng',
    whatsapp_number TEXT NOT NULL DEFAULT '+2348000000000',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.home_content (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    hero_title TEXT NOT NULL,
    hero_subtitle TEXT NOT NULL,
    hero_image_url TEXT DEFAULT 'https://i.ibb.co/PvLmXqc3/312891.jpg',
    about_title TEXT NOT NULL,
    about_content TEXT NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);`}
                    </pre>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Confirmation Modal for Permanent Deletion */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center">
              <h4 className="text-base font-bold text-slate-900">
                Confirm Deletion
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                Are you sure you want to permanently delete &quot;{deleteConfirm.name}&quot;? This action cannot be undone.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs py-2.5 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={executeConfirmedDelete}
                className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs py-2.5 rounded-xl transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
