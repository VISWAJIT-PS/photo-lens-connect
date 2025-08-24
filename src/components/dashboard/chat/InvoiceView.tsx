import React from 'react';
import { Lock, Receipt, CheckCircle } from 'lucide-react';
import { Button } from '../../ui/button';
import type { Invoice } from '../../../types/chat.types';
import { getInvoiceStatusClasses, getInvoiceStatusText } from '../../../utils/chatUtils';

interface InvoiceViewProps {
  invoice?: Invoice;
}

const InvoiceView: React.FC<InvoiceViewProps> = ({ invoice }) => {
  if (!invoice) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="text-center p-8">
          <div className="mb-4 w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto">
            <Lock className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Invoice Not Available</h3>
          <p className="text-gray-500">Invoice will be generated after booking confirmation</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-4 bg-gray-50 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900">Invoice #{invoice.id}</h3>
            <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getInvoiceStatusClasses(invoice.status)}`}>
              {getInvoiceStatusText(invoice.status)}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500 mb-1">Issue Date</p>
              <p className="font-semibold">{invoice.issueDate}</p>
            </div>
            <div>
              <p className="text-gray-500 mb-1">Due Date</p>
              <p className="font-semibold">{invoice.dueDate}</p>
            </div>
            <div>
              <p className="text-gray-500 mb-1">Booking ID</p>
              <p className="font-mono font-semibold">{invoice.bookingId}</p>
            </div>
            <div>
              <p className="text-gray-500 mb-1">Total Amount</p>
              <p className="font-bold text-xl text-blue-600">${invoice.amount.toLocaleString()}</p>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <h4 className="font-semibold text-gray-900 mb-3">Services Included</h4>
          <div className="space-y-2">
            {invoice.services.map((service, index) => (
              <div key={index} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
                <span className="text-gray-700 font-medium">{service}</span>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </div>
            ))}
          </div>
        </div>

        {invoice.status === 'pending' && (
          <div className="p-6 bg-gray-50 border-t border-gray-200 rounded-b-xl">
            <Button variant="ghost" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2">
              <Receipt className="h-4 w-4" />
              Pay Now - ${invoice.amount.toLocaleString()}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvoiceView;