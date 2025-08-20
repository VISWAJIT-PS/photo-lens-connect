import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { 
  User, 
  Package, 
  Shield, 
  Settings, 
  Eye, 
  EyeOff, 
  CreditCard, 
  MapPin, 
  Phone, 
  Mail,
  Edit3,
  Trash2,
  Plus,
  Star,
  Calendar,
  DollarSign,
  Lock,
  Smartphone,
  Key
} from 'lucide-react';
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogHeader, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/components/ui/sonner';

// Mock data
const mockOrders = [
  {
    id: 'ORD-2024-101',
    date: '2024-08-15',
    status: 'Completed',
    total: 2499.00,
    items: [
      { name: 'Wedding Photography Package', price: 1800.00, quantity: 1, image: 'https://picsum.photos/200' },
      { name: 'Engagement Session (2 hrs)', price: 250.00, quantity: 1, image: 'https://picsum.photos/200' },
      { name: 'Premium Print Package', price: 150.00, quantity: 1, image: 'https://picsum.photos/200' },
      { name: 'Travel Fee', price: 299.00, quantity: 1, image: 'https://picsum.photos/200' }
    ]
  },
  {
    id: 'ORD-2024-102',
    date: '2024-08-10',
    status: 'Accepted',
    total: 1700.00,
    items: [
      { name: 'Event Videography Package (Full Day)', price: 1200.00, quantity: 1, image: 'https://picsum.photos/200' },
      { name: 'Drone Coverage Add-on', price: 350.00, quantity: 1, image: 'https://picsum.photos/200' },
      { name: 'Rush Editing (48h)', price: 150.00, quantity: 1, image: 'https://picsum.photos/200' }
    ]
  },
  {
    id: 'ORD-2024-103',
    date: '2024-07-28',
    status: 'Waiting',
    total: 470.00,
    items: [
      { name: 'Camera Rental - Canon EOS R5 (3 days)', price: 300.00, quantity: 1, image: 'https://picsum.photos/200' },
      { name: 'Lens Rental - RF 24-70mm (3 days)', price: 120.00, quantity: 1, image: 'https://picsum.photos/200' },
      { name: 'Rental Insurance', price: 50.00, quantity: 1, image: 'https://picsum.photos/200' }
    ]
  }
];

const initialAddresses = [
  {
    id: 1,
    type: 'Home',
    name: 'John Doe',
    street: '123 Main Street',
    city: 'New York',
    state: 'NY',
    zip: '10001',
    country: 'USA',
    isDefault: true
  }
];

const initialPaymentMethods = [
  {
    id: 1,
    type: 'Visa',
    last4: '4242',
    expiryMonth: '12',
    expiryYear: '26',
    isDefault: true
  },
  {
    id: 2,
    type: 'Mastercard',
    last4: '8888',
    expiryMonth: '09',
    expiryYear: '25',
    isDefault: false
  }
];

