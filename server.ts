import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { initialSchoolData } from './src/data/defaultData';
import { SchoolData, ContactMessage, GalleryItem } from './src/types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Persistence directories
const DATA_DIR = path.resolve(__dirname, 'data');
const UPLOADS_DIR = path.resolve(__dirname, 'public', 'uploads');
const DATA_FILE = path.join(DATA_DIR, 'school-data.json');
const MESSAGES_FILE = path.join(DATA_DIR, 'messages.json');
const SUPABASE_FILE = path.join(DATA_DIR, 'supabase-config.json');

// Ensure directories exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Initialize default school data if not present
function getSchoolData(): SchoolData {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, 'utf-8');
      return JSON.parse(content);
    }
  } catch (err) {
    console.error('Error reading school data file, falling back to initial data:', err);
  }
  fs.writeFileSync(DATA_FILE, JSON.stringify(initialSchoolData, null, 2), 'utf-8');
  return initialSchoolData;
}

function saveSchoolData(data: SchoolData): void {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

function getMessages(): ContactMessage[] {
  try {
    if (fs.existsSync(MESSAGES_FILE)) {
      const content = fs.readFileSync(MESSAGES_FILE, 'utf-8');
      return JSON.parse(content);
    }
  } catch (err) {
    console.error('Error reading messages file:', err);
  }
  return [];
}

function saveMessages(messages: ContactMessage[]): void {
  fs.writeFileSync(MESSAGES_FILE, JSON.stringify(messages, null, 2), 'utf-8');
}

export interface SupabaseConfigData {
  projectUrl: string;
  anonKey: string;
  connectionString: string;
  isConnected: boolean;
  updatedAt: string;
  projectRef?: string;
}

function getSupabaseConfig(): SupabaseConfigData {
  try {
    if (fs.existsSync(SUPABASE_FILE)) {
      const content = fs.readFileSync(SUPABASE_FILE, 'utf-8');
      return JSON.parse(content);
    }
  } catch (err) {
    console.error('Error reading Supabase config:', err);
  }
  return {
    projectUrl: '',
    anonKey: '',
    connectionString: '',
    isConnected: false,
    updatedAt: '',
    projectRef: ''
  };
}

function saveSupabaseConfig(cfg: SupabaseConfigData): void {
  fs.writeFileSync(SUPABASE_FILE, JSON.stringify(cfg, null, 2), 'utf-8');
}

// Active session tokens for admin authentication
const activeTokens = new Set<string>();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'star123';

function authenticateAdmin(req: Request, res: Response, next: () => void) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized: Admin authentication token required' });
    return;
  }
  const token = authHeader.substring(7);
  if (!activeTokens.has(token)) {
    res.status(401).json({ error: 'Unauthorized: Session expired or invalid token' });
    return;
  }
  next();
}

