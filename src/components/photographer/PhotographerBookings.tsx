import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar as CalendarIcon, Clock, MapPin, User, Check, X, MessageSquare, Plus, Edit, Trash2, Settings, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

// Calendar mock data with comprehensive booking statuses and time-based scheduling
const mockCalendarBookings = [
  // Past Events (showing in calendar) - June 2025 and earlier with completed/dropped status only
  {
    id: 1,
    date: '2025-07-10',
    time: '09:00',
    endTime: '11:00',
    client: 'Sarah Johnson',
    type: 'Wedding Photography',
    status: 'completed',
    color: 'bg-green-700',
    email: 'sarah.johnson@email.com',
    phone: '+1 (555) 123-4567',
    package: 'Wedding Package',
    price: '$1,800',
    notes: 'Outdoor wedding ceremony completed successfully',
    createdBy: 'photographer'
  },
  {
    id: 2,
    date: '2025-07-12',
    time: '14:00',
    endTime: '16:00',
    client: 'Mark Thompson',
    type: 'Business Headshots',
    status: 'completed',
    color: 'bg-green-700',
    email: 'mark.thompson@company.com',
    phone: '+1 (555) 987-6543',
    package: 'Professional Headshots',
    price: '$400',
    notes: 'Executive headshots for company website completed',
    createdBy: 'photographer'
  },
  {
    id: 3,
    date: '2025-07-08',
    time: '10:30',
    endTime: '12:30',
    client: 'Lisa Chen',
    type: 'Family Session',
    status: 'completed',
    color: 'bg-green-700',
    email: 'lisa.chen@email.com',
    phone: '+1 (555) 456-7890',
    package: 'Family Package',
    price: '$500',
    notes: 'Family of 4 with newborn baby session completed',
    createdBy: 'photographer'
  },
  {
    id: 17,
    date: '2025-07-15',
    time: '16:00',
    endTime: '18:00',
    client: 'Jennifer Martinez',
    type: 'Engagement Session',
    status: 'dropped',
    color: 'bg-red-600',
    email: 'jennifer.martinez@email.com',
    phone: '+1 (555) 234-5678',
    package: 'Engagement Package',
    price: '$450',
    notes: 'Client cancelled due to personal reasons - rescheduled for next month',
    createdBy: 'photographer'
  },
  {
    id: 18,
    date: '2025-07-18',
    time: '11:00',
    endTime: '13:00',
    client: 'Robert Wilson',
    type: 'Corporate Event',
    status: 'dropped',
    color: 'bg-red-600',
    email: 'robert.wilson@company.com',
    phone: '+1 (555) 345-6789',
    package: 'Corporate Photography',
    price: '$800',
    notes: 'Event postponed indefinitely due to company restructuring',
    createdBy: 'photographer'
  },
  // Additional August 2025 Past Events
  {
    id: 30,
    date: '2025-08-05',
    time: '10:00',
    endTime: '12:00',
    client: 'Victoria Stevens',
    type: 'Professional Headshots',
    status: 'completed',
    color: 'bg-green-700',
    email: 'victoria.stevens@email.com',
    phone: '+1 (555) 222-3333',
    package: 'Professional Headshots',
    price: '$350',
    notes: 'Executive portraits for new company position completed successfully',
    createdBy: 'photographer'
  },
  {
    id: 31,
    date: '2025-08-08',
    time: '15:00',
    endTime: '17:00',
    client: 'Martinez Family',
    type: 'Family Session',
    status: 'completed',
    color: 'bg-green-700',
    email: 'martinez.family@email.com',
    phone: '+1 (555) 333-4444',
    package: 'Family Package',
    price: '$480',
    notes: 'Beach family portraits during golden hour - excellent results',
    createdBy: 'photographer'
  },
  {
    id: 32,
    date: '2025-08-12',
    time: '09:00',
    endTime: '11:00',
    client: 'Creative Agency Ltd',
    type: 'Corporate Event',
    status: 'dropped',
    color: 'bg-red-600',
    email: 'events@creativeagency.com',
    phone: '+1 (555) 444-5555',
    package: 'Corporate Photography',
    price: '$700',
    notes: 'Team building event cancelled due to budget cuts',
    createdBy: 'photographer'
  },
  {
    id: 33,
    date: '2025-08-15',
    time: '13:30',
    endTime: '15:30',
    client: 'Kevin & Amanda Clark',
    type: 'Engagement Session',
    status: 'completed',
    color: 'bg-green-700',
    email: 'kevin.amanda@email.com',
    phone: '+1 (555) 555-6666',
    package: 'Engagement Package',
    price: '$520',
    notes: 'Romantic engagement shoot in Central Park - beautiful lighting',
    createdBy: 'photographer'
  },
  {
    id: 34,
    date: '2025-08-18',
    time: '11:00',
    endTime: '13:00',
    client: 'Sophia Rodriguez',
    type: 'Graduation Photos',
    status: 'dropped',
    color: 'bg-red-600',
    email: 'sophia.rodriguez@email.com',
    phone: '+1 (555) 666-7777',
    package: 'Graduation Package',
    price: '$280',
    notes: 'Session cancelled - client moved graduation ceremony date',
    createdBy: 'photographer'
  },
  {
    id: 35,
    date: '2025-08-22',
    time: '16:00',
    endTime: '18:00',
    client: 'Williams & Associates',
    type: 'Corporate Event',
    status: 'completed',
    color: 'bg-green-700',
    email: 'marketing@williamsassoc.com',
    phone: '+1 (555) 777-8888',
    package: 'Corporate Photography',
    price: '$850',
    notes: 'Annual client appreciation event - networking photos completed',
    createdBy: 'photographer'
  },
  {
    id: 36,
    date: '2025-08-25',
    time: '14:00',
    endTime: '16:00',
    client: 'Rachel & Tom Nelson',
    type: 'Maternity Photos',
    status: 'dropped',
    color: 'bg-red-600',
    email: 'rachel.tom@email.com',
    phone: '+1 (555) 888-9999',
    package: 'Maternity Package',
    price: '$390',
    notes: 'Session postponed indefinitely due to early delivery',
    createdBy: 'photographer'
  },
  // More August 2025 Past Events
  {
    id: 37,
    date: '2025-08-02',
    time: '11:00',
    endTime: '13:00',
    client: 'Harrison & Maria Lopez',
    type: 'Anniversary Photos',
    status: 'completed',
    color: 'bg-green-700',
    email: 'harrison.maria@email.com',
    phone: '+1 (555) 101-1010',
    package: 'Anniversary Package',
    price: '$420',
    notes: '15th wedding anniversary celebration at botanical gardens completed',
    createdBy: 'photographer'
  },
  {
    id: 38,
    date: '2025-08-04',
    time: '09:30',
    endTime: '11:30',
    client: 'Creative Studios LLC',
    type: 'Corporate Event',
    status: 'dropped',
    color: 'bg-red-600',
    email: 'events@creativestudios.com',
    phone: '+1 (555) 202-2020',
    package: 'Corporate Photography',
    price: '$650',
    notes: 'Team building workshop cancelled due to scheduling conflicts',
    createdBy: 'photographer'
  },
  {
    id: 39,
    date: '2025-08-07',
    time: '17:00',
    endTime: '19:00',
    client: 'Angela Thompson',
    type: 'Professional Headshots',
    status: 'completed',
    color: 'bg-green-700',
    email: 'angela.thompson@email.com',
    phone: '+1 (555) 303-3030',
    package: 'Professional Headshots',
    price: '$320',
    notes: 'Corporate executive portraits for board of directors page completed',
    createdBy: 'photographer'
  },
  {
    id: 40,
    date: '2025-08-10',
    time: '14:30',
    endTime: '16:30',
    client: 'Peterson Family',
    type: 'Family Session',
    status: 'completed',
    color: 'bg-green-700',
    email: 'peterson.family@email.com',
    phone: '+1 (555) 404-4040',
    package: 'Family Package',
    price: '$460',
    notes: 'Extended family reunion photos with three generations completed',
    createdBy: 'photographer'
  },
  {
    id: 41,
    date: '2025-08-14',
    time: '12:00',
    endTime: '14:00',
    client: 'Michael & Sandra Chang',
    type: 'Engagement Session',
    status: 'dropped',
    color: 'bg-red-600',
    email: 'michael.sandra@email.com',
    phone: '+1 (555) 505-5050',
    package: 'Engagement Package',
    notes: 'Couple relocated and cancelled all wedding-related services',
    createdBy: 'photographer'
  },
  {
    id: 42,
    date: '2025-08-20',
    time: '08:00',
    endTime: '10:00',
    client: 'Nathan Brooks',
    type: 'Graduation Photos',
    status: 'completed',
    color: 'bg-green-700',
    email: 'nathan.brooks@email.com',
    phone: '+1 (555) 606-6060',
    package: 'Graduation Package',
    price: '$270',
    notes: 'MBA graduation ceremony and individual portraits completed',
    createdBy: 'photographer'
  },
  {
    id: 43,
    date: '2025-08-24',
    time: '15:30',
    endTime: '17:30',
    client: 'Beauty & Wellness Spa',
    type: 'Corporate Event',
    status: 'completed',
    color: 'bg-green-700',
    email: 'marketing@beautyspa.com',
    phone: '+1 (555) 707-7070',
    package: 'Corporate Photography',
    price: '$580',
    notes: 'Grand reopening event with before/after facility shots completed',
    createdBy: 'photographer'
  },
  // Additional Past Events - June 2025
  {
    id: 19,
    date: '2025-06-28',
    time: '15:00',
    endTime: '17:00',
    client: 'Amanda Rodriguez',
    type: 'Graduation Photos',
    status: 'completed',
    color: 'bg-green-700',
    email: 'amanda.rodriguez@email.com',
    phone: '+1 (555) 111-2222',
    package: 'Graduation Package',
    price: '$300',
    notes: 'University graduation ceremony photos completed successfully',
    createdBy: 'photographer'
  },
  {
    id: 20,
    date: '2025-06-25',
    time: '13:00',
    endTime: '15:00',
    client: 'Michael & Jessica Davis',
    type: 'Anniversary Photos',
    status: 'completed',
    color: 'bg-green-700',
    email: 'michael.jessica@email.com',
    phone: '+1 (555) 222-3333',
    package: 'Anniversary Package',
    price: '$420',
    notes: '10th wedding anniversary shoot at Central Park completed',
    createdBy: 'photographer'
  },
  {
    id: 21,
    date: '2025-06-20',
    time: '09:00',
    endTime: '12:00',
    client: 'Tech Solutions Inc.',
    type: 'Corporate Event',
    status: 'dropped',
    color: 'bg-red-600',
    email: 'events@techsolutions.com',
    phone: '+1 (555) 333-4444',
    package: 'Corporate Photography',
    price: '$900',
    notes: 'Annual conference cancelled due to venue issues',
    createdBy: 'photographer'
  },
  {
    id: 22,
    date: '2025-06-15',
    time: '14:30',
    endTime: '16:30',
    client: 'Carlos Mendez',
    type: 'Professional Headshots',
    status: 'completed',
    color: 'bg-green-700',
    email: 'carlos.mendez@email.com',
    phone: '+1 (555) 444-5555',
    package: 'Professional Headshots',
    price: '$350',
    notes: 'Executive portraits for LinkedIn and company website',
    createdBy: 'photographer'
  },
  {
    id: 23,
    date: '2025-06-10',
    time: '11:00',
    endTime: '13:00',
    client: 'Sofia & Alex Turner',
    type: 'Maternity Photos',
    status: 'dropped',
    color: 'bg-red-600',
    email: 'sofia.alex@email.com',
    phone: '+1 (555) 555-6666',
    package: 'Maternity Package',
    price: '$380',
    notes: 'Session cancelled due to medical complications',
    createdBy: 'photographer'
  },
  {
    id: 24,
    date: '2025-06-05',
    time: '16:00',
    endTime: '18:00',
    client: 'Thompson Family',
    type: 'Family Session',
    status: 'completed',
    color: 'bg-green-700',
    email: 'thompson.family@email.com',
    phone: '+1 (555) 666-7777',
    package: 'Family Package',
    price: '$450',
    notes: 'Outdoor family portraits at sunset - beautiful session',
    createdBy: 'photographer'
  },
  // May 2025 Past Events
  {
    id: 25,
    date: '2025-05-30',
    time: '10:00',
    endTime: '12:00',
    client: 'Isabella Garcia',
    type: 'Quinceañera',
    status: 'completed',
    color: 'bg-green-700',
    email: 'isabella.garcia@email.com',
    phone: '+1 (555) 777-8888',
    package: 'Quinceañera Package',
    price: '$650',
    notes: 'Traditional quinceañera celebration - multiple outfit changes completed',
    createdBy: 'photographer'
  },
  {
    id: 26,
    date: '2025-05-25',
    time: '08:00',
    endTime: '11:00',
    client: 'Global Marketing Corp',
    type: 'Corporate Event',
    status: 'dropped',
    color: 'bg-red-600',
    email: 'marketing@globalcorp.com',
    phone: '+1 (555) 888-9999',
    package: 'Corporate Photography',
    price: '$750',
    notes: 'Product launch event cancelled due to supply chain issues',
    createdBy: 'photographer'
  },
  {
    id: 27,
    date: '2025-05-20',
    time: '15:30',
    endTime: '17:30',
    client: 'Ryan & Emma Johnson',
    type: 'Engagement Session',
    status: 'completed',
    color: 'bg-green-700',
    email: 'ryan.emma@email.com',
    phone: '+1 (555) 999-0000',
    package: 'Engagement Package',
    price: '$480',
    notes: 'Beautiful sunset engagement shoot at Brooklyn Bridge',
    createdBy: 'photographer'
  },
  {
    id: 28,
    date: '2025-05-15',
    time: '12:00',
    endTime: '14:00',
    client: 'Dr. Patricia Williams',
    type: 'Professional Headshots',
    status: 'completed',
    color: 'bg-green-700',
    email: 'dr.williams@medical.com',
    phone: '+1 (555) 000-1111',
    package: 'Professional Headshots',
    price: '$320',
    notes: 'Medical professional headshots for clinic website',
    createdBy: 'photographer'
  },
  {
    id: 29,
    date: '2025-05-10',
    time: '09:30',
    endTime: '11:30',
    client: 'James & Lisa Park',
    type: 'Family Session',
    status: 'dropped',
    color: 'bg-red-600',
    email: 'james.lisa@email.com',
    phone: '+1 (555) 111-2222',
    package: 'Family Package',
    price: '$400',
    notes: 'Session cancelled due to weather and rescheduling conflicts',
    createdBy: 'photographer'
  },
  {
    id: 4,
    date: '2025-07-14',
    time: 'all-day',
    endTime: 'all-day',
    client: 'Summer Break',
    type: 'blocked',
    status: 'blocked',
    color: 'bg-violet-600',
    price: '$0',
    notes: 'Personal day off for summer vacation',
    createdBy: 'photographer'
  },
  
  // Current/Future confirmed bookings - August, September, October 2025
  {
    id: 5,
    date: '2025-08-28',
    time: '13:00',
    endTime: '17:00',
    client: 'John & Sarah Williams',
    type: 'Wedding Photography',
    status: 'confirmed',
    color: 'bg-blue-500',
    email: 'john.sarah@email.com',
    phone: '+1 (555) 123-4567',
    package: 'Premium Wedding Package',
    price: '$2,500',
    notes: 'Outdoor ceremony, backup plan needed for rain',
    createdBy: 'user'
  },
  {
    id: 6,
    date: '2025-09-05',
    time: '09:00',
    endTime: '12:00',
    client: 'Tech Innovators Inc.',
    type: 'Event Photography',
    status: 'confirmed',
    color: 'bg-blue-500',
    email: 'events@techinnovators.com',
    phone: '+1 (555) 987-6543',
    package: 'Event Coverage',
    price: '$800',
    notes: 'Annual company conference and team building',
    createdBy: 'photographer'
  },
  
  // User-created pending requests (need photographer approval) - August, September, October 2025
  {
    id: 7,
    date: '2025-09-08',
    time: '15:00',
    endTime: '16:30',
    client: 'Emma Thompson',
    type: 'Professional Headshots',
    status: 'pending',
    color: 'bg-yellow-500',
    email: 'emma.thompson@email.com',
    phone: '+1 (555) 456-7890',
    package: 'Professional Headshots',
    price: '$300',
    notes: 'LinkedIn profile and business card photos',
    createdBy: 'user'
  },
  {
    id: 8,
    date: '2025-09-12',
    time: '16:00',
    endTime: '18:00',
    client: 'Mike & Lisa Johnson',
    type: 'Engagement Session',
    status: 'pending',
    color: 'bg-yellow-500',
    email: 'mike.lisa.j@email.com',
    phone: '+1 (555) 321-0987',
    package: 'Engagement Package',
    price: '$450',
    notes: 'Sunset photos at Brooklyn Bridge, getting married in June',
    createdBy: 'user'
  },
  {
    id: 9,
    date: '2025-09-15',
    time: '10:00',
    endTime: '11:30',
    client: 'Jennifer White',
    type: 'Graduation Photos',
    status: 'pending',
    color: 'bg-yellow-500',
    email: 'jennifer.white@email.com',
    phone: '+1 (555) 333-4444',
    package: 'Graduation Package',
    price: '$250',
    notes: 'University graduation ceremony and individual shots',
    createdBy: 'user'
  },
  {
    id: 10,
    date: '2025-10-05',
    time: '14:00',
    endTime: '16:00',
    client: 'David & Rachel Kim',
    type: 'Anniversary Photos',
    status: 'pending',
    color: 'bg-yellow-500',
    email: 'david.rachel@email.com',
    phone: '+1 (555) 888-9999',
    package: 'Anniversary Package',
    price: '$420',
    notes: '25th wedding anniversary celebration at the park',
    createdBy: 'user'
  },
  
  // Rejected bookings - September, October 2025
  {
    id: 11,
    date: '2025-09-18',
    time: '14:00',
    endTime: '16:00',
    client: 'Maria Rodriguez',
    type: 'Maternity Photos',
    status: 'rejected',
    color: 'bg-gray-500',
    email: 'maria.rodriguez@email.com',
    phone: '+1 (555) 654-3210',
    package: 'Maternity Package',
    price: '$350',
    notes: 'Schedule conflict - client requested different date',
    createdBy: 'user'
  },
  {
    id: 12,
    date: '2025-09-22',
    time: '11:00',
    endTime: '13:00',
    client: 'Robert & Amy Taylor',
    type: 'Anniversary Photos',
    status: 'rejected',
    color: 'bg-gray-500',
    email: 'robert.amy@email.com',
    phone: '+1 (555) 555-6666',
    package: 'Anniversary Package',
    price: '$380',
    notes: 'Budget constraints - looking for more affordable option',
    createdBy: 'user'
  },
  
  // Blocked dates - September, October 2025
  {
    id: 13,
    date: '2025-09-25',
    time: 'all-day',
    endTime: 'all-day',
    client: 'Personal Vacation',
    type: 'blocked',
    status: 'blocked',
    color: 'bg-violet-600',
    price: '$0',
    notes: 'Family vacation - unavailable for bookings',
    createdBy: 'photographer'
  },
  {
    id: 14,
    date: '2025-10-01',
    time: 'all-day',
    endTime: 'all-day',
    client: 'Equipment Maintenance',
    type: 'blocked',
    status: 'blocked',
    color: 'bg-violet-600',
    price: '$0',
    notes: 'Annual equipment service and lens calibration',
    createdBy: 'photographer'
  },
  
  // More future bookings - September, October 2025
  {
    id: 15,
    date: '2025-09-05',
    time: '08:00',
    endTime: '10:00',
    client: 'David Chen Family',
    type: 'Family Session',
    status: 'confirmed',
    color: 'bg-blue-500',
    email: 'david.chen@email.com',
    phone: '+1 (555) 789-0123',
    package: 'Family Portrait Package',
    price: '$400',
    notes: 'Family of 5, including newborn baby - early morning session',
    createdBy: 'photographer'
  },
  {
    id: 16,
    date: '2025-10-10',
    time: '12:00',
    endTime: '15:00',
    client: 'Sophie Martinez',
    type: 'Quinceañera',
    status: 'pending',
    color: 'bg-yellow-500',
    email: 'sophie.martinez@email.com',
    phone: '+1 (555) 999-0000',
    package: 'Quinceañera Package',
    price: '$650',
    notes: 'Traditional celebration, multiple outfit changes',
    createdBy: 'user'
  }
];

