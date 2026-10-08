-- ==============================================================================
-- BRIGHT STAR COLLEGE, LEKKI, LAGOS, NIGERIA
-- COMPLETE SUPABASE / POSTGRESQL DATABASE SCHEMA & MIGRATION SCRIPT
-- ==============================================================================
-- Run this script in the Supabase SQL Editor (Dashboard -> SQL Editor -> New Query)
-- It creates all required tables, Row Level Security (RLS) policies, storage bucket,
-- and seeds the initial data for Bright Star College.
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. SCHOOL SETTINGS TABLE
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

-- 3. HOMEPAGE CONTENT TABLE
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

-- 4. MISSION STATEMENT TABLE
CREATE TABLE IF NOT EXISTS public.mission_content (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL DEFAULT 'Our Mission',
    lead_statement TEXT NOT NULL,
    full_content TEXT NOT NULL,
    pillars JSONB DEFAULT '[]'::jsonb,
    last_updated TIMESTAMPTZ DEFAULT NOW()
);

-- 5. VISION STATEMENT TABLE
CREATE TABLE IF NOT EXISTS public.vision_content (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL DEFAULT 'Our Vision',
    lead_statement TEXT NOT NULL,
    full_content TEXT NOT NULL,
    core_outcomes JSONB DEFAULT '[]'::jsonb,
    last_updated TIMESTAMPTZ DEFAULT NOW()
);

-- 6. GALLERY IMAGES TABLE
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

-- 7. SCHOOL VIDEOS TABLE
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

-- 8. CONTACT INQUIRIES & ADMISSIONS MESSAGES TABLE
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

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.school_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.home_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mission_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vision_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.school_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_inquiries ENABLE ROW LEVEL SECURITY;

-- Public can read all public content
CREATE POLICY "Public Read Settings" ON public.school_settings FOR SELECT USING (true);
CREATE POLICY "Public Read Home" ON public.home_content FOR SELECT USING (true);
CREATE POLICY "Public Read Mission" ON public.mission_content FOR SELECT USING (true);
CREATE POLICY "Public Read Vision" ON public.vision_content FOR SELECT USING (true);
CREATE POLICY "Public Read Gallery" ON public.gallery_images FOR SELECT USING (true);
CREATE POLICY "Public Read Videos" ON public.school_videos FOR SELECT USING (true);

-- Public can insert new contact inquiries
CREATE POLICY "Public Insert Inquiries" ON public.contact_inquiries FOR INSERT WITH CHECK (true);

-- Authenticated Admin Full Management
CREATE POLICY "Admin All Settings" ON public.school_settings FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin All Home" ON public.home_content FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin All Mission" ON public.mission_content FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin All Vision" ON public.vision_content FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin All Gallery" ON public.gallery_images FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin All Videos" ON public.school_videos FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin All Inquiries" ON public.contact_inquiries FOR ALL TO authenticated USING (true);

-- ==============================================================================
-- INITIAL SEED DATA FOR BRIGHT STAR COLLEGE
-- ==============================================================================

-- Seed Settings
INSERT INTO public.school_settings (
    school_name, tagline, motto, logo_url, address, city_state, country,
    phone_placeholder, email_placeholder, whatsapp_number, office_hours, map_query
) VALUES (
    'BRIGHT STAR COLLEGE',
    'Building Bright Minds for a Brighter Future',
    'Excellence · Integrity · Discipline',
    '',
    'Lekki Peninsula Corridor',
    'Lekki, Lagos State',
    'Nigeria',
    '+234 (0) 800 000 0000 / +234 (0) 801 234 5678',
    'info@brightstarcollege.ng / admissions@brightstarcollege.ng',
    '+2348000000000',
    'Monday – Friday: 7:30 AM – 4:30 PM',
    'Lekki, Lagos, Nigeria'
) ON CONFLICT DO NOTHING;

