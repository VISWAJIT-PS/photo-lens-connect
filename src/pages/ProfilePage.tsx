import React from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Navigation } from "@/components/ui/navigation";
import { 
  ArrowLeft, 
  Star, 
  MapPin, 
  Camera, 
  Video, 
  Calendar, 
  Award, 
  Users, 
  Clock,
  Phone,
  MessageCircle,
  CalendarDays,
  DollarSign,
  Eye,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { format, addDays, isSameDay } from 'date-fns';
import { Input } from '@/components/ui/input';
import { useState, useRef, useEffect } from 'react';
import { OnboardingPopup } from '@/components/OnboardingPopup';
import { useToast } from '@/components/ui/use-toast';

const ProfilePage = () => {
  const { type, id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { creator } = location.state || {};

  // local UI state for booking flow
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [isBooked, setIsBooked] = useState(false);
  const [chatEnabled, setChatEnabled] = useState(false);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [customEventName, setCustomEventName] = useState<string>('');
  const [customAmountError, setCustomAmountError] = useState<string | null>(null);
  const [showPackageDetails, setShowPackageDetails] = useState(false);
  const [currentSelectedPackageData, setCurrentSelectedPackageData] = useState<any>(null);
  const customInputRef = useRef<HTMLInputElement | null>(null);
  const { toast } = useToast();

  // Mock availability data - in real app this would come from API
  const today = new Date();
  const availableDates = [
    addDays(today, 3),
    addDays(today, 5),
    addDays(today, 7),
    addDays(today, 10),
    addDays(today, 12),
    addDays(today, 15),
    addDays(today, 18),
    addDays(today, 20),
    addDays(today, 22),
    addDays(today, 25),
    addDays(today, 28),
    addDays(today, 30)
  ];

  const bookedDates = [
    addDays(today, 1),
    addDays(today, 2),
    addDays(today, 4),
    addDays(today, 6),
    addDays(today, 8),
    addDays(today, 9),
    addDays(today, 11),
    addDays(today, 14),
    addDays(today, 16),
    addDays(today, 17),
    addDays(today, 19),
    addDays(today, 21)
  ];

  const isDateAvailable = (date: Date) => {
    return availableDates.some(availableDate => isSameDay(availableDate, date));
  };

  const isDateBooked = (date: Date) => {
    return bookedDates.some(bookedDate => isSameDay(bookedDate, date));
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date && isDateAvailable(date)) {
      setSelectedDate(date);
      toast({ 
        title: 'Date Selected', 
        description: `Selected ${format(date, 'PPP')} for booking` 
      });
    } else if (date && isDateBooked(date)) {
      toast({ 
        title: 'Date Unavailable', 
        description: 'This date is already booked',
        variant: 'destructive'
      });
    }
  };

  interface OnboardingData {
    eventDate?: string | Date | null;
    location?: string;
    serviceTypes?: string[];
  }

  const readOnboardingData = (): OnboardingData | null => {
    try {
      const raw = localStorage.getItem('onboarding_data');
      return raw ? JSON.parse(raw) as OnboardingData : null;
    } catch (e) {
      return null;
    }
  };

  const writeOnboardingData = (data: OnboardingData) => {
    try {
      localStorage.setItem('onboarding_data', JSON.stringify(data));
    } catch (e) {
      // noop
    }
  };

  const handleOnboardingComplete = (data: OnboardingData) => {
    // ensure service type is present
    const svc = type === 'photographer' ? 'photographers' : type === 'videographer' ? 'videographers' : null;
    const serviceTypes = Array.isArray(data.serviceTypes) ? data.serviceTypes.slice() : [];
    if (svc && !serviceTypes.includes(svc)) serviceTypes.push(svc);

    const final = { ...data, serviceTypes };
    writeOnboardingData(final);
    setShowOnboarding(false);
    toast({ title: 'Onboarding complete', description: 'Your booking preferences were saved.' });
  };

  const handleBookNowClick = () => {
    const existing = readOnboardingData();

    if (existing) {
      const merged = { ...existing };
      merged.serviceTypes = Array.isArray(merged.serviceTypes) ? merged.serviceTypes.slice() : [];
      const svc = type === 'photographer' ? 'photographers' : type === 'videographer' ? 'videographers' : null;
      if (svc && !merged.serviceTypes.includes(svc)) merged.serviceTypes.push(svc);
      if (selectedDate) merged.eventDate = selectedDate;
      writeOnboardingData(merged);
      toast({ title: 'Booking prepared', description: `Saved booking preferences for ${creator.name}${selectedDate ? ` on ${format(selectedDate, 'PPP')}` : ''}` });
    } else {
      // open onboarding popup to collect missing data
      setShowOnboarding(true);
      toast({ title: 'Complete preferences', description: 'Please provide event date, location and services to continue.' });
    }
  };

  // Event packages data
  const eventPackages = [
    { 
      id: 'marriage', 
      name: 'Marriage Package', 
      price: '₹50,000-70,000', 
      description: 'Complete wedding photography coverage',
      subPlans: [
        { name: 'Basic Wedding', price: '₹50,000-55,000', features: ['6 hours coverage', '300+ photos', 'Online gallery'] },
        { name: 'Premium Wedding', price: '₹60,000-65,000', features: ['8 hours coverage', '500+ photos', 'Photo album', 'Online gallery'] },
        { name: 'Luxury Wedding', price: '₹65,000-70,000', features: ['10 hours coverage', '700+ photos', 'Premium album', 'Same day highlights', 'Online gallery'] }
      ]
    },
    { 
      id: 'save-date', 
      name: 'Save The Date', 
      price: '₹15,000-25,000', 
      description: 'Pre-wedding shoot package',
      subPlans: [
        { name: 'Classic Shoot', price: '₹15,000-18,000', features: ['2 hours shoot', '50+ photos', 'Basic editing'] },
        { name: 'Cinematic Shoot', price: '₹20,000-22,000', features: ['3 hours shoot', '75+ photos', 'Advanced editing', 'Short video'] },
        { name: 'Destination Shoot', price: '₹22,000-25,000', features: ['4 hours shoot', '100+ photos', 'Premium editing', 'Travel included'] }
      ]
    },
    { 
      id: 'bridal-shower', 
      name: 'Bridal Shower', 
      price: '₹10,000-18,000', 
      description: 'Intimate celebration photography',
      subPlans: [
        { name: 'Intimate Gathering', price: '₹10,000-12,000', features: ['2 hours coverage', '100+ photos', 'Basic editing'] },
        { name: 'Party Coverage', price: '₹14,000-16,000', features: ['3 hours coverage', '150+ photos', 'Advanced editing'] },
        { name: 'Full Event', price: '₹16,000-18,000', features: ['4 hours coverage', '200+ photos', 'Same day preview'] }
      ]
    },
    { 
      id: 'add-shoot', 
      name: 'Additional Shoot', 
      price: '₹8,000-15,000', 
      description: 'Extra hours or event coverage',
      subPlans: [
        { name: 'Extended Hours', price: '₹8,000-10,000', features: ['2 extra hours', '100+ photos', 'Basic editing'] },
        { name: 'Extra Event', price: '₹12,000-13,000', features: ['Additional event', '200+ photos', 'Advanced editing'] },
        { name: 'Multiple Sessions', price: '₹13,000-15,000', features: ['Multiple shoots', '300+ photos', 'Premium editing'] }
      ]
    }
  ];

  const handlePackageSelect = (pkg: string) => {
    setSelectedPackage(pkg);
    // reset booking/chat state when picking a new package
    setIsBooked(false);
    setChatEnabled(false);
    // clear validation when switching
    setCustomAmountError(null);
    
    // Show package details for event packages
    if (pkg !== 'custom') {
      const packageData = eventPackages.find(p => p.id === pkg);
      if (packageData) {
        setCurrentSelectedPackageData(packageData);
        setShowPackageDetails(true);
      }
    }
  };

  const handleBookPackage = (subPlanName: string) => {
    const message = `Hi ${creator.name}! I'm interested in booking the ${subPlanName} from your ${currentSelectedPackageData?.name || 'Custom'} package. Could you please provide more details and confirm availability?`;
    
    toast({
      title: "Booking Initiated",
      description: "A message has been sent to the photographer. You'll be redirected to chat.",
    });

    // Navigate to chat with the photographer
    setTimeout(() => {
      const conversationId = `conv-${creator.id}`;
      navigate(`/chat/${conversationId}?name=${encodeURIComponent(creator.name)}&role=${encodeURIComponent(type)}&avatar=${encodeURIComponent(creator.image_url)}`);
    }, 1500);
    
    setShowPackageDetails(false);
    setIsBooked(true);
    setChatEnabled(true);
  };

  useEffect(() => {
    if (selectedPackage === 'custom') {
      // focus the custom amount input when custom package selected
      setTimeout(() => customInputRef.current?.focus(), 50);
    }
  }, [selectedPackage]);

  const isCustomAmountValid = () => {
    const amt = customAmount.trim();
    return amt !== '' && !Number.isNaN(Number(amt)) && Number(amt) > 0;
  };

  const isBookDisabled = !selectedPackage || (selectedPackage === 'custom' && !isCustomAmountValid());

  const handleConfirmBooking = () => {
    if (!selectedPackage) {
      toast({ title: 'Select a package', description: 'Please choose a package before booking', variant: 'destructive' });
      return;
    }

    // perform booking preparation (mock)
    setIsBooked(true);
    setChatEnabled(true);
    toast({ title: 'Package booked', description: `You selected the ${selectedPackage} package. Chat enabled.` });
    // Compose booking message and persist to mock chat storage so ChatTab can load it
    try {
      const vendorId = creator?.id ?? 'unknown';
      const key = `mock_chat_${vendorId}`;
      const raw = localStorage.getItem(key);
      const arr = raw ? JSON.parse(raw) as any[] : [];
      const message = `Hi ${creator?.name}, I'd like to book the ${selectedPackage} package${selectedPackage === 'custom' ? ` for $${customAmount}` : ''}. Please confirm.`;
      arr.push({ author: 'user', content: message, timestamp: new Date().toISOString() });
      localStorage.setItem(key, JSON.stringify(arr));
    } catch (e) {
      // noop
    }

    // navigate to chat view for this creator
    const conversationId = `conv-${creator.id}`;
    navigate(`/chat/${conversationId}?name=${encodeURIComponent(creator.name)}&role=${encodeURIComponent(type)}&avatar=${encodeURIComponent(creator.image_url)}`);
  };

  if (!creator) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-20">
          <p>Creator not found</p>
        </div>
      </div>
    );
  }

  // Dummy gallery images
