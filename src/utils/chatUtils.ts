import type { GalleryPhoto, Invoice } from '../types/chat.types';

/**
 * Get status information for gallery photos
 */
export const getStatusInfo = (status?: string) => {
  switch (status) {
    case 'editors_choice':
      return {
        label: "Editor's Choice",
        className: 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white'
      };
    case 'approved':
      return {
        label: 'Approved',
        className: 'bg-green-100 text-green-800 border-green-200'
      };
    case 'not_approved':
      return {
        label: 'Review',
        className: 'bg-orange-100 text-orange-800 border-orange-200'
      };
    default:
      return {
        label: 'Approved',
        className: 'bg-green-100 text-green-800 border-green-200'
      };
  }
};

/**
 * Sort gallery photos by status priority and upload date
 */
export const sortPhotosByStatus = (photos: GalleryPhoto[]): GalleryPhoto[] => {
  return [...photos].sort((a, b) => {
    const statusPriority = { editors_choice: 3, approved: 2, not_approved: 1 };
    const aPriority = statusPriority[a.status || 'approved'];
    const bPriority = statusPriority[b.status || 'approved'];
    
    if (aPriority !== bPriority) {
      return bPriority - aPriority;
    }
    return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime();
  });
};

/**
 * Get CSS classes for invoice status
 */
export const getInvoiceStatusClasses = (status: Invoice['status']) => {
  const statusColors = {
    paid: 'text-green-700 bg-green-100 border-green-200',
    pending: 'text-amber-700 bg-amber-100 border-amber-200',
    overdue: 'text-red-700 bg-red-100 border-red-200'
  };
  return statusColors[status];
};

/**
 * Get invoice status display text
 */
export const getInvoiceStatusText = (status: Invoice['status']) => {
  switch (status) {
    case 'paid': return '✓ Paid';
    case 'pending': return '⏳ Pending';
    case 'overdue': return '⚠️ Overdue';
    default: return status;
  }
};

/**
 * Generate fallback avatar URL
 */
export const getFallbackAvatarUrl = (name: string, size: number = 40) => {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=${size}&background=6366f1&color=ffffff`;
};

/**
 * Get message status icon
 */
export const getMessageStatusIcon = (status: 'sent' | 'delivered' | 'read') => {
  switch (status) {
    case 'read': return '✓✓';
    case 'delivered': return '✓✓';
    case 'sent': return '✓';
    default: return '✓';
  }
};

/**
 * Get message status color classes
 */
export const getMessageStatusColor = (status: 'sent' | 'delivered' | 'read') => {
  switch (status) {
    case 'read': return 'text-blue-200';
    case 'delivered': return 'text-blue-300';
    case 'sent': return 'text-blue-400';
    default: return 'text-blue-400';
  }
};