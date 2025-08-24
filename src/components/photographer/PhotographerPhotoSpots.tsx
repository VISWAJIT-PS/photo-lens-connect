import React from 'react';
import { RentalsTab } from '@/components/dashboard/RentalsTab';

export function PhotographerPhotoSpots() {
  return (
    <div className="h-full">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Photo Spot Rental Management</h1>
        <p className="text-muted-foreground mb-6">
          Manage your photo spot rentals and event spaces available for booking.
        </p>
        <RentalsTab onboardingData={null} />
      </div>
    </div>
  );
}