const galleryImages = [
  {
    src: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=600",
    title: "Wedding Decor",
    description: "Elegant floral arrangements and lighting setup."
  },
  {
    src: "https://images.unsplash.com/photo-1519741497674-611481863552?w=600",
    title: "Bridal Portrait",
    description: "Capturing the bride’s stunning look in natural light."
  },
  {
    src: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=600",
    title: "Couple Moments",
    description: "A candid moment between the couple."
  },
  {
    src: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600",
    title: "Dance Floor",
    description: "Guests enjoying the celebration with music and dance."
  },
  {
    src: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=600",
    title: "Venue Setup",
    description: "Beautifully arranged venue with creative themes."
  },
  {
    src: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=600",
    title: "Wedding Cake",
    description: "A grand wedding cake centerpiece."
  }
];

  // Gallery modal / lightbox state
  const [galleryModalOpen, setGalleryModalOpen] = useState(false);
  const [galleryModalIndex, setGalleryModalIndex] = useState(0);

  // Dummy events data
  const latestEvents = [
    { name: "Sarah & John Wedding", date: "2024-01-15", location: "Beverly Hills" },
    { name: "Tech Conference 2024", date: "2024-01-10", location: "San Francisco" },
    { name: "Family Portrait Session", date: "2024-01-05", location: "Central Park" }
  ];

  const popularEvents = [
    { name: "Celebrity Gala Night", date: "2023-12-20", attendees: 500 },
    { name: "Fashion Week Finale", date: "2023-11-15", attendees: 800 },
    { name: "Corporate Summit", date: "2023-10-30", attendees: 1200 }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-20">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-6 hover:bg-accent"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Search
        </Button>

        {/* Profile Header */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <Card className="p-6">
              <div className="flex items-start space-x-6">
                <img
                  src={creator.image_url}
                  alt={creator.name}
                  className="w-32 h-32 rounded-full object-cover ring-4 ring-primary/20"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold">{creator.name}</h1>
                    {type === 'videographer' && <Video className="h-6 w-6 text-primary" />}
                    {type === 'photographer' && <Camera className="h-6 w-6 text-primary" />}
                  </div>
                  
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center space-x-1">
                      <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">{creator.rating}</span>
                      <span className="text-muted-foreground">({creator.reviews} reviews)</span>
                    </div>
                    {/* <Badge variant="secondary" className="text-lg px-3 py-1">
                      {creator.price}
                    </Badge> */}
                  </div>

                  <div className="flex items-center gap-6 mb-4 text-muted-foreground">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {creator.location}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {creator.experience_years} years
                    </div>
                    <div className="flex items-center">
                      <Camera className="h-4 w-4 mr-1" />
                      {creator.portfolio_count} Book Your Event
                    </div>
                  </div>

                  {/* Specializations as badges - support array or comma-separated string */}
                  {(() => {
                    const raw = creator.specialization ?? '';
                    const specs = Array.isArray(raw) ? raw : String(raw).split(',').map(s => s.trim()).filter(Boolean);
                    return specs.length ? (
                      <div className="flex items-center gap-2 mb-4">
                        {specs.map((s: string) => (
                          <Badge key={s} variant="secondary" className="text-sm">{s}</Badge>
                        ))}
                      </div>
                    ) : null;
                  })()}

                  <p className="text-muted-foreground mb-6">{creator.bio}</p>

                  <div className="flex gap-3 items-center">
                    {/* <div className="text-sm text-muted-foreground">Select a package in "Package Options" to enable booking and chat.</div> */}
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            {/* Quick Stats */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Quick Stats</h3>
              <div className="space-y-3">
                {/* <div className="flex justify-between">
                  <span className="text-muted-foreground">Specialization</span>
                  <span className="font-medium">{creator.specialization}</span>
                </div> */}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Response Time</span>
                  <span className="font-medium">Within 2 hours</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Booking Rate</span>
                  <span className="font-medium">95%</span>
                </div>
              </div>
            </Card>

            {/* Achievement Badge */}
            <Card className="p-6 bg-gradient-to-br from-primary/10 to-secondary/10">
              <div className="flex items-center gap-3 mb-2">
                <Award className="h-6 w-6 text-primary" />
                <h3 className="font-semibold">Top Rated</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Consistently rated 4.8+ stars by clients
              </p>
            </Card>
          </div>
        </div>

        {/* Ratings & Reviews and Price Variations Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Ratings & Reviews */}
          <Card className="p-6">
            <CardHeader className="px-0 pt-0">
              <CardTitle className="flex items-center gap-2 mb-4">
                <Star className="h-5 w-5" />
                Ratings & Reviews
              </CardTitle>
            </CardHeader>
            <CardContent className="px-0 pb-0">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="text-4xl font-bold">{creator.rating}</div>
                  <div>
                    <div className="flex items-center gap-1 mb-1">
                      {[1,2,3,4,5].map((star) => (
                        <Star 
                          key={star} 
                          className={`h-4 w-4 ${star <= Math.floor(creator.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`} 
                        />
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground">{creator.reviews} reviews</p>
                  </div>
                </div>
                
                {/* Sample reviews */}
                <div className="space-y-3 border-t pt-4">
                  {[
                    { name: "John D.", rating: 5, comment: "Outstanding work! Exceeded expectations.", date: "2 weeks ago" },
                    { name: "Sarah M.", rating: 5, comment: "Professional and creative. Highly recommend!", date: "1 month ago" },
                    { name: "Mike R.", rating: 4, comment: "Great experience overall. Will book again.", date: "2 months ago" }
                  ].map((review, idx) => (
                    <div key={idx} className="p-3 bg-muted/50 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">{review.name}</span>
                          <div className="flex">
                            {[1,2,3,4,5].map((star) => (
                              <Star 
                                key={star} 
                                className={`h-3 w-3 ${star <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`} 
                              />
                            ))}
                          </div>
                        </div>
                        <span className="text-xs text-muted-foreground">{review.date}</span>
                      </div>
                      <p className="text-sm">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Price Variations */}
          <Card className="p-6">
            <CardHeader className="px-0 pt-0">
              <CardTitle className="flex items-center gap-2 mb-4">
                <DollarSign className="h-5 w-5" />
                Package Options
              </CardTitle>
            </CardHeader>
            <CardContent className="px-0 pb-0">
              <div className="space-y-4">
                <div className="space-y-3">
                  {/* Event-Based Packages */}
                  <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-accent transition-colors">
                    <input type="radio" name="package" value="marriage" className="text-primary" checked={selectedPackage === 'marriage'} onChange={() => handlePackageSelect('marriage')} />
                    <div className="flex-1">
                      <div className="font-semibold">Marriage Package</div>
                      <div className="text-sm text-muted-foreground">Complete wedding photography coverage</div>
                      <Badge variant="secondary" className="mt-1">₹50,000-70,000</Badge>
                    </div>
                  </label>
                  
                  <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-accent transition-colors">
                    <input type="radio" name="package" value="save-date" className="text-primary" checked={selectedPackage === 'save-date'} onChange={() => handlePackageSelect('save-date')} />
                    <div className="flex-1">
                      <div className="font-semibold">Save The Date</div>
                      <div className="text-sm text-muted-foreground">Pre-wedding shoot package</div>
                      <Badge variant="secondary" className="mt-1">₹15,000-25,000</Badge>
                    </div>
                  </label>
                  
                  <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-accent transition-colors">
                    <input type="radio" name="package" value="bridal-shower" className="text-primary" checked={selectedPackage === 'bridal-shower'} onChange={() => handlePackageSelect('bridal-shower')} />
                    <div className="flex-1">
                      <div className="font-semibold">Bridal Shower</div>
                      <div className="text-sm text-muted-foreground">Intimate celebration photography</div>
                      <Badge variant="secondary" className="mt-1">₹10,000-18,000</Badge>
                    </div>
                  </label>
                  
                  <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-accent transition-colors">
                    <input type="radio" name="package" value="add-shoot" className="text-primary" checked={selectedPackage === 'add-shoot'} onChange={() => handlePackageSelect('add-shoot')} />
                    <div className="flex-1">
                      <div className="font-semibold">Additional Shoot</div>
                      <div className="text-sm text-muted-foreground">Extra hours or event coverage</div>
                      <Badge variant="secondary" className="mt-1">₹8,000-15,000</Badge>
                    </div>
                  </label>
                  
                  <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-accent transition-colors">
                    <input type="radio" name="package" value="custom" className="text-primary" checked={selectedPackage === 'custom'} onChange={() => handlePackageSelect('custom')} />
                    <div className="flex-1">
                      <div className="font-semibold">Custom Package</div>
                      <div className="text-sm text-muted-foreground">Tailored to your budget and needs</div>
                      <div className="mt-2 space-y-2">
                         <Input 
                           placeholder="Event name (e.g., Anniversary, Corporate Event)" 
                           className={`${selectedPackage === 'custom' && !customEventName ? 'ring-1 ring-destructive/60' : ''}`} 
                           value={customEventName}
                           onChange={(e) => setCustomEventName(e.target.value)}
                           onClick={(e) => e.stopPropagation()}
                         />
                        <Input 
                          placeholder="Budget range (e.g., ₹25,000-40,000)" 
                          className={`${selectedPackage === 'custom' && !isCustomAmountValid() ? 'ring-1 ring-destructive/60' : ''}`} 
                          value={customAmount}
                          onChange={(e) => { setCustomAmount(e.target.value); setCustomAmountError(null); }}
                          onClick={(e) => e.stopPropagation()}
                          ref={(el: HTMLInputElement) => (customInputRef.current = el)}
                          required={selectedPackage === 'custom'}
                        />
                      </div>
                      {customAmountError && <div className="text-xs text-destructive mt-1">{customAmountError}</div>}
                    </div>
                  </label>
                  
                  {/* Booking / Chat buttons moved here */}
                  <div className="flex items-center gap-3 mt-4">
                    <Button size="lg" className="flex-1" onClick={handleConfirmBooking} disabled={isBookDisabled}>
                      <Calendar className="h-4 w-4 mr-2" />
                      Book Selected Package
                    </Button>

                    <Button variant="outline" size="lg" onClick={() => {
                      if (!chatEnabled) return;
                      const conversationId = `conv-${creator.id}`;
                      navigate(`/chat/${conversationId}?name=${encodeURIComponent(creator.name)}&role=${encodeURIComponent(type)}&avatar=${encodeURIComponent(creator.image_url)}`);
                    }} disabled={!chatEnabled}>
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Chat {chatEnabled ? '' : '(Book First)'}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Portfolio Gallery */}
        <Card className="p-6">
          <CardHeader className="px-0 pt-0">
            <CardTitle className="flex items-center gap-2 mb-6">
              <Camera className="h-5 w-5" />
              Best Work Gallery
            </CardTitle>
          </CardHeader>
          <CardContent className="px-0 pb-0">
            <Carousel className="w-full">
              <CarouselContent className="-ml-2 md:-ml-4">
                {galleryImages.map((image, index) => (
      <CarouselItem key={index} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
  <div className="relative group overflow-hidden rounded-lg">
    <img
      src={image.src}
      alt={`Gallery ${index + 1}`}
      className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
    />

    {/* Overlay with title, description & button */}
    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center text-center px-4">
      <h3 className="text-white text-lg font-semibold mb-1">{image.title}</h3>
      <p className="text-white text-sm mb-3">{image.description}</p>
      <Badge
        variant="secondary"
        className="text-white bg-white/20 cursor-pointer"
        onClick={(e) => {
          e.stopPropagation();
          setGalleryModalIndex(index);
          setGalleryModalOpen(true);
        }}
      >
        View Full Size
      </Badge>
    </div>
  </div>
</CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-2" />
              <CarouselNext className="right-2" />
            </Carousel>
            {/* Gallery lightbox dialog */}
            <Dialog open={galleryModalOpen} onOpenChange={setGalleryModalOpen}>
              <DialogContent className="max-w-4xl">
                <div className="relative">
                  <img src={galleryImages[galleryModalIndex].src} alt={`Gallery ${galleryModalIndex + 1}`} className="w-full h-[70vh] object-contain" />
                  <div className="absolute left-2 top-1/2 transform -translate-y-1/2">
                    <Button variant="secondary" size="icon" onClick={() => setGalleryModalIndex(i => (i > 0 ? i - 1 : galleryImages.length - 1))}>
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                    <Button variant="secondary" size="icon" onClick={() => setGalleryModalIndex(i => (i < galleryImages.length - 1 ? i + 1 : 0))}>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        {/* Book Now Section */}
        <Card className="p-8 mt-8 bg-gradient-to-r from-primary/10 to-secondary/10">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to Book {creator.name}?</h2>
            <p className="text-muted-foreground mb-6">
              Select a package above to proceed with booking and enable chat.
            </p>
            <Button size="lg" className="px-8" disabled={true} onClick={handleBookNowClick}>
              <Calendar className="h-5 w-5 mr-2" />
              Select Package to Continue
            </Button>
          </div>
        </Card>
      </div>

      {/* Package Details Dialog */}
      {currentSelectedPackageData && (
        <Dialog open={showPackageDetails} onOpenChange={setShowPackageDetails}>
          <DialogContent className="max-w-3xl">
            <DialogHeader className='flex gap-2'>
              <DialogTitle>{currentSelectedPackageData.name} - Choose Your Plan</DialogTitle>
                              <p className="text-muted-foreground mt-2">{currentSelectedPackageData.description}</p>
            </DialogHeader>
            <div className="space-y-6 overflow-auto h-[50vh]">
              <div className="text-center">
                {/* <Badge variant="secondary" className="text-lg px-4 py-2">{currentSelectedPackageData.price}</Badge> */}

              </div>

              <div className="grid grid-rows-2 grid-flow-col gap-4">
                {currentSelectedPackageData.subPlans?.map((subPlan: any, index: number) => (
                  <div key={index} className="border rounded-lg p-4 hover:border-primary/50 transition-colors">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold text-lg">{subPlan.name}</h4>
                        <Badge variant="outline" className="mt-1">{subPlan.price}</Badge>
                      </div>
                    </div>
                    
                    <ul className="space-y-1 text-sm text-muted-foreground mb-4">
                      {subPlan.features.map((feature: string, featureIndex: number) => (
                        <li key={featureIndex}>• {feature}</li>
                      ))}
                    </ul>
                    
                    <Button 
                      className="w-full"
                      onClick={() => handleBookPackage(subPlan.name)}
                    >
                      Book {subPlan.name}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      <OnboardingPopup isOpen={showOnboarding} onComplete={handleOnboardingComplete} onClose={() => setShowOnboarding(false)} />
    </div>
  );
};

export default ProfilePage;