// Mock data for upcoming bookings tab
const upcomingBookings = [
  {
    id: 1,
    client: "John & Sarah Williams",
    type: "Wedding Photography",
    date: "2025-09-15",
    time: "2:00 PM",
    location: "Central Park, NYC",
    status: "confirmed",
    clientEmail: "john.sarah@email.com",
    phone: "+1 (555) 123-4567",
    package: "Premium Wedding Package",
    price: "$2,500"
  },
  {
    id: 2,
    client: "Tech Corp Inc.",
    type: "Corporate Event",
    date: "2025-10-18",
    time: "10:00 AM",
    location: "Manhattan Office Building",
    status: "confirmed",
    clientEmail: "events@techcorp.com",
    phone: "+1 (555) 987-6543",
    package: "Corporate Photography",
    price: "$800"
  }
];

const bookingRequests = [
  {
    id: 3,
    client: "Emma Thompson",
    type: "Portrait Session",
    requestedDate: "2025-09-20",
    requestedTime: "3:00 PM",
    location: "Studio Downtown",
    status: "pending",
    clientEmail: "emma.thompson@email.com",
    phone: "+1 (555) 456-7890",
    package: "Portrait Package",
    price: "$300",
    message: "Hi! I'd love to book a portrait session for my professional headshots. I'm flexible with timing."
  },
  {
    id: 4,
    client: "Mike & Lisa Johnson",
    type: "Engagement Photos",
    requestedDate: "2025-10-22",
    requestedTime: "5:00 PM",
    location: "Brooklyn Bridge",
    status: "pending",
    clientEmail: "mike.lisa.j@email.com",
    phone: "+1 (555) 321-0987",
    package: "Engagement Package",
    price: "$450",
    message: "We're getting married in June and would love engagement photos at sunset!"
  }
];

