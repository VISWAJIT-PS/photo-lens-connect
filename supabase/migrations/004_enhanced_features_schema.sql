-- =====================================================
-- Enhanced Features Schema - Chat, Notifications, Bookings, User Management
-- =====================================================
-- This migration adds the missing tables for advanced features

-- =====================================================
-- CHAT SYSTEM TABLES
-- =====================================================

-- Chat conversations table
CREATE TABLE public.chats (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    type TEXT DEFAULT 'direct' CHECK (type IN ('direct', 'group')),
    title TEXT,
    description TEXT,
    created_by TEXT REFERENCES public.event_users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Chat participants table
CREATE TABLE public.chat_participants (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    chat_id UUID NOT NULL REFERENCES public.chats(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL REFERENCES public.event_users(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'member' CHECK (role IN ('admin', 'member')),
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    last_read_at TIMESTAMPTZ DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE,
    UNIQUE(chat_id, user_id)
);

-- Chat messages table
CREATE TABLE public.chat_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    chat_id UUID NOT NULL REFERENCES public.chats(id) ON DELETE CASCADE,
    sender_id TEXT NOT NULL REFERENCES public.event_users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'file', 'system')),
    file_url TEXT,
    file_name TEXT,
    file_size BIGINT,
    is_edited BOOLEAN DEFAULT FALSE,
    edited_at TIMESTAMPTZ,
    reply_to_id UUID REFERENCES public.chat_messages(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- NOTIFICATIONS SYSTEM TABLES
-- =====================================================

-- Notifications table
CREATE TABLE public.notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES public.event_users(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('booking', 'message', 'photo_match', 'event_update', 'system')),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    data JSONB DEFAULT '{}', -- Additional notification data
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMPTZ,
    action_url TEXT,
    priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User notification preferences
CREATE TABLE public.notification_preferences (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES public.event_users(id) ON DELETE CASCADE,
    email_enabled BOOLEAN DEFAULT TRUE,
    push_enabled BOOLEAN DEFAULT TRUE,
    sms_enabled BOOLEAN DEFAULT FALSE,
    booking_notifications BOOLEAN DEFAULT TRUE,
    message_notifications BOOLEAN DEFAULT TRUE,
    photo_match_notifications BOOLEAN DEFAULT TRUE,
    event_update_notifications BOOLEAN DEFAULT TRUE,
    marketing_notifications BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id)
);

-- =====================================================
-- BOOKINGS SYSTEM TABLES
-- =====================================================

-- Bookings table (customer-photographer reservations)
CREATE TABLE public.bookings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_id TEXT NOT NULL REFERENCES public.event_users(id) ON DELETE CASCADE,
    photographer_id TEXT NOT NULL REFERENCES public.event_users(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL,
    event_date DATE NOT NULL,
    event_time TIME,
    duration_hours INTEGER,
    location TEXT NOT NULL,
    budget_min DECIMAL(10,2),
    budget_max DECIMAL(10,2),
    currency TEXT DEFAULT 'USD',
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled', 'refunded')),
    requirements TEXT,
    special_requests TEXT,
    contract_url TEXT,
    invoice_url TEXT,
    total_amount DECIMAL(10,2),
    deposit_amount DECIMAL(10,2),
    deposit_paid BOOLEAN DEFAULT FALSE,
    final_payment_due DATE,
    cancellation_reason TEXT,
    cancellation_date TIMESTAMPTZ,
    created_by TEXT REFERENCES public.event_users(id),
    assigned_team JSONB DEFAULT '[]', -- Array of team member IDs
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Booking notes and communications
CREATE TABLE public.booking_notes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
    author_id TEXT NOT NULL REFERENCES public.event_users(id),
    note_type TEXT DEFAULT 'internal' CHECK (note_type IN ('internal', 'customer_communication', 'reminder')),
    title TEXT,
    content TEXT NOT NULL,
    is_private BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- ADVANCED USER MANAGEMENT TABLES
-- =====================================================

-- User roles and permissions
CREATE TABLE public.user_roles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES public.event_users(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('customer', 'photographer', 'admin', 'moderator')),
    permissions JSONB DEFAULT '{}',
    granted_by TEXT REFERENCES public.event_users(id),
    granted_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT TRUE,
    UNIQUE(user_id, role)
);

-- User profiles (extended information)
CREATE TABLE public.user_profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES public.event_users(id) ON DELETE CASCADE,
    bio TEXT,
    website TEXT,
    social_links JSONB DEFAULT '{}',
    experience_years INTEGER,
    specializations TEXT[],
    certifications TEXT[],
    languages TEXT[],
    timezone TEXT DEFAULT 'UTC',
    availability_status TEXT DEFAULT 'available' CHECK (availability_status IN ('available', 'busy', 'unavailable')),
    response_time_hours INTEGER DEFAULT 24,
    portfolio_url TEXT,
    business_name TEXT,
    business_address TEXT,
    tax_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id)
);

