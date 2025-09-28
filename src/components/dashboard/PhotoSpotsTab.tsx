import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Search, Filter, MapPin, Star, Clock, Users, Camera, Calendar, Loader2, Heart } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'
import { usePhotoSpots, useBookPhotoSpot } from '@/hooks/use-photo-spots'
import { useAuth } from '@/hooks/use-auth'

interface OnboardingData {
  eventDate: Date | undefined
  location: string
  serviceTypes: string[]
}

interface PhotoSpotsTabProps {
  onboardingData: OnboardingData | null
}

const spotTypes = [
  'Urban',
  'Nature',
  'Beach',
  'Mountain',
  'Desert',
  'Forest',
  'Cityscape',
  'Industrial',
  'Historical',
  'Modern'
]

const difficultyLevels = [
  'Easy',
  'Moderate',
  'Challenging',
  'Expert'
]

export const PhotoSpotsTab: React.FC<PhotoSpotsTabProps> = ({ onboardingData }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [locationFilter, setLocationFilter] = useState('')
  const [spotTypeFilter, setSpotTypeFilter] = useState('')
  const [difficultyFilter, setDifficultyFilter] = useState('')
  const [priceFilter, setPriceFilter] = useState('')
  const [selectedSpot, setSelectedSpot] = useState<any>(null)
  const [showBookingDialog, setShowBookingDialog] = useState(false)
  const [bookingDate, setBookingDate] = useState('')
  const [duration, setDuration] = useState(2)
  const [specialRequests, setSpecialRequests] = useState('')

  const { user } = useAuth()
  const { toast } = useToast()

  // Use the photo spots hook with filters
  const { data: photoSpots, isLoading, error } = usePhotoSpots({
    location: locationFilter || undefined,
    spotType: spotTypeFilter || undefined,
    difficultyLevel: difficultyFilter || undefined,
    available: true,
  })

  const bookPhotoSpot = useBookPhotoSpot()

  const getFilteredSpots = () => {
    if (!photoSpots) return []

    let spots = photoSpots

    if (searchQuery) {
      spots = spots.filter(spot =>
        spot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        spot.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        spot.location.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (priceFilter) {
      spots = spots.filter(spot => {
        const price = parseFloat(spot.price.replace(/[^0-9.]/g, '')) || 0
        switch (priceFilter) {
          case 'under-50': return price < 50
          case '50-100': return price >= 50 && price < 100
          case '100-200': return price >= 100 && price < 200
          case 'over-200': return price >= 200
          default: return true
        }
      })
    }

    return spots
  }

  const handleBooking = async () => {
    if (!user?.id) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to book a photo spot',
        variant: 'destructive'
      })
      return
    }

    if (!bookingDate) {
      toast({
        title: 'Date Required',
        description: 'Please select a booking date',
        variant: 'destructive'
      })
      return
    }

    try {
      await bookPhotoSpot.mutateAsync({
        spotId: selectedSpot.id,
        customerId: user.id,
        bookingDate,
        duration,
        specialRequests
      })

      toast({
        title: 'Booking Successful',
        description: `Your photo spot has been booked for ${new Date(bookingDate).toLocaleDateString()}`
      })

      setShowBookingDialog(false)
      setSelectedSpot(null)
      setBookingDate('')
      setDuration(2)
      setSpecialRequests('')
    } catch (error) {
      toast({
        title: 'Booking Failed',
        description: error instanceof Error ? error.message : 'Failed to book photo spot',
        variant: 'destructive'
      })
    }
  }

  const renderSpotCard = (spot: any) => (
    <Card key={spot.id} className="group hover:shadow-lg transition-all duration-300">
      <div className="relative">
        <img
          src={spot.image_url || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4'}
          alt={spot.name}
          className="w-full h-48 object-cover rounded-t-lg"
        />
        <div className="absolute top-3 right-3">
          <Button
            variant="secondary"
            size="sm"
            className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => {
              e.stopPropagation()
              // Add to favorites logic
            }}
          >
            <Heart className="h-4 w-4" />
          </Button>
        </div>
        <div className="absolute top-3 left-3">
          <Badge variant="secondary" className="bg-white/90 text-black">
            {spot.spot_type || 'General'}
          </Badge>
        </div>
      </div>

      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-semibold text-lg">{spot.name}</h3>
            <div className="flex items-center text-sm text-muted-foreground mb-1">
              <MapPin className="h-3 w-3 mr-1" />
              {spot.location}
            </div>
          </div>
          <div className="text-right">
            <p className="font-bold text-primary">{spot.price}</p>
            <div className="flex items-center text-sm text-muted-foreground">
              <Star className="h-3 w-3 fill-current text-yellow-400 mr-1" />
              {spot.rating || 0}
            </div>
          </div>
        </div>

        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {spot.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-3">
          <Badge variant="outline" className="text-xs">
            <Users className="h-3 w-3 mr-1" />
            Max {spot.max_people || 'Unlimited'}
          </Badge>
          <Badge variant="outline" className="text-xs">
            <Clock className="h-3 w-3 mr-1" />
            {spot.best_time || 'Any time'}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {spot.difficulty_level || 'Easy'}
          </Badge>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-1">
            {spot.amenities?.slice(0, 2).map((amenity: string, index: number) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {amenity}
              </Badge>
            ))}
            {spot.amenities && spot.amenities.length > 2 && (
              <Badge variant="secondary" className="text-xs">
                +{spot.amenities.length - 2} more
              </Badge>
            )}
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button
                size="sm"
                onClick={() => setSelectedSpot(spot)}
              >
                View Details
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl">
              <DialogHeader>
                <DialogTitle>{spot.name}</DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                <img
                  src={spot.image_url || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4'}
                  alt={spot.name}
                  className="w-full h-64 object-cover rounded-lg"
                />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Details</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                        {spot.location}
                      </div>
                      <div className="flex items-center">
                        <Camera className="h-4 w-4 mr-2 text-muted-foreground" />
                        {spot.spot_type || 'General'}
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                        Max {spot.max_people || 'Unlimited'} people
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                        Best time: {spot.best_time || 'Any time'}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Amenities</h4>
                    <div className="flex flex-wrap gap-1">
                      {spot.amenities?.map((amenity: string, index: number) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {amenity}
                        </Badge>
                      )) || <p className="text-sm text-muted-foreground">No amenities listed</p>}
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Description</h4>
                  <p className="text-sm text-muted-foreground">{spot.description}</p>
                </div>

                <div className="flex justify-between items-center pt-4 border-t">
                  <div className="text-lg font-bold">{spot.price}/hour</div>
                  <Button
                    onClick={() => {
                      setShowBookingDialog(true)
                    }}
                    disabled={!spot.available}
                  >
                    {spot.available ? 'Book Now' : 'Not Available'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold">Photo Spots</h2>
        <p className="text-muted-foreground">
          Discover and book amazing locations for your photography sessions
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 p-4 bg-card rounded-lg border border-border">
        <div className="flex-1 min-w-64">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search photo spots..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Select value={locationFilter} onValueChange={setLocationFilter}>
          <SelectTrigger className="w-48">
            <MapPin className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Location" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="new-york">New York, NY</SelectItem>
            <SelectItem value="los-angeles">Los Angeles, CA</SelectItem>
            <SelectItem value="san-francisco">San Francisco, CA</SelectItem>
            <SelectItem value="miami">Miami, FL</SelectItem>
            <SelectItem value="seattle">Seattle, WA</SelectItem>
            <SelectItem value="chicago">Chicago, IL</SelectItem>
          </SelectContent>
        </Select>

        <Select value={spotTypeFilter} onValueChange={setSpotTypeFilter}>
          <SelectTrigger className="w-48">
            <Camera className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Spot Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Types</SelectItem>
            {spotTypes.map(type => (
              <SelectItem key={type} value={type}>{type}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Difficulty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Levels</SelectItem>
            {difficultyLevels.map(level => (
              <SelectItem key={level} value={level}>{level}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={priceFilter} onValueChange={setPriceFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Price Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Any Price</SelectItem>
            <SelectItem value="under-50">Under $50/hr</SelectItem>
            <SelectItem value="50-100">$50 - $100/hr</SelectItem>
            <SelectItem value="100-200">$100 - $200/hr</SelectItem>
            <SelectItem value="over-200">Over $200/hr</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline" onClick={() => {
          setSearchQuery('')
          setLocationFilter('')
          setSpotTypeFilter('')
          setDifficultyFilter('')
          setPriceFilter('')
        }}>
          <Filter className="h-4 w-4 mr-2" />
          Clear Filters
        </Button>
      </div>

      {/* Photo Spots Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading photo spots...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {getFilteredSpots().map(renderSpotCard)}
        </div>
      )}

      {/* No Results */}
      {getFilteredSpots().length === 0 && !isLoading && (
        <Card>
          <CardContent className="py-12 text-center">
            <Camera className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No photo spots found. Try adjusting your filters.</p>
          </CardContent>
        </Card>
      )}

      {/* Booking Dialog */}
      <Dialog open={showBookingDialog} onOpenChange={setShowBookingDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Book Photo Spot</DialogTitle>
          </DialogHeader>

          {selectedSpot && (
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold">{selectedSpot.name}</h4>
                <p className="text-sm text-muted-foreground">{selectedSpot.location}</p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium">Booking Date</label>
                  <Input
                    type="date"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Duration (hours)</label>
                  <Select value={duration.toString()} onValueChange={(value) => setDuration(parseInt(value))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 hour</SelectItem>
                      <SelectItem value="2">2 hours</SelectItem>
                      <SelectItem value="4">4 hours</SelectItem>
                      <SelectItem value="8">Full day (8 hours)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium">Special Requests (Optional)</label>
                  <textarea
                    className="w-full p-2 border rounded-md text-sm"
                    rows={3}
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    placeholder="Any special requirements or requests..."
                  />
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t">
                <div className="text-lg font-semibold">
                  Total: ${calculateTotal(duration)}
                </div>
                <div className="space-x-2">
                  <Button variant="outline" onClick={() => setShowBookingDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleBooking} disabled={bookPhotoSpot.isPending}>
                    {bookPhotoSpot.isPending ? 'Booking...' : 'Confirm Booking'}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Helper function to calculate total price
const calculateTotal = (hours: number): number => {
  const hourlyRate = 75 // Default rate
  return hourlyRate * hours
}