-- Seed Home Content with the Hero Picture
INSERT INTO public.home_content (
    hero_title, hero_subtitle, hero_cta_primary, hero_cta_secondary, hero_image_url,
    about_title, about_subtitle, about_content, about_highlights, features,
    contact_cta_title, contact_cta_subtitle
) VALUES (
    'Building Bright Minds for a Brighter Future',
    'Providing qualitative education in a nurturing, disciplined, and technologically enriched learning environment in Lekki, Lagos. Empowering young leaders for global relevance and personal integrity.',
    'LEARN MORE',
    'CONTACT US',
    'https://i.ibb.co/PvLmXqc3/312891.jpg',
    'Welcome to Bright Star College',
    'Dedicated to Academic Distinction and Moral Integrity',
    'Bright Star College, Lekki, Lagos is committed to providing quality education, developing confident learners, and preparing students for future success. In a rapidly evolving world, we combine rigorous academic foundations with sound character formation, moral discipline, and 21st-century problem-solving capabilities. Our school community fosters curiosity, mutual respect, and high personal standards, ensuring that every learner discovers their unique potential.',
    '[
      "Rigorous British and Nigerian national curriculum integration",
      "Disciplined, secure, and serene learning environment in Lekki",
      "Emphasis on character formation, civic responsibility, and moral leadership",
      "Individualized student support and comprehensive pastoral care",
      "Modern science, ICT, and creative arts learning facilities"
    ]'::jsonb,
    '[
      {"id":"feat-1","title":"Quality Education","description":"A well-rounded academic curriculum blending Nigerian and international standards designed to ignite intellectual curiosity and mastery.","iconName":"GraduationCap"},
      {"id":"feat-2","title":"Experienced Educators","description":"Passionate, certified teachers and subject matter specialists committed to nurturing every learner cognitive and personal growth.","iconName":"Users"},
      {"id":"feat-3","title":"Safe Learning Environment","description":"A secure, modern, and supportive campus designed to safeguard our students physical well-being and emotional development.","iconName":"ShieldCheck"},
      {"id":"feat-4","title":"Character Development","description":"Instilling timeless values of integrity, empathy, personal discipline, and respect across all curricular and extracurricular activities.","iconName":"HeartHandshake"},
      {"id":"feat-5","title":"Modern Learning Approach","description":"Practical STEM laboratories, digital literacy, and collaborative classroom methodologies preparing students for the 21st century.","iconName":"Sparkles"},
      {"id":"feat-6","title":"Student-Centred Education","description":"Prioritising each child individual pace, strengths, and talents through attentive mentoring and tailored enrichment.","iconName":"Award"}
    ]'::jsonb,
    'Give Your Child a Bright Future',
    'Enrollment inquiries and campus visit reservations for Bright Star College are now open. Speak with our admissions team today.'
) ON CONFLICT DO NOTHING;

-- Seed Mission
INSERT INTO public.mission_content (
    title, lead_statement, full_content, pillars
) VALUES (
    'Our Mission',
    'To cultivate an inspiring, disciplined, and inclusive educational atmosphere where every child attains academic excellence, demonstrates moral integrity, and develops critical thinking skills to positively impact their community and the world.',
    'At Bright Star College, our mission is rooted in the belief that education is the foundation for individual empowerment and societal progress. We exist to deliver comprehensive education that stimulates intellectual rigor, moral uprightness, creative inquiry, and civic responsibility. We partner closely with parents and guardians to guide students into becoming resilient, ethical, and self-motivated global citizens who lead with honour and purpose.',
    '[
      {"title":"Academic Excellence","description":"Challenging every student to achieve their highest intellectual potential through conceptual understanding and disciplined study habits."},
      {"title":"Character & Discipline","description":"Cultivating respect, punctuality, integrity, and personal accountability as daily core habits of mind."},
      {"title":"Creativity & Critical Thinking","description":"Encouraging learners to question constructively, analyse critically, and innovate creative solutions to real-world challenges."},
      {"title":"Responsible Citizenship","description":"Instilling deep appreciation for community service, cultural diversity, and responsible contribution to Nigerian society and the wider world."},
      {"title":"Future Readiness","description":"Equipping learners with digital literacy, communication dexterity, and adaptability essential for higher education and future careers."}
    ]'::jsonb
) ON CONFLICT DO NOTHING;

-- Seed Vision
INSERT INTO public.vision_content (
    title, lead_statement, full_content, core_outcomes
) VALUES (
    'Our Vision',
    'To be a benchmark of educational distinction in Lagos and Nigeria, renowned for raising confident, creative, and principled leaders poised to excel on both national and international stages.',
    'Our vision is to build an enduring citadel of learning where students are transformed into independent thinkers, ethical problem solvers, and lifelong scholars. We envision a community where tradition and innovation meet—where high academic standards coexist harmoniously with compassionate character building, producing graduates who stand as beacons of hope and excellence wherever they go.',
    '[
      {"title":"Confident Learners","description":"Students who trust in their abilities, articulate their perspectives with poise, and approach unfamiliar challenges without fear."},
      {"title":"Responsible Citizens","description":"Individuals who value community welfare, show empathy toward others, and uphold ethical principles in all actions."},
      {"title":"Future Leaders","description":"Visionary thinkers equipped with moral clarity, teamwork capabilities, and the resilience to guide others constructively."},
      {"title":"Creative Thinkers","description":"Inventive minds capable of thinking outside conventional boundaries, synthesising ideas, and pioneering resourceful solutions."},
      {"title":"Lifelong Learners","description":"Graduates possessing insatiable intellectual curiosity, self-discipline, and a persistent drive for continual self-improvement."}
    ]'::jsonb
) ON CONFLICT DO NOTHING;