-- User onboarding data
CREATE TABLE public.user_onboarding (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES public.event_users(id) ON DELETE CASCADE,
    step TEXT NOT NULL,
    data JSONB DEFAULT '{}',
    is_completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, step)
);

-- =====================================================
-- FACE RECOGNITION AND PHOTO MATCHING
-- =====================================================

-- Face recognition results
CREATE TABLE public.face_recognition_results (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    photo_id TEXT NOT NULL REFERENCES public.event_photos(id) ON DELETE CASCADE,
    user_id TEXT REFERENCES public.event_users(id) ON DELETE CASCADE,
    confidence_score DECIMAL(5,2) NOT NULL,
    bounding_box JSONB, -- {x, y, width, height}
    face_encoding TEXT, -- Base64 encoded face vector
    algorithm_version TEXT DEFAULT '1.0',
    is_verified BOOLEAN DEFAULT FALSE,
    verified_by TEXT REFERENCES public.event_users(id),
    verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Photo matching queue
CREATE TABLE public.photo_matching_queue (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    photo_id TEXT NOT NULL REFERENCES public.event_photos(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    priority INTEGER DEFAULT 0,
    attempts INTEGER DEFAULT 0,
    max_attempts INTEGER DEFAULT 3,
    error_message TEXT,
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Chat indexes
CREATE INDEX idx_chats_created_at ON public.chats(created_at DESC);
CREATE INDEX idx_chats_updated_at ON public.chats(updated_at DESC);
CREATE INDEX idx_chat_participants_chat_id ON public.chat_participants(chat_id);
CREATE INDEX idx_chat_participants_user_id ON public.chat_participants(user_id);
CREATE INDEX idx_chat_messages_chat_id ON public.chat_messages(chat_id);
CREATE INDEX idx_chat_messages_sender_id ON public.chat_messages(sender_id);
CREATE INDEX idx_chat_messages_created_at ON public.chat_messages(created_at DESC);

-- Notifications indexes
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_is_read ON public.notifications(is_read);
CREATE INDEX idx_notifications_type ON public.notifications(type);
CREATE INDEX idx_notifications_created_at ON public.notifications(created_at DESC);
CREATE INDEX idx_notification_preferences_user_id ON public.notification_preferences(user_id);

-- Bookings indexes
CREATE INDEX idx_bookings_customer_id ON public.bookings(customer_id);
CREATE INDEX idx_bookings_photographer_id ON public.bookings(photographer_id);
CREATE INDEX idx_bookings_status ON public.bookings(status);
CREATE INDEX idx_bookings_event_date ON public.bookings(event_date DESC);
CREATE INDEX idx_bookings_created_at ON public.bookings(created_at DESC);
CREATE INDEX idx_booking_notes_booking_id ON public.booking_notes(booking_id);
CREATE INDEX idx_booking_notes_author_id ON public.booking_notes(author_id);

-- User management indexes
CREATE INDEX idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX idx_user_roles_role ON public.user_roles(role);
CREATE INDEX idx_user_profiles_user_id ON public.user_profiles(user_id);
CREATE INDEX idx_user_onboarding_user_id ON public.user_onboarding(user_id);

-- Face recognition indexes
CREATE INDEX idx_face_recognition_photo_id ON public.face_recognition_results(photo_id);
CREATE INDEX idx_face_recognition_user_id ON public.face_recognition_results(user_id);
CREATE INDEX idx_face_recognition_confidence ON public.face_recognition_results(confidence_score DESC);
CREATE INDEX idx_photo_matching_queue_status ON public.photo_matching_queue(status);
CREATE INDEX idx_photo_matching_queue_priority ON public.photo_matching_queue(priority DESC);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS on all new tables
ALTER TABLE public.chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_onboarding ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.face_recognition_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.photo_matching_queue ENABLE ROW LEVEL SECURITY;

-- Chat policies
CREATE POLICY "Users can view chats they participate in" ON public.chats
    FOR SELECT USING (
        id IN (
            SELECT chat_id FROM public.chat_participants
            WHERE user_id = auth.uid()::text
        )
    );

CREATE POLICY "Users can view chat participants for their chats" ON public.chat_participants
    FOR SELECT USING (
        chat_id IN (
            SELECT chat_id FROM public.chat_participants cp
            WHERE cp.user_id = auth.uid()::text
        )
    );

CREATE POLICY "Users can view messages in their chats" ON public.chat_messages
    FOR SELECT USING (
        chat_id IN (
            SELECT chat_id FROM public.chat_participants
            WHERE user_id = auth.uid()::text
        )
    );

CREATE POLICY "Users can insert messages in their chats" ON public.chat_messages
    FOR INSERT WITH CHECK (
        sender_id = auth.uid()::text AND
        chat_id IN (
            SELECT chat_id FROM public.chat_participants
            WHERE user_id = auth.uid()::text
        )
    );

-- Notification policies
CREATE POLICY "Users can view their own notifications" ON public.notifications
    FOR SELECT USING (user_id = auth.uid()::text);

CREATE POLICY "Users can update their own notifications" ON public.notifications
    FOR UPDATE USING (user_id = auth.uid()::text);

CREATE POLICY "Users can view their notification preferences" ON public.notification_preferences
    FOR SELECT USING (user_id = auth.uid()::text);

CREATE POLICY "Users can update their notification preferences" ON public.notification_preferences
    FOR ALL USING (user_id = auth.uid()::text);

-- Booking policies
CREATE POLICY "Customers can view their own bookings" ON public.bookings
    FOR SELECT USING (customer_id = auth.uid()::text);

CREATE POLICY "Photographers can view bookings they're assigned to" ON public.bookings
    FOR SELECT USING (photographer_id = auth.uid()::text);

CREATE POLICY "Users can view their booking notes" ON public.booking_notes
    FOR SELECT USING (
        booking_id IN (
            SELECT id FROM public.bookings
            WHERE customer_id = auth.uid()::text OR photographer_id = auth.uid()::text
        )
    );

-- User management policies
CREATE POLICY "Users can view their own roles" ON public.user_roles
    FOR SELECT USING (user_id = auth.uid()::text);

CREATE POLICY "Users can view their own profile" ON public.user_profiles
    FOR SELECT USING (user_id = auth.uid()::text);

CREATE POLICY "Users can update their own profile" ON public.user_profiles
    FOR ALL USING (user_id = auth.uid()::text);

CREATE POLICY "Users can view their onboarding data" ON public.user_onboarding
    FOR SELECT USING (user_id = auth.uid()::text);

CREATE POLICY "Users can update their onboarding data" ON public.user_onboarding
    FOR ALL USING (user_id = auth.uid()::text);

-- Admin policies
CREATE POLICY "Admins can manage all chats" ON public.chats
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.user_roles
            WHERE user_id = auth.uid()::text AND role = 'admin' AND is_active = TRUE
        )
    );

CREATE POLICY "Admins can manage all bookings" ON public.bookings
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.user_roles
            WHERE user_id = auth.uid()::text AND role = 'admin' AND is_active = TRUE
        )
    );

