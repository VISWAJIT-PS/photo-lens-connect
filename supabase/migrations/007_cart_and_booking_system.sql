-- Cart and Booking System Tables
-- This migration creates tables for shopping cart functionality and booking management

-- =====================================================
-- CART ITEMS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS cart_items (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  rental_id integer NOT NULL REFERENCES rentals(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES event_users(id) ON DELETE CASCADE,
  quantity integer NOT NULL DEFAULT 1 CHECK (quantity > 0),
  rental_date date NOT NULL,
  return_date date NOT NULL,
  total_price decimal(10,2) NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'reserved', 'cancelled')),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,

  -- Ensure return date is after rental date
  CONSTRAINT valid_date_range CHECK (return_date >= rental_date),

  -- Prevent duplicate active cart items for same rental and user
  CONSTRAINT unique_active_cart_item UNIQUE (rental_id, user_id, status)
    DEFERRABLE INITIALLY DEFERRED
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_cart_items_user_id ON cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_rental_id ON cart_items(rental_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_status ON cart_items(status);
CREATE INDEX IF NOT EXISTS idx_cart_items_dates ON cart_items(rental_date, return_date);

-- Enable RLS
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies for cart_items
CREATE POLICY "Users can view their own cart items" ON cart_items
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert their own cart items" ON cart_items
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update their own cart items" ON cart_items
  FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete their own cart items" ON cart_items
  FOR DELETE USING (auth.uid()::text = user_id::text);

-- =====================================================
-- BOOKING ITEMS TABLE (for multi-item bookings)
-- =====================================================

CREATE TABLE IF NOT EXISTS booking_items (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id uuid NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  rental_id integer NOT NULL REFERENCES rentals(id) ON DELETE RESTRICT,
  quantity integer NOT NULL DEFAULT 1 CHECK (quantity > 0),
  rental_date date NOT NULL,
  return_date date NOT NULL,
  unit_price decimal(10,2) NOT NULL,
  total_price decimal(10,2) NOT NULL,
  status text NOT NULL DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled', 'returned')),
  notes text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,

  -- Ensure return date is after rental date
  CONSTRAINT valid_booking_date_range CHECK (return_date >= rental_date)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_booking_items_booking_id ON booking_items(booking_id);
CREATE INDEX IF NOT EXISTS idx_booking_items_rental_id ON booking_items(rental_id);
CREATE INDEX IF NOT EXISTS idx_booking_items_status ON booking_items(status);

-- Enable RLS
ALTER TABLE booking_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies for booking_items
CREATE POLICY "Users can view booking items for their bookings" ON booking_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM bookings b
      WHERE b.id = booking_items.booking_id
      AND (b.customer_id::text = auth.uid()::text OR b.photographer_id::text = auth.uid()::text)
    )
  );

CREATE POLICY "System can insert booking items" ON booking_items
  FOR INSERT WITH CHECK (true); -- Handled by application logic

CREATE POLICY "System can update booking items" ON booking_items
  FOR UPDATE USING (true); -- Handled by application logic

-- =====================================================
-- RENTAL AVAILABILITY TRACKING
-- =====================================================

