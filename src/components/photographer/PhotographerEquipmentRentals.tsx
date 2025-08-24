import React from 'react';
import { RentalsTab } from '@/components/dashboard/RentalsTab';

export function PhotographerEquipmentRentals() {
  return (
    <div className="h-full">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Equipment Rental Management</h1>
        <RentalsTab onboardingData={null} />
      </div>
    </div>
  );
}