async function startServer() {
  const app = express();
  const PORT = parseInt(process.env.PORT || '3000', 10);

  // Parse JSON payloads up to 35MB for high-resolution school image uploads
  app.use(express.json({ limit: '35mb' }));
  app.use(express.urlencoded({ extended: true, limit: '35mb' }));

  // Serve static uploads
  app.use('/uploads', express.static(UPLOADS_DIR));

  // --- API ROUTES ---

  // 1. Get School Data (Public)
  app.get('/api/school-data', (_req: Request, res: Response) => {
    try {
      const data = getSchoolData();
      res.json(data);
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to retrieve school data: ' + err.message });
    }
  });

  // 2. Update School Data (Admin Protected)
  app.put('/api/school-data', authenticateAdmin, (req: Request, res: Response) => {
    try {
      const updatedData: SchoolData = req.body;
      if (!updatedData || !updatedData.settings || !updatedData.home) {
        res.status(400).json({ error: 'Invalid school data structure' });
        return;
      }
      saveSchoolData(updatedData);
      res.json({ success: true, message: 'Changes saved successfully.', data: updatedData });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to save changes: ' + err.message });
    }
  });

  // 3. Admin Authentication Login
  app.post('/api/admin/login', (req: Request, res: Response) => {
    const { password } = req.body;
    if (!password) {
      res.status(400).json({ error: 'Password is required' });
      return;
    }

    if (password === ADMIN_PASSWORD) {
      const token = crypto.randomBytes(32).toString('hex');
      activeTokens.add(token);
      res.json({
        success: true,
        token,
        message: 'Authentication successful. Welcome to Bright Star College Administrative Dashboard.',
      });
    } else {
      res.status(401).json({ error: 'Incorrect password. Access denied.' });
    }
  });

  // 4. Verify Admin Token
  app.get('/api/admin/verify', (req: Request, res: Response) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      if (activeTokens.has(token)) {
        res.json({ valid: true });
        return;
      }
    }
    res.status(401).json({ valid: false });
  });

  // 5. Admin Logout
  app.post('/api/admin/logout', (req: Request, res: Response) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      activeTokens.delete(token);
    }
    res.json({ success: true, message: 'Logged out successfully.' });
  });

  // 6. Upload Image Endpoint (Admin Protected)
  app.post('/api/upload-image', authenticateAdmin, (req: Request, res: Response) => {
    try {
      const { base64Data, filename, title, caption, altText, category } = req.body;

      if (!base64Data) {
        res.status(400).json({ error: 'Please select an image before uploading.' });
        return;
      }

      // Check format: JPG, JPEG, PNG, WEBP
      const match = base64Data.match(/^data:image\/(jpeg|jpg|png|webp);base64,/);
      if (!match) {
        res.status(400).json({ error: 'This image format is not supported. Please use JPG, PNG, or WEBP.' });
        return;
      }

      const extension = match[1] === 'jpeg' ? 'jpg' : match[1];
      const base64WithoutHeader = base64Data.replace(/^data:image\/[a-z]+;base64,/, '');
      const buffer = Buffer.from(base64WithoutHeader, 'base64');

      // Validate size (max 10MB)
      if (buffer.length > 10 * 1024 * 1024) {
        res.status(400).json({ error: 'Image file is too large. Maximum supported size is 10MB.' });
        return;
      }

      const id = 'img_' + Date.now() + '_' + crypto.randomBytes(4).toString('hex');
      const savedFileName = `${id}.${extension}`;
      const filePath = path.join(UPLOADS_DIR, savedFileName);

      fs.writeFileSync(filePath, buffer);

      const sizeKb = Math.round(buffer.length / 1024);
      const sizeStr = sizeKb > 1024 ? `${(sizeKb / 1024).toFixed(1)} MB` : `${sizeKb} KB`;

      const newImage: GalleryItem = {
        id,
        url: `/uploads/${savedFileName}`,
        title: title?.trim() || filename?.replace(/\.[^/.]+$/, '') || 'School Photograph',
        caption: caption?.trim() || '',
        altText: altText?.trim() || title?.trim() || 'Bright Star College Photograph',
        uploadedAt: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
        fileSize: sizeStr,
        category: category || 'Campus Life'
      };

      // Also append to current gallery in store
      const currentData = getSchoolData();
      currentData.gallery = [newImage, ...(currentData.gallery || [])];
      saveSchoolData(currentData);

      res.json({
        success: true,
        message: 'Image uploaded successfully.',
        image: newImage,
      });
    } catch (err: any) {
      console.error('Error during image upload:', err);
      res.status(500).json({ error: 'Unable to save image. Please try again: ' + err.message });
    }
  });

  // 7. Delete Image Endpoint (Admin Protected)
  app.delete('/api/gallery/:id', authenticateAdmin, (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const currentData = getSchoolData();
      const imageToDelete = currentData.gallery.find(img => img.id === id);

      if (!imageToDelete) {
        res.status(404).json({ error: 'Image not found.' });
        return;
      }

      // If file exists on disk, remove it
      if (imageToDelete.url.startsWith('/uploads/')) {
        const localPath = path.join(UPLOADS_DIR, path.basename(imageToDelete.url));
        if (fs.existsSync(localPath)) {
          fs.unlinkSync(localPath);
        }
      }

      currentData.gallery = currentData.gallery.filter(img => img.id !== id);
      saveSchoolData(currentData);

      res.json({ success: true, message: 'Image deleted successfully.' });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to delete image: ' + err.message });
    }
  });

  // 8. Contact Form Submission (Public)
  app.post('/api/contact', (req: Request, res: Response) => {
    try {
      const { fullName, email, phone, subject, message } = req.body;

      if (!fullName || !email || !message) {
        res.status(400).json({ error: 'Please provide full name, email address, and your message.' });
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        res.status(400).json({ error: 'Please enter a valid email address.' });
        return;
      }

      const newMessage: ContactMessage = {
        id: 'msg_' + Date.now() + '_' + crypto.randomBytes(3).toString('hex'),
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone?.trim() || '',
        subject: subject?.trim() || 'General Inquiry',
        message: message.trim(),
        createdAt: new Date().toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        isRead: false
      };

      const messages = getMessages();
      messages.unshift(newMessage);
      saveMessages(messages);

      res.json({
        success: true,
        message: 'Thank you for reaching out to Bright Star College. Your message has been received by our administration.'
      });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to process inquiry. Please try again: ' + err.message });
    }
  });

  // 9. View Contact Messages (Admin Protected)
  app.get('/api/messages', authenticateAdmin, (_req: Request, res: Response) => {
    try {
      const messages = getMessages();
      res.json(messages);
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to fetch messages: ' + err.message });
    }
  });

  // 10. Mark Message as Read or Delete (Admin Protected)
  app.patch('/api/messages/:id/read', authenticateAdmin, (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const messages = getMessages();
      const target = messages.find(m => m.id === id);
      if (target) {
        target.isRead = true;
        saveMessages(messages);
      }
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete('/api/messages/:id', authenticateAdmin, (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      let messages = getMessages();
      messages = messages.filter(m => m.id !== id);
      saveMessages(messages);
      res.json({ success: true, message: 'Message removed.' });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // 11. AI School Assistant Endpoint (Public)
  app.post('/api/ai-assistant', async (req: Request, res: Response) => {
    try {
      const { message } = req.body;
      if (!message || typeof message !== 'string') {
        res.status(400).json({ error: 'Message is required' });
        return;
      }

      const schoolData = getSchoolData();
      const apiKey = process.env.GEMINI_API_KEY;

      if (apiKey) {
        try {
          const { GoogleGenAI } = await import('@google/genai');
          const ai = new GoogleGenAI({ apiKey });
          const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: message,
            config: {
              systemInstruction: `You are StarBot, the helpful, polite, and official AI Admissions & Campus Assistant for BRIGHT STAR COLLEGE, located in Lekki, Lagos, Nigeria. 
School motto: "${schoolData.settings.motto}".
School tagline: "${schoolData.settings.tagline}".
Address: ${schoolData.settings.address}, ${schoolData.settings.cityState}, Nigeria.
Office hours: ${schoolData.settings.officeHours}.
Phone: ${schoolData.settings.phonePlaceholder}.
Email: ${schoolData.settings.emailPlaceholder}.
WhatsApp: ${schoolData.settings.whatsappNumber}.
Curriculum: Integrated British and Nigerian curriculum with science laboratories, ICT facilities, sports, moral discipline, and dedicated pastoral care.
Admissions status: Ongoing for the new academic session.
Always answer warmly in professional Nigerian English. Keep answers clear, concise (2-4 paragraphs max), polite, and encouraging. Encourage parents to book a campus visit or contact admissions directly via WhatsApp or the contact form.`
            }
          });

          if (response && response.text) {
            res.json({ reply: response.text });
            return;
          }
        } catch (genErr) {
          console.warn('Gemini API call failed, using intelligent fallback:', genErr);
        }
      }

      // Intelligent Fallback Knowledge Engine based on school data
      const q = message.toLowerCase();
      let reply = "";

      if (q.includes('admission') || q.includes('apply') || q.includes('enroll') || q.includes('register') || q.includes('form') || q.includes('entrance')) {
        reply = `Admissions at **Bright Star College, Lekki** are currently open for prospective students! 

To begin the admission process:
1. Complete our online inquiry form on the **Contact** page or reach our admissions officer on WhatsApp (${schoolData.settings.whatsappNumber}).
2. Schedule a convenient date for a campus walk-through and diagnostic assessment.
3. Submit previous academic records and passport photographs upon provisional offer.

Our admissions desk is open ${schoolData.settings.officeHours}. We look forward to welcoming your family!`;
      } else if (q.includes('fee') || q.includes('cost') || q.includes('tuition') || q.includes('price') || q.includes('naira')) {
        reply = `Thank you for inquiring about our school fees structure at **Bright Star College**. 

Our tuition and educational charges are competitive and provide exceptional value for qualitative, British & Nigerian standard education in Lekki, Lagos. 

Because fee schedules vary by year group and whether laboratory or boarding services are required, please chat with our Admissions Office directly on WhatsApp or call **${schoolData.settings.phonePlaceholder.split('/')[0]}** to receive the comprehensive fee prospectus.`;
      } else if (q.includes('curriculum') || q.includes('subject') || q.includes('waec') || q.includes('neco') || q.includes('cambridge') || q.includes('igcse') || q.includes('british')) {
        reply = `**Bright Star College** offers an enriched dual curriculum that synergises the **British National Curriculum** with the **Nigerian Basic & Senior Secondary Curriculum**. 

This comprehensive framework thoroughly prepares students for:
- BECE / Basic Education Certification
- WAEC (WASSCE) & NECO Senior School Certificate Examinations
- Cambridge IGCSE and international examinations

Our academic programmes emphasize STEM, computer programming & ICT, literature, creative arts, and moral character education.`;
      } else if (q.includes('location') || q.includes('where') || q.includes('address') || q.includes('lekki') || q.includes('map') || q.includes('campus')) {
        reply = `**Bright Star College** is located at **${schoolData.settings.address}, ${schoolData.settings.cityState}, Nigeria**. 

Our campus is situated in a safe, serene, and easily accessible environment along the Lekki corridor, purpose-built to foster focused learning and recreational growth. You can view our location map on the **Contact** page!`;
      } else if (q.includes('time') || q.includes('hour') || q.includes('resumption') || q.includes('open')) {
        reply = `Our campus administrative hours are **${schoolData.settings.officeHours}**, Monday through Friday. 

Academic classes commence promptly at 7:45 AM. For campus visits and admissions consultations, parents are warmly invited between 8:00 AM and 3:30 PM on weekdays.`;
      } else if (q.includes('whatsapp') || q.includes('call') || q.includes('contact') || q.includes('phone') || q.includes('email')) {
        reply = `You can easily connect with us through multiple official channels:
- **WhatsApp:** Click the green WhatsApp button below or message ${schoolData.settings.whatsappNumber}
- **Telephone:** ${schoolData.settings.phonePlaceholder}
- **Email:** ${schoolData.settings.emailPlaceholder}
- **In-person:** Visit our administrative reception in Lekki, Lagos during office hours.`;
      } else {
        reply = `Warm greetings from **Bright Star College, Lekki, Lagos**! 

We are dedicated to *${schoolData.settings.tagline}*. Whether you are inquiring about our curriculum, admissions procedures, student discipline, or scheduling a visit to our Lekki campus, we are delighted to assist you. 

How can we assist you and your child today? You can also message our admissions counselor directly on WhatsApp!`;
      }

      res.json({ reply });
    } catch (err: any) {
      console.error('Error in AI Assistant endpoint:', err);
      res.status(500).json({ error: 'Failed to process inquiry' });
    }
  });

  // 12. Supabase Configuration Endpoints (Admin Protected)
  app.get('/api/supabase-config', authenticateAdmin, (_req: Request, res: Response) => {
    try {
      const config = getSupabaseConfig();
      res.json(config);
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to retrieve Supabase config: ' + err.message });
    }
  });

  app.post('/api/supabase-config', authenticateAdmin, (req: Request, res: Response) => {
    try {
      const { projectUrl, anonKey, connectionString } = req.body;

      if (!projectUrl && !connectionString) {
        res.status(400).json({ error: 'Please enter your Supabase Project URL or Connection String.' });
        return;
      }

      let cleanUrl = (projectUrl || '').trim();
      let extractedRef = '';

      if (cleanUrl) {
        if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
          cleanUrl = 'https://' + cleanUrl;
        }
        const match = cleanUrl.match(/https?:\/\/([a-z0-9-]+)\.supabase\.co/i);
        if (match) {
          extractedRef = match[1];
        }
      }

      let connStr = (connectionString || '').trim();
      if (!cleanUrl && connStr) {
        const connMatch = connStr.match(/postgres\.([a-z0-9-]+):/i);
        if (connMatch) {
          extractedRef = connMatch[1];
          cleanUrl = `https://${extractedRef}.supabase.co`;
        }
      }

      const newConfig: SupabaseConfigData = {
        projectUrl: cleanUrl,
        anonKey: (anonKey || '').trim(),
        connectionString: connStr,
        isConnected: true,
        updatedAt: new Date().toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        projectRef: extractedRef
      };

      saveSupabaseConfig(newConfig);

      res.json({
        success: true,
        message: 'Supabase link successfully connected and saved!',
        config: newConfig
      });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to save Supabase config: ' + err.message });
    }
  });

  app.delete('/api/supabase-config', authenticateAdmin, (_req: Request, res: Response) => {
    try {
      const emptyConfig: SupabaseConfigData = {
        projectUrl: '',
        anonKey: '',
        connectionString: '',
        isConnected: false,
        updatedAt: '',
        projectRef: ''
      };
      saveSupabaseConfig(emptyConfig);
      res.json({ success: true, message: 'Supabase connection removed.' });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to remove Supabase config: ' + err.message });
    }
  });

  // --- VITE MIDDLEWARE OR STATIC SERVING ---
  const isProduction = process.env.NODE_ENV === 'production' && fs.existsSync(path.resolve(__dirname, 'dist'));

  if (isProduction) {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Bright Star College] Server running at http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal error starting server:', err);
  process.exit(1);
});