// Mock availability data
const mockAvailabilitySlots = [
  {
    id: 1,
    dayOfWeek: 'monday',
    timeSlots: [
      { startTime: '09:00', endTime: '12:00', type: 'Portrait Sessions' },
      { startTime: '14:00', endTime: '17:00', type: 'Event Photography' }
    ],
    isActive: true
  },
  {
    id: 2,
    dayOfWeek: 'tuesday',
    timeSlots: [
      { startTime: '10:00', endTime: '16:00', type: 'Wedding Photography' }
    ],
    isActive: true
  },
  {
    id: 3,
    dayOfWeek: 'friday',
    timeSlots: [
      { startTime: '09:00', endTime: '18:00', type: 'All Types' }
    ],
    isActive: true
  },
  {
    id: 4,
    dayOfWeek: 'saturday',
    timeSlots: [
      { startTime: '08:00', endTime: '20:00', type: 'Weddings & Events' }
    ],
    isActive: true
  }
];

const mockBlockedDates = [
  {
    id: 1,
    date: '2024-02-25',
    reason: 'Personal vacation',
    type: 'blocked'
  },
  {
    id: 2,
    date: '2024-03-01',
    reason: 'Equipment maintenance',
    type: 'blocked'
  }
];

export function PhotographerBookings() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [showCalendar, setShowCalendar] = useState(false);
  
  // Calendar states
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<Date | null>(null);
  const [calendarBookings, setCalendarBookings] = useState(mockCalendarBookings);
  const [showAddBooking, setShowAddBooking] = useState(false);
  const [showBookingDetails, setShowBookingDetails] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [calendarView, setCalendarView] = useState<'month' | 'week' | 'day'>('month');
  const [showPastEvents, setShowPastEvents] = useState(false);
  
  // Availability management states
  const [availabilitySlots, setAvailabilitySlots] = useState(mockAvailabilitySlots);
  const [blockedDates, setBlockedDates] = useState(mockBlockedDates);
  const [showAddAvailability, setShowAddAvailability] = useState(false);
  const [showBlockDate, setShowBlockDate] = useState(false);
  const [editingSlot, setEditingSlot] = useState<any>(null);
  
  // Form states for availability
  const [availabilityForm, setAvailabilityForm] = useState({
    dayOfWeek: '',
    startTime: '',
    endTime: '',
    type: '',
    isActive: true
  });
  
  // Form states for blocking dates
  const [blockDateForm, setBlockDateForm] = useState({
    date: '',
    reason: '',
    type: 'blocked' as const
  });
  
  // Form states for adding manual bookings
  const [newBookingForm, setNewBookingForm] = useState({
    date: '',
    time: '',
    endTime: '',
    client: '',
    type: '',
    customType: '',
    status: 'confirmed' as 'confirmed' | 'pending' | 'completed' | 'dropped',
    notes: ''
  });

  const handleApproveRequest = (requestId: number) => {
    // Logic to approve booking request
    console.log('Approved request:', requestId);
    toast({
      title: "Booking Approved",
      description: "The booking request has been approved and client will be notified."
    });
    // This would typically update the backend and move the request to confirmed bookings
  };

  const handleRejectRequest = (requestId: number) => {
    // Logic to reject booking request
    console.log('Rejected request:', requestId);
    toast({
      title: "Booking Rejected",
      description: "The booking request has been rejected and client will be notified."
    });
    // This would typically update the backend
  };

  // Availability management functions
  const handleAddAvailability = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newSlot = {
      id: Date.now(),
      dayOfWeek: availabilityForm.dayOfWeek,
      timeSlots: [{
        startTime: availabilityForm.startTime,
        endTime: availabilityForm.endTime,
        type: availabilityForm.type
      }],
      isActive: availabilityForm.isActive
    };
    
    if (editingSlot) {
      setAvailabilitySlots(prev => prev.map(slot => 
        slot.id === editingSlot.id ? { ...newSlot, id: editingSlot.id } : slot
      ));
      toast({
        title: "Availability Updated",
        description: "Your availability has been updated successfully."
      });
    } else {
      setAvailabilitySlots(prev => [...prev, newSlot]);
      toast({
        title: "Availability Added",
        description: "New availability slot has been added to your schedule."
      });
    }
    
    setShowAddAvailability(false);
    resetAvailabilityForm();
  };
  
  const handleBlockDate = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newBlockedDate = {
      id: Date.now(),
      date: blockDateForm.date,
      reason: blockDateForm.reason,
      type: blockDateForm.type
    };
    
    // Add to blocked dates state
    setBlockedDates(prev => [...prev, newBlockedDate]);
    
    // Also add to calendar bookings so it appears in the calendar
    const blockedBooking = {
      id: Date.now() + 1, // Ensure unique ID
      date: blockDateForm.date,
      time: 'all-day',
      endTime: 'all-day',
      client: blockDateForm.reason || 'Blocked Date',
      type: 'blocked',
      status: 'blocked' as const,
      color: 'bg-violet-600',
      notes: blockDateForm.reason,
      email: '',
      phone: '',
      package: '',
      price: '',
      createdBy: 'photographer' as const
    };
    
    setCalendarBookings(prev => [...prev, blockedBooking]);
    
    toast({
      title: "Date Blocked",
      description: "The selected date has been blocked from bookings."
    });
    
    setShowBlockDate(false);
    resetBlockDateForm();
  };
  
  const resetAvailabilityForm = () => {
    setAvailabilityForm({
      dayOfWeek: '',
      startTime: '',
      endTime: '',
      type: '',
      isActive: true
    });
    setEditingSlot(null);
  };
  
  const resetBlockDateForm = () => {
    setBlockDateForm({
      date: '',
      reason: '',
      type: 'blocked'
    });
  };
  
  const handleEditAvailability = (slot: any) => {
    setEditingSlot(slot);
    setAvailabilityForm({
      dayOfWeek: slot.dayOfWeek,
      startTime: slot.timeSlots[0]?.startTime || '',
      endTime: slot.timeSlots[0]?.endTime || '',
      type: slot.timeSlots[0]?.type || '',
      isActive: slot.isActive
    });
    setShowAddAvailability(true);
  };
  
  const handleDeleteAvailability = (slotId: number) => {
    setAvailabilitySlots(prev => prev.filter(slot => slot.id !== slotId));
    toast({
      title: "Availability Removed",
      description: "The availability slot has been removed from your schedule."
    });
  };
  
  const handleDeleteBlockedDate = (dateId: number) => {
    // Find the blocked date to get its date value
    const blockedDate = blockedDates.find(date => date.id === dateId);
    
    // Remove from blocked dates state
    setBlockedDates(prev => prev.filter(date => date.id !== dateId));
    
    // Also remove from calendar bookings if it exists
    if (blockedDate) {
      setCalendarBookings(prev => prev.filter(booking => 
        !(booking.date === blockedDate.date && booking.status === 'blocked')
      ));
    }
    
    toast({
      title: "Date Unblocked",
      description: "The date has been unblocked and is now available for bookings."
    });
  };
  
  const toggleAvailability = (slotId: number) => {
    setAvailabilitySlots(prev => prev.map(slot => 
      slot.id === slotId ? { ...slot, isActive: !slot.isActive } : slot
    ));
  };
  
  const getDayName = (dayOfWeek: string) => {
    const days = {
      monday: 'Monday',
      tuesday: 'Tuesday', 
      wednesday: 'Wednesday',
      thursday: 'Thursday',
      friday: 'Friday',
      saturday: 'Saturday',
      sunday: 'Sunday'
    };
    return days[dayOfWeek as keyof typeof days] || dayOfWeek;
  };
  
  // Calendar helper functions
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDate = firstDay.getDay();
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startDate; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };
  
  const getWeekDays = (date: Date) => {
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    startOfWeek.setDate(startOfWeek.getDate() - day);
    
    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const currentDay = new Date(startOfWeek);
      currentDay.setDate(startOfWeek.getDate() + i);
      weekDays.push(currentDay);
    }
    return weekDays;
  };
  
  const getHourlySlots = () => {
    const slots = [];
    for (let hour = 6; hour <= 23; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
      slots.push(`${hour.toString().padStart(2, '0')}:30`);
    }
    return slots;
  };
  
  const isPastTime = (date: Date, timeSlot: string) => {
    const now = new Date();
    const [hours, minutes] = timeSlot.split(':').map(Number);
    const slotTime = new Date(date);
    slotTime.setHours(hours, minutes, 0, 0);
    return slotTime < now;
  };
  
  const isCurrentTimeSlot = (date: Date, timeSlot: string) => {
    const now = new Date();
    const [hours, minutes] = timeSlot.split(':').map(Number);
    const slotTime = new Date(date);
    slotTime.setHours(hours, minutes, 0, 0);
    const nextSlotTime = new Date(slotTime);
    nextSlotTime.setMinutes(nextSlotTime.getMinutes() + 30);
    return now >= slotTime && now < nextSlotTime;
  };
  
  const isPastDate = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const compareDate = new Date(date);
    compareDate.setHours(0, 0, 0, 0);
    return compareDate < today;
  };
  
  const getPastBookings = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return calendarBookings.filter(booking => {
      const bookingDate = new Date(booking.date);
      bookingDate.setHours(0, 0, 0, 0);
      return bookingDate < today;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };
  
  const getUserCreatedBookings = () => {
    return calendarBookings.filter(booking => 
      booking.createdBy === 'user' && booking.status === 'pending'
    );
  };
  
  const formatDateForCalendar = (date: Date) => {
    return date.toISOString().split('T')[0];
  };
  
  const getBookingsForDate = (date: Date) => {
    const dateStr = formatDateForCalendar(date);
    return calendarBookings.filter(booking => booking.date === dateStr);
  };
  
  const handleDateClick = (date: Date) => {
    setSelectedCalendarDate(date);
    const bookingsForDate = getBookingsForDate(date);
    if (bookingsForDate.length > 0) {
      setSelectedBooking(bookingsForDate[0]);
      setShowBookingDetails(true);
    }
  };
  
  const handleAddManualBooking = (e: React.FormEvent) => {
    e.preventDefault();
    
    const finalType = newBookingForm.type === 'Other' ? newBookingForm.customType : newBookingForm.type;
    
    const newBooking = {
      id: Date.now(),
      date: newBookingForm.date,
      time: newBookingForm.time,
      endTime: newBookingForm.endTime,
      client: newBookingForm.client,
      type: finalType,
      status: newBookingForm.status,
      color: newBookingForm.status === 'confirmed' ? 'bg-blue-500' : 
             newBookingForm.status === 'pending' ? 'bg-yellow-500' : 
             newBookingForm.status === 'completed' ? 'bg-green-700' :
             newBookingForm.status === 'dropped' ? 'bg-red-600' :
             'bg-violet-600',
      notes: newBookingForm.notes,
      email: '',
      phone: '',
      package: 'Custom Package',
      price: '',
      createdBy: 'photographer'
    };
    
    setCalendarBookings(prev => [...prev, newBooking]);
    toast({
      title: "Booking Added",
      description: "New booking has been added to your calendar."
    });
    
    setShowAddBooking(false);
    resetBookingForm();
  };
  
  const resetBookingForm = () => {
    setNewBookingForm({
      date: '',
      time: '',
      endTime: '',
      client: '',
      type: '',
      customType: '',
      status: 'confirmed' as 'confirmed' | 'pending' | 'completed' | 'dropped',
      notes: ''
    });
  };
  
  const handleCalendarApprove = (bookingId: number) => {
    setCalendarBookings(prev => prev.map(booking => 
      booking.id === bookingId 
        ? { ...booking, status: 'confirmed', color: 'bg-blue-500' }
        : booking
    ));
    toast({
      title: "Booking Approved",
      description: "The booking has been approved and updated in your calendar."
    });
    setShowBookingDetails(false);
  };
  
  const handleCalendarReject = (bookingId: number) => {
    setCalendarBookings(prev => prev.filter(booking => booking.id !== bookingId));
    toast({
      title: "Booking Rejected",
      description: "The booking has been rejected and removed from your calendar."
    });
    setShowBookingDetails(false);
  };
  
  const handleDropBooking = (bookingId: number) => {
    setCalendarBookings(prev => prev.map(booking => 
      booking.id === bookingId 
        ? { ...booking, status: 'dropped', color: 'bg-red-600' }
        : booking
    ));
    toast({
      title: "Booking Dropped",
      description: "The booking has been marked as dropped."
    });
    setShowBookingDetails(false);
  };
  
  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };
  
  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setDate(newDate.getDate() - 7);
    } else {
      newDate.setDate(newDate.getDate() + 7);
    }
    setCurrentDate(newDate);
  };
  
  const navigateDay = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setDate(newDate.getDate() - 1);
    } else {
      newDate.setDate(newDate.getDate() + 1);
    }
    setCurrentDate(newDate);
  };
  
  const handleYearChange = (year: string) => {
    const newDate = new Date(currentDate);
    newDate.setFullYear(parseInt(year));
    setCurrentDate(newDate);
  };
  
  const handleMonthChange = (month: string) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(parseInt(month));
    setCurrentDate(newDate);
  };
  
  const getYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear - 2; i <= currentYear + 5; i++) {
      years.push(i.toString());
    }
    return years;
  };
  
  const getMonthOptions = () => {
    return [
      { value: '0', label: 'January' },
      { value: '1', label: 'February' },
      { value: '2', label: 'March' },
      { value: '3', label: 'April' },
      { value: '4', label: 'May' },
      { value: '5', label: 'June' },
      { value: '6', label: 'July' },
      { value: '7', label: 'August' },
      { value: '8', label: 'September' },
      { value: '9', label: 'October' },
      { value: '10', label: 'November' },
      { value: '11', label: 'December' }
    ];
  };

  const handleChatRedirect = (booking: any) => {
    // Redirect to chat with the client
    navigate(`/photographer-dashboard`, { state: { activeSection: 'chat', conversationId: `conv-${booking.id}` } });
  };

  const renderBookingCard = (booking: any, isRequest = false) => (
    <Card key={booking.id} className="mb-4">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-lg">{booking.client}</h3>
              <Badge variant={booking.status === "confirmed" ? "default" : "secondary"}>
                {booking.status}
              </Badge>
            </div>
            <p className="text-muted-foreground mb-2">{booking.type}</p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center text-muted-foreground">
                <CalendarIcon className="h-4 w-4 mr-2" />
                {isRequest ? booking.requestedDate : booking.date}
              </div>
              <div className="flex items-center text-muted-foreground">
                <Clock className="h-4 w-4 mr-2" />
                {isRequest ? booking.requestedTime : booking.time}
              </div>
              <div className="flex items-center text-muted-foreground">
                <MapPin className="h-4 w-4 mr-2" />
                {booking.location}
              </div>
              <div className="flex items-center text-muted-foreground">
                <User className="h-4 w-4 mr-2" />
                {booking.clientEmail}
              </div>
            </div>
            {booking.message && isRequest && (
              <div className="mt-3 p-3 bg-muted rounded-lg">
                <p className="text-sm">{booking.message}</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          {booking.package && (
            <div className="text-right">
              <p className="text-sm text-muted-foreground">{booking.package}</p>
            </div>
          )}
          
          <div className="flex items-center space-x-2">
            {isRequest ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedRequest(booking);
                    setShowCalendar(true);
                  }}
                  className="text-green-600 border-green-600 hover:bg-green-50"
                >
                  <CalendarIcon className="h-4 w-4 mr-1" />
                  Check Calendar
                </Button>
                <Button
                  variant="outline" 
                  size="sm"
                  onClick={() => handleApproveRequest(booking.id)}
                  className="text-green-600 border-green-600 hover:bg-green-50"
                >
                  <Check className="h-4 w-4 mr-1" />
                  Approve
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRejectRequest(booking.id)}
                  className="text-red-600 border-red-600 hover:bg-red-50"
                >
                  <X className="h-4 w-4 mr-1" />
                  Reject
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleChatRedirect(booking)}
                >
                  <MessageSquare className="h-4 w-4 mr-1" />
                  Chat
                </Button>
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Bookings Management</h1>
        <div className="flex gap-2">
          {/* <Button onClick={() => {
            // Navigate to chat with option to start new conversation
            navigate('/photographer-dashboard', { 
              state: { 
                activeSection: 'chat', 
                showNewChatDialog: true 
              } 
            });
          }}>
            <MessageSquare className="h-4 w-4 mr-2" />
            New Chat
          </Button>
          <Dialog open={showAddAvailability} onOpenChange={setShowAddAvailability}>
            <DialogTrigger asChild>
              <Button onClick={() => { resetAvailabilityForm(); setShowAddAvailability(true); }}>
                <Plus className="h-4 w-4 mr-2" />
                Add Availability
              </Button>
            </DialogTrigger>
          </Dialog>
          <Dialog open={showBlockDate} onOpenChange={setShowBlockDate}>
            <DialogTrigger asChild>
              <Button variant="outline" onClick={() => { resetBlockDateForm(); setShowBlockDate(true); }}>
                <X className="h-4 w-4 mr-2" />
                Block Date
              </Button>
            </DialogTrigger>
          </Dialog> */}
        </div>
      </div>

      <Tabs defaultValue="calendar" className="space-y-6">
        <TabsList>
          <TabsTrigger value="calendar">
            Calendar View
          </TabsTrigger>
          <TabsTrigger value="upcoming">
            Upcoming Bookings ({upcomingBookings.length})
          </TabsTrigger>
          <TabsTrigger value="requests">
            Booking Requests ({bookingRequests.length})
          </TabsTrigger>
          <TabsTrigger value="availability">
            Availability Management
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4">
          {upcomingBookings.length > 0 ? (
            upcomingBookings.map(booking => renderBookingCard(booking))
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <CalendarIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No Upcoming Bookings</h3>
                <p className="text-muted-foreground">New bookings will appear here once confirmed</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="requests" className="space-y-4">
          {bookingRequests.length > 0 ? (
            bookingRequests.map(request => renderBookingCard(request, true))
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No Booking Requests</h3>
                <p className="text-muted-foreground">New requests will appear here for your approval</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="calendar" className="space-y-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-4">
              {/* Month View Navigation */}
              {calendarView === 'month' && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigateMonth('prev')}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <div className="flex items-center space-x-2">
                    <Select 
                      value={currentDate.getMonth().toString()} 
                      onValueChange={handleMonthChange}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {getMonthOptions().map(month => (
                          <SelectItem key={month.value} value={month.value}>
                            {month.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select 
                      value={currentDate.getFullYear().toString()} 
                      onValueChange={handleYearChange}
                    >
                      <SelectTrigger className="w-20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {getYearOptions().map(year => (
                          <SelectItem key={year} value={year}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigateMonth('next')}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </>
              )}
              
              {/* Week View Navigation */}
              {calendarView === 'week' && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigateWeek('prev')}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <div className="flex items-center space-x-2">
                    <Select 
                      value={currentDate.getMonth().toString()} 
                      onValueChange={handleMonthChange}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {getMonthOptions().map(month => (
                          <SelectItem key={month.value} value={month.value}>
                            {month.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select 
                      value={currentDate.getFullYear().toString()} 
                      onValueChange={handleYearChange}
                    >
                      <SelectTrigger className="w-20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {getYearOptions().map(year => (
                          <SelectItem key={year} value={year}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigateWeek('next')}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    {/* Week of {getWeekDays(currentDate)[0].toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric' 
                    })} - {getWeekDays(currentDate)[6].toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric' 
                    })} */}
                  </span>
                </>
              )}
              
              {/* Day View Navigation */}
              {calendarView === 'day' && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigateDay('prev')}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <div className="flex items-center space-x-2">
                    <Select 
                      value={currentDate.getMonth().toString()} 
                      onValueChange={handleMonthChange}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {getMonthOptions().map(month => (
                          <SelectItem key={month.value} value={month.value}>
                            {month.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select 
                      value={currentDate.getFullYear().toString()} 
                      onValueChange={handleYearChange}
                    >
                      <SelectTrigger className="w-20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {getYearOptions().map(year => (
                          <SelectItem key={year} value={year}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigateDay('next')}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              {/* Calendar View Toggle */}
              <div className="flex items-center border rounded-lg p-1">
                <Button
                  variant={calendarView === 'month' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setCalendarView('month')}
                  className="px-3 py-1 text-xs"
                >
                  Month
                </Button>
                <Button
                  variant={calendarView === 'week' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setCalendarView('week')}
                  className="px-3 py-1 text-xs"
                >
                  Week
                </Button>
                <Button
                  variant={calendarView === 'day' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setCalendarView('day')}
                  className="px-3 py-1 text-xs"
                >
                  Day
                </Button>
              </div>
              
              {/* <Button
                variant="outline"
                onClick={() => setShowPastEvents(true)}
              >
                <CalendarIcon className="h-4 w-4 mr-2" />
                Past Events
              </Button> */}
              
              <Button
                onClick={() => {
                  setNewBookingForm(prev => ({
                    ...prev,
                    date: selectedCalendarDate ? formatDateForCalendar(selectedCalendarDate) : ''
                  }));
                  setShowAddBooking(true);
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Booking
              </Button>
              
              <Button
                variant="outline"
                onClick={() => {
                  setBlockDateForm(prev => ({
                    ...prev,
                    date: selectedCalendarDate ? formatDateForCalendar(selectedCalendarDate) : ''
                  }));
                  setShowBlockDate(true);
                }}
              >
                <X className="h-4 w-4 mr-2" />
                Block Date
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Calendar Grid */}
            <div className="lg:col-span-3">
              <Card>
                <CardContent className="p-6">
                  {calendarView === 'month' && (
                    <>
                      <div className="grid grid-cols-7 gap-1 mb-4">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                          <div key={day} className="p-2 text-center font-medium text-muted-foreground">
                            {day}
                          </div>
                        ))}
                      </div>
                      <div className="grid grid-cols-7 gap-1">
                        {getDaysInMonth(currentDate).map((date, index) => {
                          if (!date) {
                            return <div key={index} className="p-2 h-20"></div>;
                          }
                          
                          const bookingsForDate = getBookingsForDate(date);
                          const isSelected = selectedCalendarDate && 
                            formatDateForCalendar(date) === formatDateForCalendar(selectedCalendarDate);
                          const isToday = formatDateForCalendar(date) === formatDateForCalendar(new Date());
                          const isPast = isPastDate(date);
                          
                          return (
                            <div
                              key={index}
                              className={`p-2 h-20 border rounded cursor-pointer transition-colors hover:bg-muted/50 ${
                                isSelected ? 'ring-2 ring-primary' : ''
                              } ${
                                isToday ? 'bg-primary/5' : ''
                              } ${
                                isPast ? 'bg-gray-50/50' : ''
                              }`}
                              onClick={() => handleDateClick(date)}
                            >
                              <div className={`font-medium text-sm mb-1 ${
                                isPast ? 'text-gray-600' : ''
                              }`}>
                                {date.getDate()}
                              </div>
                              <div className="space-y-1">
                                {bookingsForDate.slice(0, 2).map(booking => (
                                  <div
                                    key={booking.id}
                                    className={`text-xs px-1 py-0.5 rounded text-white truncate ${
                                      booking.color
                                    } ${
                                      isPast ? 'opacity-80' : ''
                                    }`}
                                    title={`${booking.time} - ${booking.endTime} | ${booking.client} | ${booking.status.toUpperCase()}`}
                                  >
                                    {booking.time === 'all-day' ? booking.client : `${booking.time} ${booking.client.split(' ')[0]}`}
                                  </div>
                                ))}
                                {bookingsForDate.length > 2 && (
                                  <div className="text-xs text-muted-foreground">
                                    +{bookingsForDate.length - 2} more
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  )}
                  
                  {calendarView === 'week' && (
                    <>
                      <div className="grid grid-cols-8 gap-1 mb-4 sticky top-0 bg-white z-10 border-b pb-2">
                        <div className="p-2"></div>
                        {getWeekDays(currentDate).map((date, index) => {
                          const isToday = formatDateForCalendar(date) === formatDateForCalendar(new Date());
                          return (
                            <div key={index} className="p-2 text-center">
                              <div className="font-medium text-sm">
                                {date.toLocaleDateString('en-US', { weekday: 'short' })}
                              </div>
                              <div className={`text-lg ${
                                isToday ? 'bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center mx-auto' : ''
                              } ${
                                isPastDate(date) ? 'text-gray-400' : ''
                              }`}>
                                {date.getDate()}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        <div className="grid grid-cols-8 gap-1">
                          <div className="space-y-1">
                            {getHourlySlots().map(time => (
                              <div key={time} className="text-xs text-muted-foreground text-right pr-2 h-12 flex items-center">
                                {time}
                              </div>
                            ))}
                          </div>
                          {getWeekDays(currentDate).map((date, dayIndex) => {
                            const dayBookings = getBookingsForDate(date);
                            const isPast = isPastDate(date);
                            return (
                              <div key={dayIndex} className="space-y-1">
                                {getHourlySlots().map((time, timeIndex) => {
                                  const booking = dayBookings.find(b => {
                                    if (b.time === 'all-day') return timeIndex === 0;
                                    return b.time === time || (b.time <= time && b.endTime > time);
                                  });
                                  const isPastSlot = isPastTime(date, time);
                                  const isCurrentSlot = isCurrentTimeSlot(date, time);
                                  return (
                                    <div
                                      key={timeIndex}
                                      className={`h-12 border rounded cursor-pointer transition-colors ${
                                        isPastSlot ? 'bg-gray-100 opacity-50 cursor-not-allowed' : 'hover:bg-muted/50'
                                      } ${
                                        isCurrentSlot ? 'ring-2 ring-primary/50' : ''
                                      }`}
                                      onClick={() => !isPastSlot && handleDateClick(date)}
                                    >
                                      {booking && (
                                        <div
                                          className={`h-full p-1 rounded text-white text-xs ${
                                            booking.color
                                          } ${
                                            isPastSlot ? 'opacity-60' : ''
                                          }`}
                                          title={`${booking.time} - ${booking.endTime} | ${booking.client} | ${booking.status.toUpperCase()}`}
                                        >
                                          <div className="font-medium truncate">{booking.client}</div>
                                          <div className="truncate">{booking.type}</div>
                                        </div>
                                      )}
                                      {!booking && isPastSlot && (
                                        <div className="h-full flex items-center justify-center text-xs text-gray-400">
                                          Past
                                        </div>
                                      )}
                                      {!booking && !isPastSlot && (
                                        <div className="h-full flex items-center justify-center text-xs text-muted-foreground hover:text-primary">
                                          Available
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </>
                  )}
                  
                  {calendarView === 'day' && (
                    <>
                      <div className="mb-4 sticky top-0 bg-white z-10 border-b pb-2">
                        <h3 className="text-lg font-semibold text-center">
                          {currentDate.toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </h3>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        <div className="grid grid-cols-1 gap-1">
                          {getHourlySlots().map((time, timeIndex) => {
                            const booking = getBookingsForDate(currentDate).find(b => {
                              if (b.time === 'all-day') return timeIndex === 0;
                              return b.time === time || (b.time <= time && b.endTime > time);
                            });
                            const isPastSlot = isPastTime(currentDate, time);
                            const isCurrentSlot = isCurrentTimeSlot(currentDate, time);
                            return (
                              <div
                                key={timeIndex}
                                className={`flex items-center h-16 border rounded cursor-pointer transition-colors ${
                                  isPastSlot ? 'bg-gray-100 opacity-50 cursor-not-allowed' : 'hover:bg-muted/50'
                                } ${
                                  isCurrentSlot ? 'ring-2 ring-primary/50' : ''
                                }`}
                                onClick={() => !isPastSlot && handleDateClick(currentDate)}
                              >
                                <div className="w-20 text-sm text-muted-foreground text-right pr-4">
                                  {time}
                                </div>
                                <div className="flex-1">
                                  {booking ? (
                                    <div
                                      className={`p-3 rounded text-white ${
                                        booking.color
                                      } ${
                                        isPastSlot ? 'opacity-60' : ''
                                      }`}
                                      title={`${booking.time} - ${booking.endTime} | ${booking.client} | ${booking.status.toUpperCase()}`}
                                    >
                                      <div className="font-medium">{booking.client}</div>
                                      <div className="text-sm opacity-90">{booking.type}</div>
                                      <div className="text-xs opacity-75">
                                        {booking.time === 'all-day' ? 'All Day' : `${booking.time} - ${booking.endTime}`}
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="p-3 text-muted-foreground text-sm">
                                      {isPastSlot ? (
                                        <span className="text-gray-400">Past</span>
                                      ) : (
                                        <span className="hover:text-primary">Available</span>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
              
              {/* Legend */}
              <Card className="mt-4">
                <CardContent className="p-4">
                  <h3 className="font-medium mb-3">Legend</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-blue-500 rounded"></div>
                      <span className="text-sm">Confirmed</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                      <span className="text-sm">Pending</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-gray-500 rounded"></div>
                      <span className="text-sm">Rejected</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-violet-600 rounded"></div>
                      <span className="text-sm">Date Blocked</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-700 rounded"></div>
                      <span className="text-sm">Completed</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-red-600 rounded"></div>
                      <span className="text-sm">Dropped</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Side Panel */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    {selectedCalendarDate ? (
                      selectedCalendarDate.toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'short',
                        day: 'numeric'
                      })
                    ) : (
                      'Select a Date'
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedCalendarDate ? (
                    <div className="space-y-4">
                      {getBookingsForDate(selectedCalendarDate).length > 0 ? (
                        <div className="space-y-3">
                          <h4 className="font-medium text-sm text-muted-foreground">
                            {isPastDate(selectedCalendarDate) ? 'Past events for this day:' : 'Bookings for this day:'}
                          </h4>
                          {getBookingsForDate(selectedCalendarDate).map(booking => (
                            <div
                              key={booking.id}
                              className="p-3 border rounded-lg cursor-pointer hover:bg-muted/50"
                              onClick={() => {
                                setSelectedBooking(booking);
                                setShowBookingDetails(true);
                              }}
                            >
                              <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center space-x-2">
                                  <div className={`w-2 h-2 rounded-full ${booking.color}`}></div>
                                  <span className="font-medium text-sm">{booking.client}</span>
                                </div>
                                {booking.createdBy === 'user' && booking.status === 'pending' && (
                                  <Badge variant="secondary" className="text-xs">
                                    User Request
                                  </Badge>
                                )}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {booking.time === 'all-day' ? 'All Day' : `${booking.time} - ${booking.endTime}`} • {booking.type}
                              </div>
                              <div className="flex items-center justify-between mt-1">
                                <Badge 
                                  variant={
                                    booking.status === 'confirmed' ? 'default' : 
                                    booking.status === 'pending' ? 'secondary' : 
                                    booking.status === 'rejected' ? 'destructive' :
                                    booking.status === 'completed' ? 'default' :
                                    booking.status === 'dropped' ? 'destructive' :
                                    'outline'
                                  } 
                                  className={`text-xs ${
                                    booking.status === 'completed' ? 'bg-green-700 hover:bg-green-700' :
                                    booking.status === 'dropped' ? 'bg-red-600 hover:bg-red-600' : ''
                                  }`}
                                >
                                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                </Badge>
                              </div>
                              
                              {/* Quick Actions for User-Created Pending Bookings */}
                              {booking.createdBy === 'user' && booking.status === 'pending' && (
                                <div className="flex space-x-1 mt-2" onClick={(e) => e.stopPropagation()}>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="text-green-600 border-green-600 hover:bg-green-50 text-xs h-6 px-2"
                                    onClick={() => handleCalendarApprove(booking.id)}
                                  >
                                    <Check className="h-3 w-3 mr-1" />
                                    Approve
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="text-red-600 border-red-600 hover:bg-red-50 text-xs h-6 px-2"
                                    onClick={() => handleCalendarReject(booking.id)}
                                  >
                                    <X className="h-3 w-3 mr-1" />
                                    Reject
                                  </Button>
                                </div>
                              )}
                              
                              {/* Drop Action for Confirmed Bookings */}
                              {booking.status === 'confirmed' && (
                                <div className="flex space-x-1 mt-2" onClick={(e) => e.stopPropagation()}>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="text-red-600 border-red-600 hover:bg-red-50 text-xs h-6 px-2"
                                    onClick={() => handleDropBooking(booking.id)}
                                  >
                                    <X className="h-3 w-3 mr-1" />
                                    Drop
                                  </Button>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-4">
                          <CalendarIcon className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                          <p className="text-sm text-muted-foreground mb-3">
                            {isPastDate(selectedCalendarDate) ? 'No past events for this day' : 'No bookings for this day'}
                          </p>
                          {!isPastDate(selectedCalendarDate) && (
                            <Button
                              size="sm"
                              onClick={() => {
                                setNewBookingForm(prev => ({
                                  ...prev,
                                  date: formatDateForCalendar(selectedCalendarDate)
                                }));
                                setShowAddBooking(true);
                              }}
                            >
                              <Plus className="h-3 w-3 mr-1" />
                              Add Booking
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <CalendarIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-sm text-muted-foreground">
                        Click on a date to see bookings and availability
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="availability" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recurring Availability */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Weekly Availability
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {availabilitySlots.length > 0 ? (
                  availabilitySlots.map(slot => (
                    <div key={slot.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{getDayName(slot.dayOfWeek)}</h4>
                          <Badge variant={slot.isActive ? "default" : "secondary"}>
                            {slot.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleAvailability(slot.id)}
                          >
                            <Settings className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditAvailability(slot)}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteAvailability(slot.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      {slot.timeSlots.map((timeSlot, index) => (
                        <div key={index} className="text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Clock className="h-3 w-3" />
                            {timeSlot.startTime} - {timeSlot.endTime}
                          </div>
                          <p className="mt-1">{timeSlot.type}</p>
                        </div>
                      ))}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Availability Set</h3>
                    <p className="text-muted-foreground mb-4">
                      Set your weekly availability to let clients know when you're available for bookings.
                    </p>
                    <Button onClick={() => { resetAvailabilityForm(); setShowAddAvailability(true); }}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Your First Availability
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Blocked Dates */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <X className="h-5 w-5" />
                  Blocked Dates
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {blockedDates.length > 0 ? (
                  blockedDates.map(blockedDate => (
                    <div key={blockedDate.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h4 className="font-medium">{blockedDate.date}</h4>
                          <p className="text-sm text-muted-foreground">{blockedDate.reason}</p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteBlockedDate(blockedDate.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <CalendarIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Blocked Dates</h3>
                    <p className="text-muted-foreground mb-4">
                      Block specific dates when you're not available for bookings.
                    </p>
                    <Button onClick={() => { resetBlockDateForm(); setShowBlockDate(true); }}>
                      <X className="h-4 w-4 mr-2" />
                      Block a Date
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Add/Edit Availability Dialog */}
      <Dialog open={showAddAvailability} onOpenChange={setShowAddAvailability}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingSlot ? 'Edit Availability' : 'Add New Availability'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddAvailability} className="space-y-4">
            <div>
              <Label htmlFor="dayOfWeek">Day of Week</Label>
              <Select 
                value={availabilityForm.dayOfWeek} 
                onValueChange={(value) => setAvailabilityForm(prev => ({ ...prev, dayOfWeek: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select day" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monday">Monday</SelectItem>
                  <SelectItem value="tuesday">Tuesday</SelectItem>
                  <SelectItem value="wednesday">Wednesday</SelectItem>
                  <SelectItem value="thursday">Thursday</SelectItem>
                  <SelectItem value="friday">Friday</SelectItem>
                  <SelectItem value="saturday">Saturday</SelectItem>
                  <SelectItem value="sunday">Sunday</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startTime">Start Time</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={availabilityForm.startTime}
                  onChange={(e) => setAvailabilityForm(prev => ({ ...prev, startTime: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="endTime">End Time</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={availabilityForm.endTime}
                  onChange={(e) => setAvailabilityForm(prev => ({ ...prev, endTime: e.target.value }))}
                  required
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="type">Photography Type</Label>
              <Select 
                value={availabilityForm.type} 
                onValueChange={(value) => setAvailabilityForm(prev => ({ ...prev, type: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select photography type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Types">All Types</SelectItem>
                  <SelectItem value="Wedding Photography">Wedding Photography</SelectItem>
                  <SelectItem value="Portrait Sessions">Portrait Sessions</SelectItem>
                  <SelectItem value="Event Photography">Event Photography</SelectItem>
                  <SelectItem value="Corporate Photography">Corporate Photography</SelectItem>
                  <SelectItem value="Family Photography">Family Photography</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isActive"
                checked={availabilityForm.isActive}
                onChange={(e) => setAvailabilityForm(prev => ({ ...prev, isActive: e.target.checked }))}
                className="rounded"
              />
              <Label htmlFor="isActive">Active (clients can book during this time)</Label>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setShowAddAvailability(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {editingSlot ? 'Update Availability' : 'Add Availability'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Block Date Dialog */}
      <Dialog open={showBlockDate} onOpenChange={setShowBlockDate}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Block Date</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleBlockDate} className="space-y-4">
            <div>
              <Label htmlFor="blockDate">Date to Block</Label>
              <Input
                id="blockDate"
                type="date"
                value={blockDateForm.date}
                onChange={(e) => setBlockDateForm(prev => ({ ...prev, date: e.target.value }))}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="reason">Reason (Optional)</Label>
              <Textarea
                id="reason"
                placeholder="e.g., Personal vacation, Equipment maintenance, etc."
                value={blockDateForm.reason}
                onChange={(e) => setBlockDateForm(prev => ({ ...prev, reason: e.target.value }))}
                rows={3}
              />
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setShowBlockDate(false)}>
                Cancel
              </Button>
              <Button type="submit">
                Block Date
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add Manual Booking Dialog */}
      <Dialog open={showAddBooking} onOpenChange={setShowAddBooking}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Manual Booking</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddManualBooking} className="space-y-4">
            <div>
              <Label htmlFor="bookingDate">Date</Label>
              <Input
                id="bookingDate"
                type="date"
                value={newBookingForm.date}
                onChange={(e) => setNewBookingForm(prev => ({ ...prev, date: e.target.value }))}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="bookingTime">Start Time</Label>
                <Input
                  id="bookingTime"
                  type="time"
                  value={newBookingForm.time}
                  onChange={(e) => setNewBookingForm(prev => ({ ...prev, time: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="bookingEndTime">End Time</Label>
                <Input
                  id="bookingEndTime"
                  type="time"
                  value={newBookingForm.endTime}
                  onChange={(e) => setNewBookingForm(prev => ({ ...prev, endTime: e.target.value }))}
                  required
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="clientName">Client Name</Label>
              <Input
                id="clientName"
                value={newBookingForm.client}
                onChange={(e) => setNewBookingForm(prev => ({ ...prev, client: e.target.value }))}
                placeholder="Enter client name"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="bookingType">Photography Type</Label>
              <Select 
                value={newBookingForm.type} 
                onValueChange={(value) => setNewBookingForm(prev => ({ ...prev, type: value, customType: '' }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select photography type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Wedding Photography">Wedding Photography</SelectItem>
                  <SelectItem value="Event Photography">Event Photography</SelectItem>
                  <SelectItem value="Professional Headshots">Professional Headshots</SelectItem>
                  <SelectItem value="Family Session">Family Session</SelectItem>
                  <SelectItem value="Engagement Session">Engagement Session</SelectItem>
                  <SelectItem value="Business Headshots">Business Headshots</SelectItem>
                  <SelectItem value="Graduation Photos">Graduation Photos</SelectItem>
                  <SelectItem value="Quinceañera">Quinceañera</SelectItem>
                  <SelectItem value="Other">Other (Custom)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {newBookingForm.type === 'Other' && (
              <div>
                <Label htmlFor="customType">Custom Photography Type</Label>
                <Input
                  id="customType"
                  value={newBookingForm.customType}
                  onChange={(e) => setNewBookingForm(prev => ({ ...prev, customType: e.target.value }))}
                  placeholder="Enter custom photography type"
                  required
                />
              </div>
            )}
            
            <div>
              <Label htmlFor="bookingStatus">Status</Label>
              <Select 
                value={newBookingForm.status} 
                onValueChange={(value: 'confirmed' | 'pending' | 'completed' | 'dropped') => setNewBookingForm(prev => ({ ...prev, status: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="dropped">Dropped</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="bookingNotes">Notes (Optional)</Label>
              <Textarea
                id="bookingNotes"
                value={newBookingForm.notes}
                onChange={(e) => setNewBookingForm(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Additional notes about the booking"
                rows={3}
              />
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setShowAddBooking(false)}>
                Cancel
              </Button>
              <Button type="submit">
                Add Booking
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Booking Details Dialog */}
      <Dialog open={showBookingDetails} onOpenChange={setShowBookingDetails}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <div className={`w-3 h-3 rounded-full ${selectedBooking.color}`}></div>
                  <h3 className="font-semibold">{selectedBooking.client}</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-1">{selectedBooking.type}</p>
                <div className="text-sm">
                  <p><strong>Date:</strong> {selectedBooking.date}</p>
                  <p><strong>Time:</strong> {selectedBooking.time === 'all-day' ? 'All Day' : selectedBooking.time}</p>
                  <p><strong>Status:</strong> 
                    <Badge 
                      variant={
                        selectedBooking.status === 'confirmed' ? 'default' : 
                        selectedBooking.status === 'pending' ? 'secondary' : 
                        selectedBooking.status === 'rejected' ? 'destructive' :
                        selectedBooking.status === 'completed' ? 'default' :
                        selectedBooking.status === 'dropped' ? 'destructive' :
                        'outline'
                      } 
                      className={`ml-2 ${
                        selectedBooking.status === 'completed' ? 'bg-green-700 hover:bg-green-700' :
                        selectedBooking.status === 'dropped' ? 'bg-red-600 hover:bg-red-600' : ''
                      }`}
                    >
                      {selectedBooking.status.charAt(0).toUpperCase() + selectedBooking.status.slice(1)}
                    </Badge>
                  </p>
                  {selectedBooking.email && (
                    <p><strong>Email:</strong> {selectedBooking.email}</p>
                  )}
                  {selectedBooking.phone && (
                    <p><strong>Phone:</strong> {selectedBooking.phone}</p>
                  )}
                  {selectedBooking.notes && (
                    <p className="mt-2"><strong>Notes:</strong> {selectedBooking.notes}</p>
                  )}
                </div>
              </div>
              
              {selectedBooking.status === 'pending' && (
                <div className="flex space-x-2">
                  <Button 
                    onClick={() => handleCalendarApprove(selectedBooking.id)}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Approve
                  </Button>
                  <Button 
                    variant="destructive"
                    onClick={() => handleCalendarReject(selectedBooking.id)}
                    className="flex-1"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                </div>
              )}
              
              {(selectedBooking.status === 'confirmed' || selectedBooking.status === 'rejected') && (
                <div className="flex space-x-2">
                  <Button variant="outline" className="flex-1">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Chat with Client
                  </Button>
                  {selectedBooking.status === 'confirmed' && (
                    <>
                      <Button variant="outline" className="flex-1">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button 
                        variant="destructive"
                        onClick={() => handleDropBooking(selectedBooking.id)}
                        className="flex-1"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Drop
                      </Button>
                    </>
                  )}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Past Events Dialog */}
      <Dialog open={showPastEvents} onOpenChange={setShowPastEvents}>
        <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Past Events</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {getPastBookings().length > 0 ? (
              getPastBookings().map(booking => (
                <Card key={booking.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <div className={`w-3 h-3 rounded-full ${booking.color}`}></div>
                          <h3 className="font-semibold">{booking.client}</h3>
                          <Badge variant="outline">
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">{booking.type}</p>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="flex items-center text-muted-foreground">
                            <CalendarIcon className="h-3 w-3 mr-1" />
                            {new Date(booking.date).toLocaleDateString('en-US', {
                              weekday: 'short',
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </div>
                          <div className="flex items-center text-muted-foreground">
                            <Clock className="h-3 w-3 mr-1" />
                            {booking.time === 'all-day' ? 'All Day' : `${booking.time} - ${booking.endTime}`}
                          </div>
                          {booking.package && (
                            <div className="text-sm text-muted-foreground">
                              {booking.package}
                            </div>
                          )}
                        </div>
                        {booking.notes && (
                          <div className="mt-2 p-2 bg-muted rounded text-sm">
                            {booking.notes}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-8">
                <CalendarIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No Past Events</h3>
                <p className="text-muted-foreground">Your completed events will appear here</p>
              </div>
            )}
          </div>
          <div className="flex justify-end">
            <Button onClick={() => setShowPastEvents(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Calendar Dialog for checking availability */}
      <Dialog open={showCalendar} onOpenChange={setShowCalendar}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Check Availability</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedRequest && (
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium">{selectedRequest.client}</h4>
                <p className="text-sm text-muted-foreground">
                  Requested: {selectedRequest.requestedDate} at {selectedRequest.requestedTime}
                </p>
              </div>
            )}
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
            />
            <div className="flex space-x-2">
              <Button 
                onClick={() => {
                  if (selectedRequest) {
                    handleApproveRequest(selectedRequest.id);
                  }
                  setShowCalendar(false);
                }}
                className="flex-1"
              >
                Approve Booking
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowCalendar(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}