-- =====================================================
-- TRIGGERS FOR AUTOMATIC UPDATES
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers to new tables
CREATE TRIGGER handle_chats_updated_at
    BEFORE UPDATE ON public.chats
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_chat_messages_updated_at
    BEFORE UPDATE ON public.chat_messages
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_bookings_updated_at
    BEFORE UPDATE ON public.bookings
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_user_profiles_updated_at
    BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_notification_preferences_updated_at
    BEFORE UPDATE ON public.notification_preferences
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Function to update chat's updated_at when new message is added
CREATE OR REPLACE FUNCTION public.update_chat_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.chats
    SET updated_at = NOW()
    WHERE id = NEW.chat_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER handle_chat_message_timestamp
    AFTER INSERT ON public.chat_messages
    FOR EACH ROW EXECUTE FUNCTION public.update_chat_timestamp();

-- Function to update last_read_at for chat participants
CREATE OR REPLACE FUNCTION public.update_chat_participant_read()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.chat_participants
    SET last_read_at = NOW()
    WHERE chat_id = NEW.chat_id AND user_id = NEW.sender_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER handle_chat_participant_read
    AFTER INSERT ON public.chat_messages
    FOR EACH ROW EXECUTE FUNCTION public.update_chat_participant_read();

-- =====================================================
-- FUNCTIONS FOR BUSINESS LOGIC
-- =====================================================

-- Function to create a direct chat between two users
CREATE OR REPLACE FUNCTION public.create_direct_chat(user1_id TEXT, user2_id TEXT)
RETURNS UUID AS $$
DECLARE
    chat_id UUID;
    existing_chat_id UUID;
BEGIN
    -- Check if chat already exists between these users
    SELECT c.id INTO existing_chat_id
    FROM public.chats c
    JOIN public.chat_participants cp1 ON c.id = cp1.chat_id
    JOIN public.chat_participants cp2 ON c.id = cp2.chat_id
    WHERE c.type = 'direct'
    AND cp1.user_id = user1_id
    AND cp2.user_id = user2_id;

    IF existing_chat_id IS NOT NULL THEN
        RETURN existing_chat_id;
    END IF;

    -- Create new chat
    INSERT INTO public.chats (type, created_by)
    VALUES ('direct', user1_id)
    RETURNING id INTO chat_id;

    -- Add participants
    INSERT INTO public.chat_participants (chat_id, user_id)
    VALUES (chat_id, user1_id), (chat_id, user2_id);

    RETURN chat_id;
END;
$$ LANGUAGE plpgsql;

-- Function to create notification
CREATE OR REPLACE FUNCTION public.create_notification(
    p_user_id TEXT,
    p_type TEXT,
    p_title TEXT,
    p_message TEXT,
    p_data JSONB DEFAULT '{}',
    p_action_url TEXT DEFAULT NULL,
    p_priority TEXT DEFAULT 'normal'
)
RETURNS UUID AS $$
DECLARE
    notification_id UUID;
BEGIN
    INSERT INTO public.notifications (
        user_id, type, title, message, data, action_url, priority
    )
    VALUES (p_user_id, p_type, p_title, p_message, p_data, p_action_url, p_priority)
    RETURNING id INTO notification_id;

    RETURN notification_id;
END;
$$ LANGUAGE plpgsql;

-- Function to update booking status and notify parties
CREATE OR REPLACE FUNCTION public.update_booking_status(
    p_booking_id UUID,
    p_new_status TEXT,
    p_updated_by TEXT
)
RETURNS VOID AS $$
DECLARE
    booking_record RECORD;
BEGIN
    -- Update booking status
    UPDATE public.bookings
    SET status = p_new_status, updated_at = NOW()
    WHERE id = p_booking_id
    RETURNING * INTO booking_record;

    -- Create notifications for both parties
    IF p_updated_by != booking_record.customer_id THEN
        PERFORM public.create_notification(
            booking_record.customer_id,
            'booking',
            'Booking Status Updated',
            'Your booking status has been updated to: ' || p_new_status,
            jsonb_build_object('booking_id', p_booking_id, 'new_status', p_new_status),
            '/bookings/' || p_booking_id,
            'normal'
        );
    END IF;

    IF p_updated_by != booking_record.photographer_id THEN
        PERFORM public.create_notification(
            booking_record.photographer_id,
            'booking',
            'Booking Status Updated',
            'Booking status has been updated to: ' || p_new_status,
            jsonb_build_object('booking_id', p_booking_id, 'new_status', p_new_status),
            '/bookings/' || p_booking_id,
            'normal'
        );
    END IF;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- SAMPLE DATA FOR TESTING
-- =====================================================

-- Insert sample user roles
INSERT INTO public.user_roles (user_id, role, permissions) VALUES
('user-001', 'customer', '{"can_book": true, "can_chat": true}'),
('user-002', 'photographer', '{"can_manage_bookings": true, "can_upload_portfolio": true, "can_chat": true}'),
('user-003', 'admin', '{"can_manage_all": true, "can_moderate": true}');

-- Insert sample user profiles
INSERT INTO public.user_profiles (user_id, bio, experience_years, specializations, languages) VALUES
('user-001', 'Photography enthusiast and event attendee', 2, ARRAY['portraits', 'events'], ARRAY['English']),
('user-002', 'Professional wedding and event photographer', 8, ARRAY['weddings', 'corporate', 'portraits'], ARRAY['English', 'Spanish']);

-- Insert sample notification preferences
INSERT INTO public.notification_preferences (user_id, email_enabled, push_enabled, booking_notifications, message_notifications) VALUES
('user-001', true, true, true, true),
('user-002', true, true, true, true);

-- =====================================================
-- REFRESH SCHEMA CACHE
-- =====================================================

-- Refresh the schema cache to ensure all changes are applied
NOTIFY pgrst, 'reload schema';