-- Create photographers table
CREATE TABLE IF NOT EXISTS public.photographers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    specialization TEXT NOT NULL,
    rating NUMERIC(2,1) DEFAULT 0.0,
    reviews INTEGER DEFAULT 0,
    price TEXT NOT NULL,
    location TEXT NOT NULL,
    image_url TEXT,
    bio TEXT,
    portfolio_count INTEGER DEFAULT 0,
    experience_years INTEGER DEFAULT 0,
    user_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Create rentals table
CREATE TABLE IF NOT EXISTS public.rentals (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    price TEXT NOT NULL,
    rating NUMERIC(2,1) DEFAULT 0.0,
    location TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    owner_id UUID REFERENCES auth.users(id),
    available BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Enable Row Level Security
ALTER TABLE public.photographers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rentals ENABLE ROW LEVEL SECURITY;

-- Create policies for photographers
CREATE POLICY "Photographers are viewable by everyone" ON public.photographers
    FOR SELECT USING (true);

CREATE POLICY "Users can insert their own photographer profile" ON public.photographers
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own photographer profile" ON public.photographers
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own photographer profile" ON public.photographers
    FOR DELETE USING (auth.uid() = user_id);

-- Create policies for rentals
CREATE POLICY "Rentals are viewable by everyone" ON public.rentals
    FOR SELECT USING (true);

CREATE POLICY "Users can insert their own rentals" ON public.rentals
    FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update their own rentals" ON public.rentals
    FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "Users can delete their own rentals" ON public.rentals
    FOR DELETE USING (auth.uid() = owner_id);

-- Insert sample data for photographers
INSERT INTO public.photographers (name, specialization, rating, reviews, price, location, image_url, bio, portfolio_count, experience_years) VALUES
    ('Sarah Johnson', 'Wedding Photography', 4.9, 127, '$2,500-$5,000', 'New York, NY', 'https://images.unsplash.com/photo-1494790108755-2616b612b786', 'Award-winning wedding photographer with 8 years of experience capturing beautiful moments.', 45, 8),
    ('Michael Chen', 'Portrait Photography', 4.8, 89, '$800-$1,500', 'San Francisco, CA', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d', 'Specializing in professional headshots and family portraits with a modern touch.', 32, 6),
    ('Emma Rodriguez', 'Event Photography', 4.7, 156, '$1,200-$3,000', 'Los Angeles, CA', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80', 'Corporate events, parties, and special occasions captured with creativity and style.', 78, 10),
    ('David Park', 'Nature & Landscape', 4.9, 93, '$600-$1,200', 'Seattle, WA', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e', 'Passionate about capturing the beauty of nature and stunning landscapes.', 67, 7),
    ('Lisa Thompson', 'Fashion Photography', 4.8, 74, '$1,500-$4,000', 'Miami, FL', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb', 'High-end fashion and editorial photography for brands and magazines.', 54, 9);

-- Insert sample data for rentals
INSERT INTO public.rentals (name, category, price, rating, location, description, image_url, available) VALUES
    ('Canon EOS R5', 'Cameras', '$150/day', 4.9, 'New York, NY', 'Professional mirrorless camera with 45MP sensor and 8K video recording.', 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32', true),
    ('Sony A7S III', 'Cameras', '$120/day', 4.8, 'Los Angeles, CA', 'Full-frame mirrorless perfect for video with excellent low-light performance.', 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd', true),
    ('DJI Mavic 3', 'Drones', '$200/day', 4.9, 'San Francisco, CA', 'Professional drone with Hasselblad camera and 5.1K video recording.', 'https://images.unsplash.com/photo-1527977966376-1c8408f9f108', true),
    ('Godox AD200 Pro', 'Lighting', '$80/day', 4.7, 'Chicago, IL', 'Portable flash system with 200Ws power and lithium battery.', 'https://images.unsplash.com/photo-1519638399535-1b036603ac77', true),
    ('Sigma 85mm f/1.4', 'Lenses', '$60/day', 4.8, 'Miami, FL', 'Professional portrait lens with beautiful bokeh and sharp optics.', 'https://images.unsplash.com/photo-1617005082133-548c4dd27f35', true),
    ('Manfrotto Tripod', 'Accessories', '$25/day', 4.6, 'Boston, MA', 'Heavy-duty aluminum tripod with fluid head for smooth movements.', 'https://images.unsplash.com/photo-1495707902641-75cac588d2e9', true);