import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, MapPin, Camera, Video, Users, Wrench, ChevronsUpDown } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from './ui/command';
import { SearchableSelect } from './SearchableSelect';

interface OnboardingData {
  eventDate: Date | undefined;
  location: string;
  serviceTypes: string[];
}

interface OnboardingPopupProps {
  isOpen: boolean;
  onComplete: (data: OnboardingData) => void;
  onClose?: () => void;
}

const serviceOptions = [
  { id: 'photographers', label: 'Photographers', icon: Camera },
  { id: 'videographers', label: 'Videographers', icon: Video },
  { id: 'events', label: 'Event Teams', icon: Users },
  { id: 'rentals', label: 'Equipment Rentals', icon: Wrench },
];


export const OnboardingPopup: React.FC<OnboardingPopupProps> = ({ isOpen, onComplete, onClose }) => {
  const [eventDate, setEventDate] = useState<Date>();
  const [location, setLocation] = useState('');
  const [serviceTypes, setServiceTypes] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState(1);

  const handleServiceToggle = (serviceId: string) => {
    setServiceTypes(prev => 
      prev.includes(serviceId) 
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(prev => prev + 1);
    } else {
      onComplete({
        eventDate,
        location,
        serviceTypes
      });
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return eventDate !== undefined;
      case 2: return location.trim() !== '';
      case 3: return serviceTypes.length > 0;
      default: return false;
    }
  };
const renderStep = () => {
  switch (currentStep) {
    case 1:
      return (
        <div className="space-y-6">
          <div className="text-center">
            <CalendarIcon className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">When is your event?</h3>
            <p className="text-muted-foreground">
              This helps us show available services for your date.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="event-date">Event Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !eventDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {eventDate ? format(eventDate, "PPP") : "Select event date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={eventDate}
                  onSelect={setEventDate}
                  disabled={(date) => date < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      );

    case 2: {
  const locationOptions = [
    { value: "New York, NY", label: "New York, NY" },
    { value: "Los Angeles, CA", label: "Los Angeles, CA" },
    { value: "Chicago, IL", label: "Chicago, IL" },
    { value: "San Francisco, CA", label: "San Francisco, CA" },
    { value: "Austin, TX", label: "Austin, TX" },
    { value: "Seattle, WA", label: "Seattle, WA" },
  ];

  const isPredefined = locationOptions.some((opt) => opt.value === location);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <MapPin className="h-12 w-12 text-primary mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">Where is your event?</h3>
        <p className="text-muted-foreground">
          We'll show services available in your area.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="location-combobox">Event Location</Label>

        {/* SearchableSelect Dropdown */}
        <SearchableSelect
          options={[
            ...locationOptions,
            { value: "other", label: "Other (enter manually)" },
          ]}
          value={isPredefined ? location : location ? "other" : ""}
          onValueChange={(val) => {
            if (val === "other") {
              setLocation(""); // show manual input
            } else {
              setLocation(val);
            }
          }}
          placeholder="Select a location"
        />

        {/* Show manual input when "Other" is selected */}
        {!isPredefined && location !== "" && (
          <Input
            id="location-input"
            placeholder="Enter city, state or venue"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full mt-2"
          />
        )}
      </div>
    </div>
  );
}


    case 3:
      return (
        <div className="space-y-6">
          <div className="text-center">
            <Users className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              What services do you need?
            </h3>
            <p className="text-muted-foreground">
              Select all that apply to personalize your experience.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {serviceOptions.map((service) => {
              const Icon = service.icon;
              const isSelected = serviceTypes.includes(service.id);

              return (
                <div
                  key={service.id}
                  className={cn(
                    "flex items-center space-x-2 p-4 rounded-lg border cursor-pointer transition-all",
                    isSelected
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  )}
                  onClick={() => handleServiceToggle(service.id)}
                >
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => handleServiceToggle(service.id)}
                  />
                  <Icon
                    className={cn(
                      "h-5 w-5",
                      isSelected ? "text-primary" : "text-muted-foreground"
                    )}
                  />
                  <span
                    className={cn(
                      "font-medium text-sm",
                      isSelected ? "text-primary" : "text-foreground"
                    )}
                  >
                    {service.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      );

    default:
      return null;
  }
};

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open && onClose) onClose(); }}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="">
            <DialogTitle className="text-center">Welcome to PhotoLens</DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress Indicator */}
          <div className="flex justify-center space-x-2">
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                className={cn(
                  "w-3 h-3 rounded-full transition-colors",
                  step <= currentStep ? "bg-primary" : "bg-muted"
                )}
              />
            ))}
          </div>

          {/* Step Content */}
          {renderStep()}

          {/* Navigation */}
          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(prev => prev - 1)}
              disabled={currentStep === 1}
            >
              Previous
            </Button>
            
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="bg-primary hover:bg-primary/90"
            >
              {currentStep === 3 ? 'Get Started' : 'Next'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};