export default function EcommerceUserSettings() {
  const [activeTab, setActiveTab] = useState('account');
  const [showPassword, setShowPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  
  // Form states
  const [profile, setProfile] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    birthDate: '1990-05-15',
    gender: 'male'
  });

  // Make addresses and payment methods stateful so we can add/edit/delete
  const [addresses, setAddresses] = useState(initialAddresses);
  const [paymentMethods, setPaymentMethods] = useState(initialPaymentMethods);

  // Dialog control state
  const [editingAddress, setEditingAddress] = useState(null);
  const [editingCard, setEditingCard] = useState(null);
  const [showAddAddressDialog, setShowAddAddressDialog] = useState(false);
  const [showAddCardDialog, setShowAddCardDialog] = useState(false);

  const [security, setSecurity] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'text-green-600 bg-green-100';
      case 'Accepted': return 'text-blue-600 bg-blue-100';
      case 'Waiting': return 'text-yellow-600 bg-yellow-100';
      case 'Cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const handleProfileSave = () => {
    alert('Profile updated successfully!');
  };

  const handlePasswordChange = () => {
    if (security.newPassword !== security.confirmPassword) {
      alert('New passwords do not match!');
      return;
    }
    alert('Password changed successfully!');
    setSecurity({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const renderOrderHistory = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Order History</h2>
        <div className="flex space-x-2">
          <select aria-label="Order timeframe" className="px-3 py-2 border border-gray-300 rounded-md text-sm">
            <option>Last 6 months</option>
            <option>Last year</option>
            <option>All orders</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
  {mockOrders.map((order) => (
          <div key={order.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-semibold text-lg">Order {order.id}</h3>
                <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                  <span className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {new Date(order.date).toLocaleDateString()}
                  </span>
                  <span className="flex items-center">
                    <DollarSign className="w-4 h-4 mr-1" />
                    ${order.total}
                  </span>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                {order.status}
              </span>
            </div>

            <div className="space-y-3">
              {order.items.map((item, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-12 h-12 object-cover rounded-md bg-gray-100"
                  />
                  <div className="flex-1">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                  </div>
                  <p className="font-semibold">${item.price}</p>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
              {/* Review dialog trigger */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">Review</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Review Order {order.id}</DialogTitle>
                    <DialogDescription>Leave a rating and a short review for this order.</DialogDescription>
                  </DialogHeader>

                  <div className="mt-4 space-y-3">
                    {(() => {
                      function StarRating({ orderId }: { orderId: string }) {
                      const [rating, setRating] = useState<number>(0);
                      const [hover, setHover] = useState<number>(0);

                      return (
                        <div className="flex items-center space-x-3">
                        <div className="flex items-center">
                          {[1, 2, 3, 4, 5].map((n) => {
                          const filled = hover ? n <= hover : n <= rating;
                          return (
                            <button
                            key={n}
                            type="button"
                            aria-label={`${n} star${n > 1 ? 's' : ''}`}
                            onClick={() => setRating(n)}
                            onMouseEnter={() => setHover(n)}
                            onMouseLeave={() => setHover(0)}
                            className={`text-2xl transition-transform focus:outline-none ${
                              filled ? 'text-yellow-400' : 'text-gray-300'
                            } hover:scale-110`}
                            >
                            {filled ? '★' : '☆'}
                            </button>
                          );
                          })}
                        </div>
                        <span className="text-sm text-gray-600">
                          {rating ? `${rating} ${rating === 1 ? 'star' : 'stars'}` : 'No rating'}
                        </span>
                        </div>
                      );
                      }

                      return <StarRating key={`rating-${order.id}`} orderId={order.id} />;
                    })()}
                    <div>
                      <label className="block text-sm font-medium mb-1">Your review</label>
                      <textarea className="w-full border px-3 py-2 rounded-md" rows={4} placeholder="Share your experience..." />
                    </div>
                  </div>

                  <DialogFooter className="mt-4">
                    <Button onClick={() => toast('Thank you for your review!', { description: `Review for ${order.id} submitted.` })}>Submit Review</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <div className="flex space-x-2">
                {/* View details dialog trigger */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">View Details</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Order Details — {order.id}</DialogTitle>
                      <DialogDescription>Full order summary and shipping information.</DialogDescription>
                    </DialogHeader>

                    <div className="mt-4 space-y-4">
                      <div>
                        <h4 className="font-medium">Items</h4>
                        <div className="space-y-2 mt-2">
                          {order.items.map((it, i) => (
                            <div key={i} className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <img src={it.image} alt={it.name} className="w-12 h-12 object-cover rounded" />
                                <div>
                                  <div className="font-medium">{it.name}</div>
                                  <div className="text-sm text-gray-600">Qty {it.quantity}</div>
                                </div>
                              </div>
                              <div className="font-semibold">${it.price}</div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium">Shipping</h4>
                        <div className="text-sm text-gray-600 mt-1">123 Main Street, New York, NY 10001</div>
                        <div className="text-sm text-gray-600">Delivery expected: 3–5 business days</div>
                      </div>

                      <div>
                        <h4 className="font-medium">Total</h4>
                        <div className="text-lg font-semibold">${order.total}</div>
                      </div>
                    </div>

                    <DialogFooter className="mt-4">
                      <Button variant="outline" onClick={() => toast('Order details copied to clipboard', { description: `${order.id} summary copied.` })}>Copy Summary</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                {/* Reorder action triggers a toast */}
                <Button variant="outline" size="sm" onClick={() => toast.success(`Reorder placed for ${order.id}`)}>
                  Reorder
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAccount = () => (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Account Settings</h2>
      </div>

      {/* Profile Information */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-6 flex items-center">
          <User className="w-5 h-5 mr-2" />
          Profile Information
        </h3>
        
        <div className="flex items-start space-x-6 mb-6">
          <Avatar className="w-20 h-20">
            <AvatarImage src="/api/placeholder/80/80" alt="Profile" />
            <AvatarFallback className="text-lg">JD</AvatarFallback>
          </Avatar>
          <div>
            <Button variant="outline" size="sm" className="mb-2">
              Change Photo
            </Button>
            <p className="text-sm text-gray-500">JPG, GIF or PNG. 1MB max.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
            <Input
              value={profile.firstName}
              onChange={(e) => setProfile({...profile, firstName: e.target.value})}
              placeholder="Enter first name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
            <Input
              value={profile.lastName}
              onChange={(e) => setProfile({...profile, lastName: e.target.value})}
              placeholder="Enter last name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <Input
              type="email"
              value={profile.email}
              onChange={(e) => setProfile({...profile, email: e.target.value})}
              placeholder="Enter email"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
            <Input
              value={profile.phone}
              onChange={(e) => setProfile({...profile, phone: e.target.value})}
              placeholder="Enter phone number"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
            <Input
              type="date"
              value={profile.birthDate}
              onChange={(e) => setProfile({...profile, birthDate: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
            <select 
              aria-label="Gender"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={profile.gender}
              onChange={(e) => setProfile({...profile, gender: e.target.value})}
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="prefer-not-to-say">Prefer not to say</option>
            </select>
          </div>
        </div>

        <div className="mt-6">
          <Button onClick={handleProfileSave}>Save Changes</Button>
        </div>
      </div>

      {/* Addresses */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold flex items-center">
            <MapPin className="w-5 h-5 mr-2" />
            Shipping Addresses
          </h3>
          <Button variant="outline" size="sm" onClick={() => setShowAddAddressDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Address
          </Button>
        </div>

        <div className="space-y-4">
          {addresses.map((address) => (
            <div key={address.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h4 className="font-medium">{address.type}</h4>
                    {address.isDefault && (
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Default</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{address.name}</p>
                  <p className="text-sm text-gray-600">{address.street}</p>
                  <p className="text-sm text-gray-600">
                    {address.city}, {address.state} {address.zip}
                  </p>
                  <p className="text-sm text-gray-600">{address.country}</p>
                </div>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="sm" onClick={() => setEditingAddress(address)}>
                    <Edit3 className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-red-600" onClick={() => setEditingAddress({ ...address, _delete: true })}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Methods */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold flex items-center">
            <CreditCard className="w-5 h-5 mr-2" />
            Payment Methods
          </h3>
          <Button variant="outline" size="sm" onClick={() => setShowAddCardDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Card
          </Button>
        </div>

        <div className="space-y-4">
          {paymentMethods.map((method) => (
            <div key={method.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <CreditCard className="w-6 h-6 text-gray-400" />
                  <div>
                    <div className="flex items-center space-x-2">
                      <p className="font-medium">{method.type} •••• {method.last4}</p>
                      {method.isDefault && (
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Default</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">Expires {method.expiryMonth}/{method.expiryYear}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="sm" onClick={() => setEditingCard(method)}>
                    <Edit3 className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-red-600" onClick={() => setEditingCard({ ...method, _delete: true })}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add/Edit Address Dialog */}
      <Dialog open={showAddAddressDialog} onOpenChange={setShowAddAddressDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Address</DialogTitle>
            <DialogDescription>Enter a new shipping address.</DialogDescription>
          </DialogHeader>
          <div className="mt-4 space-y-3">
            <input className="w-full border px-3 py-2 rounded" placeholder="Label (Home, Work)" id="addr-type" />
            <input className="w-full border px-3 py-2 rounded" placeholder="Full name" id="addr-name" />
            <input className="w-full border px-3 py-2 rounded" placeholder="Street address" id="addr-street" />
            <div className="grid grid-cols-2 gap-2">
              <input className="w-full border px-3 py-2 rounded" placeholder="City" id="addr-city" />
              <input className="w-full border px-3 py-2 rounded" placeholder="State" id="addr-state" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input className="w-full border px-3 py-2 rounded" placeholder="ZIP" id="addr-zip" />
              <input className="w-full border px-3 py-2 rounded" placeholder="Country" id="addr-country" />
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button onClick={() => {
              // Read inputs and add to state (simple mock behavior)
              const type = (document.getElementById('addr-type') as HTMLInputElement).value || 'Home';
              const name = (document.getElementById('addr-name') as HTMLInputElement).value || profile.firstName + ' ' + profile.lastName;
              const street = (document.getElementById('addr-street') as HTMLInputElement).value || '';
              const city = (document.getElementById('addr-city') as HTMLInputElement).value || '';
              const state = (document.getElementById('addr-state') as HTMLInputElement).value || '';
              const zip = (document.getElementById('addr-zip') as HTMLInputElement).value || '';
              const country = (document.getElementById('addr-country') as HTMLInputElement).value || '';
              const newAddr = { id: Date.now(), type, name, street, city, state, zip, country, isDefault: false };
              setAddresses(prev => [newAddr, ...prev]);
              setShowAddAddressDialog(false);
              toast.success('Address added');
            }}>Add Address</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit/Delete Address Dialog (reused) */}
      <Dialog open={!!editingAddress} onOpenChange={() => setEditingAddress(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingAddress && editingAddress._delete ? 'Delete Address' : 'Edit Address'}</DialogTitle>
            <DialogDescription>{editingAddress && editingAddress._delete ? 'Confirm address deletion.' : 'Edit the shipping address.'}</DialogDescription>
          </DialogHeader>
          {editingAddress && editingAddress._delete ? (
            <div className="mt-4">
              <p>Are you sure you want to delete <strong>{editingAddress.type}</strong>?</p>
              <div className="mt-4">
                <Button variant="destructive" onClick={() => {
                  setAddresses(prev => prev.filter(a => a.id !== editingAddress.id));
                  setEditingAddress(null);
                  toast.success('Address deleted');
                }}>Delete</Button>
              </div>
            </div>
          ) : editingAddress ? (
            <div className="mt-4 space-y-3">
              <input defaultValue={editingAddress.type} placeholder="Label (Home, Work)" aria-label="address label" className="w-full border px-3 py-2 rounded" id="edit-addr-type" />
              <input defaultValue={editingAddress.name} placeholder="Full name" aria-label="address full name" className="w-full border px-3 py-2 rounded" id="edit-addr-name" />
              <input defaultValue={editingAddress.street} placeholder="Street address" aria-label="address street" className="w-full border px-3 py-2 rounded" id="edit-addr-street" />
              <div className="grid grid-cols-2 gap-2">
                <input defaultValue={editingAddress.city} placeholder="City" aria-label="address city" className="w-full border px-3 py-2 rounded" id="edit-addr-city" />
                <input defaultValue={editingAddress.state} placeholder="State" aria-label="address state" className="w-full border px-3 py-2 rounded" id="edit-addr-state" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input defaultValue={editingAddress.zip} placeholder="ZIP" aria-label="address zip" className="w-full border px-3 py-2 rounded" id="edit-addr-zip" />
                <input defaultValue={editingAddress.country} placeholder="Country" aria-label="address country" className="w-full border px-3 py-2 rounded" id="edit-addr-country" />
              </div>
              <div className="mt-2">
                <Button onClick={() => {
                  const type = (document.getElementById('edit-addr-type') as HTMLInputElement).value || editingAddress.type;
                  const name = (document.getElementById('edit-addr-name') as HTMLInputElement).value || editingAddress.name;
                  const street = (document.getElementById('edit-addr-street') as HTMLInputElement).value || editingAddress.street;
                  const city = (document.getElementById('edit-addr-city') as HTMLInputElement).value || editingAddress.city;
                  const state = (document.getElementById('edit-addr-state') as HTMLInputElement).value || editingAddress.state;
                  const zip = (document.getElementById('edit-addr-zip') as HTMLInputElement).value || editingAddress.zip;
                  const country = (document.getElementById('edit-addr-country') as HTMLInputElement).value || editingAddress.country;
                  setAddresses(prev => prev.map(a => a.id === editingAddress.id ? { ...a, type, name, street, city, state, zip, country } : a));
                  setEditingAddress(null);
                  toast.success('Address updated');
                }}>Save</Button>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>

      {/* Add/Edit Card Dialogs */}
      <Dialog open={showAddCardDialog} onOpenChange={setShowAddCardDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Card</DialogTitle>
            <DialogDescription>Enter card details (mock).</DialogDescription>
          </DialogHeader>
          <div className="mt-4 space-y-3">
            <input className="w-full border px-3 py-2 rounded" placeholder="Card type (Visa, Mastercard)" id="card-type" />
            <input className="w-full border px-3 py-2 rounded" placeholder="Last 4 digits" id="card-last4" />
            <div className="grid grid-cols-2 gap-2">
              <input className="w-full border px-3 py-2 rounded" placeholder="Expiry month" id="card-month" />
              <input className="w-full border px-3 py-2 rounded" placeholder="Expiry year" id="card-year" />
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button onClick={() => {
              const type = (document.getElementById('card-type') as HTMLInputElement).value || 'Card';
              const last4 = (document.getElementById('card-last4') as HTMLInputElement).value || '0000';
              const month = (document.getElementById('card-month') as HTMLInputElement).value || '01';
              const year = (document.getElementById('card-year') as HTMLInputElement).value || '30';
              const newCard = { id: Date.now(), type, last4, expiryMonth: month, expiryYear: year, isDefault: false };
              setPaymentMethods(prev => [newCard, ...prev]);
              setShowAddCardDialog(false);
              toast.success('Card added');
            }}>Add Card</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit/Delete Card Dialog */}
      <Dialog open={!!editingCard} onOpenChange={() => setEditingCard(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingCard && editingCard._delete ? 'Delete Card' : 'Edit Card'}</DialogTitle>
            <DialogDescription>{editingCard && editingCard._delete ? 'Confirm card deletion.' : 'Edit card details.'}</DialogDescription>
          </DialogHeader>
          {editingCard && editingCard._delete ? (
            <div className="mt-4">
              <p>Are you sure you want to delete <strong>{editingCard.type} •••• {editingCard.last4}</strong>?</p>
              <div className="mt-4">
                <Button variant="destructive" onClick={() => {
                  setPaymentMethods(prev => prev.filter(c => c.id !== editingCard.id));
                  setEditingCard(null);
                  toast.success('Card deleted');
                }}>Delete</Button>
              </div>
            </div>
          ) : editingCard ? (
            <div className="mt-4 space-y-3">
              <input defaultValue={editingCard.type} placeholder="Card type" aria-label="card type" className="w-full border px-3 py-2 rounded" id="edit-card-type" />
              <input defaultValue={editingCard.last4} placeholder="Last 4 digits" aria-label="card last4" className="w-full border px-3 py-2 rounded" id="edit-card-last4" />
              <div className="grid grid-cols-2 gap-2">
                <input defaultValue={editingCard.expiryMonth} placeholder="Expiry month" aria-label="card expiry month" className="w-full border px-3 py-2 rounded" id="edit-card-month" />
                <input defaultValue={editingCard.expiryYear} placeholder="Expiry year" aria-label="card expiry year" className="w-full border px-3 py-2 rounded" id="edit-card-year" />
              </div>
              <div className="mt-2">
                <Button onClick={() => {
                  const type = (document.getElementById('edit-card-type') as HTMLInputElement).value || editingCard.type;
                  const last4 = (document.getElementById('edit-card-last4') as HTMLInputElement).value || editingCard.last4;
                  const month = (document.getElementById('edit-card-month') as HTMLInputElement).value || editingCard.expiryMonth;
                  const year = (document.getElementById('edit-card-year') as HTMLInputElement).value || editingCard.expiryYear;
                  setPaymentMethods(prev => prev.map(c => c.id === editingCard.id ? { ...c, type, last4, expiryMonth: month, expiryYear: year } : c));
                  setEditingCard(null);
                  toast.success('Card updated');
                }}>Save</Button>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );

  const renderSecurity = () => (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Security Settings</h2>
      </div>

      {/* Password Change */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-6 flex items-center">
          <Lock className="w-5 h-5 mr-2" />
          Change Password
        </h3>

        <div className="space-y-4 max-w-md">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
            <div className="relative">
              <Input
                type={showCurrentPassword ? "text" : "password"}
                value={security.currentPassword}
                onChange={(e) => setSecurity({...security, currentPassword: e.target.value})}
                placeholder="Enter current password"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              >
                {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
            <div className="relative">
              <Input
                type={showNewPassword ? "text" : "password"}
                value={security.newPassword}
                onChange={(e) => setSecurity({...security, newPassword: e.target.value})}
                placeholder="Enter new password"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
            <Input
              type="password"
              value={security.confirmPassword}
              onChange={(e) => setSecurity({...security, confirmPassword: e.target.value})}
              placeholder="Confirm new password"
            />
          </div>

          <div className="pt-2">
            <Button onClick={handlePasswordChange}>Update Password</Button>
          </div>
        </div>
      </div>

      {/* Two-Factor Authentication */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-6 flex items-center">
          <Smartphone className="w-5 h-5 mr-2" />
          Two-Factor Authentication
        </h3>

        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div className="flex items-center space-x-3">
            <Shield className="w-6 h-6 text-green-600" />
            <div>
              <p className="font-medium">SMS Authentication</p>
              <p className="text-sm text-gray-600">
                {twoFactorEnabled ? 'Enabled on +1 (555) 123-4567' : 'Add an extra layer of security to your account'}
              </p>
            </div>
          </div>
          <Button
            variant={twoFactorEnabled ? "destructive" : "default"}
            size="sm"
            onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
          >
            {twoFactorEnabled ? 'Disable' : 'Enable'}
          </Button>
        </div>

        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start space-x-2">
            <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-900">Security Recommendation</p>
              <p className="text-sm text-blue-700 mt-1">
                Enable two-factor authentication to significantly improve your account security.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Login Sessions */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-6 flex items-center">
          <Key className="w-5 h-5 mr-2" />
          Active Sessions
        </h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Smartphone className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium">Current Session</p>
                <p className="text-sm text-gray-600">Chrome on Windows • New York, NY</p>
                <p className="text-xs text-gray-500">Active now</p>
              </div>
            </div>
            <span className="text-green-600 text-sm font-medium">Current</span>
          </div>

          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <Smartphone className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <p className="font-medium">iPhone 14 Pro</p>
                <p className="text-sm text-gray-600">Safari • New York, NY</p>
                <p className="text-xs text-gray-500">2 hours ago</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="text-red-600">
              End Session
            </Button>
          </div>
        </div>

        <div className="mt-6">
          <Button variant="outline" className="text-red-600 border-red-600 hover:bg-red-50">
            End All Other Sessions
          </Button>
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: 'orders', label: 'Order History', icon: Package, component: renderOrderHistory },
    { id: 'account', label: 'Account', icon: User, component: renderAccount },
    { id: 'security', label: 'Security', icon: Shield, component: renderSecurity },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-6">
                <Avatar className="w-12 h-12">
                  <AvatarImage src="/api/placeholder/48/48" alt="Profile" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">John Doe</p>
                  <p className="text-sm text-gray-600">john.doe@example.com</p>
                </div>
              </div>

              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-100 text-blue-700 font-medium'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              {tabs.find(tab => tab.id === activeTab)?.component()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