CREATE TABLE IF NOT EXISTS rental_availability (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  rental_id integer NOT NULL REFERENCES rentals(id) ON DELETE CASCADE,
  date date NOT NULL,
  available_quantity integer NOT NULL DEFAULT 1,
  reserved_quantity integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,

  -- Ensure quantities are valid
  CONSTRAINT valid_quantities CHECK (available_quantity >= 0 AND reserved_quantity >= 0),

  -- One record per rental per date
  UNIQUE(rental_id, date)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_rental_availability_rental_id ON rental_availability(rental_id);
CREATE INDEX IF NOT EXISTS idx_rental_availability_date ON rental_availability(date);

-- Enable RLS
ALTER TABLE rental_availability ENABLE ROW LEVEL SECURITY;

-- RLS Policies for rental_availability
CREATE POLICY "Anyone can view rental availability" ON rental_availability
  FOR SELECT USING (true);

CREATE POLICY "System can manage rental availability" ON rental_availability
  FOR ALL USING (true); -- Handled by application logic

-- =====================================================
-- RENTAL REVIEWS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS rental_reviews (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  rental_id integer NOT NULL REFERENCES rentals(id) ON DELETE CASCADE,
  booking_id uuid REFERENCES bookings(id) ON DELETE SET NULL,
  reviewer_id uuid NOT NULL REFERENCES event_users(id) ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text text,
  pros text[],
  cons text[],
  would_recommend boolean,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,

  -- One review per user per rental
  UNIQUE(rental_id, reviewer_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_rental_reviews_rental_id ON rental_reviews(rental_id);
CREATE INDEX IF NOT EXISTS idx_rental_reviews_reviewer_id ON rental_reviews(reviewer_id);
CREATE INDEX IF NOT EXISTS idx_rental_reviews_rating ON rental_reviews(rating);

-- Enable RLS
ALTER TABLE rental_reviews ENABLE ROW LEVEL SECURITY;

-- RLS Policies for rental_reviews
CREATE POLICY "Anyone can view rental reviews" ON rental_reviews
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own reviews" ON rental_reviews
  FOR INSERT WITH CHECK (auth.uid()::text = reviewer_id::text);

CREATE POLICY "Users can update their own reviews" ON rental_reviews
  FOR UPDATE USING (auth.uid()::text = reviewer_id::text);

CREATE POLICY "Users can delete their own reviews" ON rental_reviews
  FOR DELETE USING (auth.uid()::text = reviewer_id::text);

-- =====================================================
-- FUNCTIONS FOR CART MANAGEMENT
-- =====================================================

-- Function to calculate cart total
CREATE OR REPLACE FUNCTION calculate_cart_total(user_id_param uuid)
RETURNS decimal(10,2) AS $$
DECLARE
  total decimal(10,2) := 0;
BEGIN
  SELECT COALESCE(SUM(total_price), 0)
  INTO total
  FROM cart_items
  WHERE user_id = user_id_param AND status = 'active';

  RETURN total;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check rental availability
CREATE OR REPLACE FUNCTION check_rental_availability(
  rental_id_param integer,
  start_date date,
  end_date date,
  requested_quantity integer DEFAULT 1
)
RETURNS boolean AS $$
DECLARE
  available boolean := true;
  current_date date;
BEGIN
  -- Check each date in the range
  current_date := start_date;
  WHILE current_date <= end_date LOOP
    -- Check if there's enough availability for this date
    SELECT available_quantity >= requested_quantity
    INTO available
    FROM rental_availability
    WHERE rental_id = rental_id_param AND date = current_date;

    -- If no availability record exists, assume unlimited availability
    IF NOT FOUND THEN
      -- Create availability record if it doesn't exist
      INSERT INTO rental_availability (rental_id, date, available_quantity)
      SELECT rental_id_param, current_date, 999
      ON CONFLICT (rental_id, date) DO NOTHING;
      available := true;
    END IF;

    -- If not available on any date, return false
    IF NOT available THEN
      RETURN false;
    END IF;

    current_date := current_date + 1;
  END LOOP;

  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to reserve rental items
CREATE OR REPLACE FUNCTION reserve_rental_items(
  rental_id_param integer,
  start_date date,
  end_date date,
  quantity integer DEFAULT 1
)
RETURNS boolean AS $$
DECLARE
  current_date date;
  success boolean := true;
BEGIN
  -- Reserve quantity for each date in the range
  current_date := start_date;
  WHILE current_date <= end_date AND success LOOP
    -- Update or insert availability record
    INSERT INTO rental_availability (rental_id, date, available_quantity, reserved_quantity)
    VALUES (rental_id_param, current_date, 999, quantity)
    ON CONFLICT (rental_id, date)
    DO UPDATE SET
      reserved_quantity = rental_availability.reserved_quantity + quantity,
      updated_at = NOW();

    current_date := current_date + 1;
  END LOOP;

  RETURN success;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to release rental reservations
CREATE OR REPLACE FUNCTION release_rental_reservations(
  rental_id_param integer,
  start_date date,
  end_date date,
  quantity integer DEFAULT 1
)
RETURNS boolean AS $$
DECLARE
  current_date date;
  success boolean := true;
BEGIN
  -- Release quantity for each date in the range
  current_date := start_date;
  WHILE current_date <= end_date AND success LOOP
    -- Update availability record
    UPDATE rental_availability
    SET
      reserved_quantity = GREATEST(reserved_quantity - quantity, 0),
      updated_at = NOW()
    WHERE rental_id = rental_id_param AND date = current_date;

    current_date := current_date + 1;
  END LOOP;

  RETURN success;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- TRIGGERS FOR AUTOMATIC UPDATES
-- =====================================================

-- Trigger to update cart_items updated_at timestamp
CREATE OR REPLACE FUNCTION update_cart_items_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_cart_items_updated_at
  BEFORE UPDATE ON cart_items
  FOR EACH ROW
  EXECUTE FUNCTION update_cart_items_updated_at();

-- Trigger to update booking_items updated_at timestamp
CREATE OR REPLACE FUNCTION update_booking_items_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_booking_items_updated_at
  BEFORE UPDATE ON booking_items
  FOR EACH ROW
  EXECUTE FUNCTION update_booking_items_updated_at();

-- Trigger to update rental_availability updated_at timestamp
CREATE OR REPLACE FUNCTION update_rental_availability_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_rental_availability_updated_at
  BEFORE UPDATE ON rental_availability
  FOR EACH ROW
  EXECUTE FUNCTION update_rental_availability_updated_at();

-- Trigger to update rental_reviews updated_at timestamp
CREATE OR REPLACE FUNCTION update_rental_reviews_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_rental_reviews_updated_at
  BEFORE UPDATE ON rental_reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_rental_reviews_updated_at();

-- =====================================================
-- FUNCTION TO UPDATE RENTAL RATINGS
-- =====================================================

CREATE OR REPLACE FUNCTION update_rental_rating()
RETURNS TRIGGER AS $$
DECLARE
  avg_rating decimal(3,2);
  review_count integer;
BEGIN
  -- Calculate new average rating and review count
  SELECT
    COALESCE(AVG(rating), 0),
    COUNT(*)
  INTO avg_rating, review_count
  FROM rental_reviews
  WHERE rental_id = NEW.rental_id;

  -- Update the rental record
  UPDATE rentals
  SET
    rating = avg_rating,
    updated_at = NOW()
  WHERE id = NEW.rental_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_rental_rating
  AFTER INSERT OR UPDATE OR DELETE ON rental_reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_rental_rating();

-- =====================================================
-- SAMPLE DATA FOR TESTING
-- =====================================================

-- Insert sample rental availability data
INSERT INTO rental_availability (rental_id, date, available_quantity)
SELECT
  r.id,
  CURRENT_DATE + (n || ' days')::interval,
  CASE
    WHEN r.category = 'Cameras' THEN 3
    WHEN r.category = 'Lenses' THEN 5
    WHEN r.category = 'Lighting' THEN 10
    ELSE 2
  END
FROM rentals r
CROSS JOIN (SELECT generate_series(1, 30) AS n) dates
ON CONFLICT (rental_id, date) DO NOTHING;

-- =====================================================
-- VIEWS FOR CART ANALYTICS
-- =====================================================

-- View for cart analytics
CREATE OR REPLACE VIEW cart_analytics AS
SELECT
  ci.user_id,
  COUNT(*) as total_items,
  SUM(ci.quantity) as total_quantity,
  SUM(ci.total_price) as total_value,
  AVG(ci.total_price) as avg_cart_value,
  COUNT(DISTINCT ci.rental_id) as unique_rentals,
  MAX(ci.created_at) as last_activity
FROM cart_items ci
WHERE ci.status = 'active'
GROUP BY ci.user_id;

-- View for popular rentals
CREATE OR REPLACE VIEW popular_rentals AS
SELECT
  r.*,
  COUNT(ci.id) as times_added_to_cart,
  COUNT(DISTINCT ci.user_id) as unique_users,
  AVG(ci.quantity) as avg_quantity_per_cart
FROM rentals r
LEFT JOIN cart_items ci ON ci.rental_id = r.id AND ci.status = 'active'
GROUP BY r.id
ORDER BY times_added_to_cart DESC;

-- =====================================================
-- RLS HELPER FUNCTIONS
-- =====================================================

-- Function to check if user can access cart item
CREATE OR REPLACE FUNCTION can_access_cart_item(cart_item_id uuid, user_id_param uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM cart_items ci
    WHERE ci.id = cart_item_id
    AND ci.user_id = user_id_param
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user can access booking
CREATE OR REPLACE FUNCTION can_access_booking(booking_id_param uuid, user_id_param uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM bookings b
    WHERE b.id = booking_id_param
    AND (b.customer_id = user_id_param OR b.photographer_id = user_id_param)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;