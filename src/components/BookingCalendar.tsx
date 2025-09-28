import { useState } from 'react'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Users,
  DollarSign,
  Plus,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { format, isSameDay, startOfWeek, endOfWeek, eachDayOfInterval, addWeeks, subWeeks } from 'date-fns'
import { useBookingsCalendar, useBookings, Booking } from '@/hooks/use-booking-management'
import { useAuth } from '@/hooks/use-auth'

interface BookingCalendarProps {
  onCreateBooking?: () => void
  onBookingClick?: (booking: Booking) => void
}

export const BookingCalendar: React.FC<BookingCalendarProps> = ({
  onCreateBooking,
  onBookingClick
}) => {
  const { user } = useAuth()
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [currentWeek, setCurrentWeek] = useState<Date>(new Date())
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month')

  // Get bookings for the current view
  const startDate = viewMode === 'month'
    ? new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1)
    : startOfWeek(currentWeek)
  const endDate = viewMode === 'month'
    ? new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0)
    : endOfWeek(currentWeek)

  const { data: calendarBookings = [] } = useBookingsCalendar(startDate, endDate)
  const { data: allBookings = [] } = useBookings()

  // Filter bookings for selected date
  const selectedDateBookings = calendarBookings.filter(booking =>
    isSameDay(new Date(booking.event_date), selectedDate)
  )

  // Get bookings for the week view
  const weekStart = startOfWeek(currentWeek)
  const weekEnd = endOfWeek(currentWeek)
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd })
  const weekBookings = calendarBookings.filter(booking => {
    const bookingDate = new Date(booking.event_date)
    return bookingDate >= weekStart && bookingDate <= weekEnd
  })

  const getBookingsForDate = (date: Date) => {
    return calendarBookings.filter(booking =>
      isSameDay(new Date(booking.event_date), date)
    )
  }

  const getStatusColor = (status: Booking['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'confirmed': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'in_progress': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'completed': return 'bg-green-100 text-green-800 border-green-200'
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const navigateWeek = (direction: 'prev' | 'next') => {
    setCurrentWeek(prev => direction === 'next' ? addWeeks(prev, 1) : subWeeks(prev, 1))
  }

  const BookingCard: React.FC<{ booking: Booking }> = ({ booking }) => (
    <Card
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => onBookingClick?.(booking)}
    >
      <CardContent className="p-3">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h4 className="font-medium text-sm truncate">{booking.event_type}</h4>
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              <Clock className="h-3 w-3 mr-1" />
              {booking.event_time && format(new Date(`2000-01-01T${booking.event_time}`), 'HH:mm')}
              {booking.duration_hours && ` (${booking.duration_hours}h)`}
            </div>
          </div>
          <Badge className={`text-xs ${getStatusColor(booking.status)}`}>
            {booking.status}
          </Badge>
        </div>

        <div className="space-y-1">
          <div className="flex items-center text-xs text-muted-foreground">
            <MapPin className="h-3 w-3 mr-1" />
            <span className="truncate">{booking.location}</span>
          </div>

          <div className="flex items-center text-xs text-muted-foreground">
            <Users className="h-3 w-3 mr-1" />
            {booking.customer?.name || booking.photographer?.name}
          </div>

          {booking.total_amount && (
            <div className="flex items-center text-xs text-muted-foreground">
              <DollarSign className="h-3 w-3 mr-1" />
              {booking.total_amount} {booking.currency}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )

  const WeekView = () => (
    <div className="space-y-4">
      {/* Week Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigateWeek('prev')}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div className="text-lg font-semibold">
          {format(weekStart, 'MMM d')} - {format(weekEnd, 'MMM d, yyyy')}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => navigateWeek('next')}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Week Grid */}
      <div className="grid grid-cols-7 gap-2">
        {weekDays.map(day => {
          const dayBookings = getBookingsForDate(day)
          return (
            <div key={day.toISOString()} className="min-h-[120px]">
              <div className="text-center text-sm font-medium mb-2 p-2 rounded bg-muted/50">
                <div>{format(day, 'EEE')}</div>
                <div className="text-lg">{format(day, 'd')}</div>
              </div>
              <div className="space-y-1">
                {dayBookings.slice(0, 3).map(booking => (
                  <BookingCard key={booking.id} booking={booking} />
                ))}
                {dayBookings.length > 3 && (
                  <div className="text-xs text-center text-muted-foreground p-1">
                    +{dayBookings.length - 3} more
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )

  const DayView = () => (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-xl font-semibold">
          {format(selectedDate, 'EEEE, MMMM d, yyyy')}
        </h3>
      </div>

      <div className="grid gap-4">
        {selectedDateBookings.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              <CalendarIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No bookings scheduled for this date</p>
            </CardContent>
          </Card>
        ) : (
          selectedDateBookings.map(booking => (
            <BookingCard key={booking.id} booking={booking} />
          ))
        )}
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Booking Calendar</h2>
          <p className="text-muted-foreground">
            Manage your photography bookings and schedule
          </p>
        </div>
        <Button onClick={onCreateBooking}>
          <Plus className="h-4 w-4 mr-2" />
          New Booking
        </Button>
      </div>

      {/* View Toggle */}
      <div className="flex items-center space-x-2">
        <Button
          variant={viewMode === 'month' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setViewMode('month')}
        >
          Month
        </Button>
        <Button
          variant={viewMode === 'week' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setViewMode('week')}
        >
          Week
        </Button>
        <Button
          variant={viewMode === 'day' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setViewMode('day')}
        >
          Day
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CalendarIcon className="h-5 w-5 mr-2" />
                {viewMode === 'month' && format(selectedDate, 'MMMM yyyy')}
                {viewMode === 'week' && `Week of ${format(currentWeek, 'MMM d, yyyy')}`}
                {viewMode === 'day' && format(selectedDate, 'EEEE, MMM d, yyyy')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {viewMode === 'month' && (
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  className="rounded-md border"
                  modifiers={{
                    hasBookings: calendarBookings.map(b => new Date(b.event_date))
                  }}
                  modifiersStyles={{
                    hasBookings: {
                      fontWeight: 'bold',
                      backgroundColor: 'rgb(59 130 246 / 0.1)'
                    }
                  }}
                />
              )}

              {viewMode === 'week' && <WeekView />}
              {viewMode === 'day' && <DayView />}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Selected Date Bookings */}
          {viewMode !== 'day' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  {format(selectedDate, 'EEEE, MMM d')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[200px]">
                  {selectedDateBookings.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No bookings on this date
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {selectedDateBookings.map(booking => (
                        <BookingCard key={booking.id} booking={booking} />
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          )}

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total Bookings</span>
                <Badge variant="secondary">{allBookings.length}</Badge>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Pending</span>
                <Badge className="bg-yellow-100 text-yellow-800">
                  {allBookings.filter(b => b.status === 'pending').length}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Confirmed</span>
                <Badge className="bg-blue-100 text-blue-800">
                  {allBookings.filter(b => b.status === 'confirmed').length}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Completed</span>
                <Badge className="bg-green-100 text-green-800">
                  {allBookings.filter(b => b.status === 'completed').length}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Bookings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Upcoming</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[200px]">
                <div className="space-y-2">
                  {allBookings
                    .filter(booking =>
                      new Date(booking.event_date) >= new Date() &&
                      ['pending', 'confirmed'].includes(booking.status)
                    )
                    .slice(0, 5)
                    .map(booking => (
                      <div
                        key={booking.id}
                        className="p-2 rounded border cursor-pointer hover:bg-muted/50"
                        onClick={() => onBookingClick?.(booking)}
                      >
                        <div className="font-medium text-sm">{booking.event_type}</div>
                        <div className="text-xs text-muted-foreground">
                          {format(new Date(booking.event_date), 'MMM d')} at {booking.event_time}
                        </div>
                        <Badge className={`text-xs mt-1 ${getStatusColor(booking.status)}`}>
                          {booking.status}
                        </Badge>
                      </div>
                    ))}
                  {allBookings.filter(b =>
                    new Date(b.event_date) >= new Date() &&
                    ['pending', 'confirmed'].includes(b.status)
                  ).length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No upcoming bookings
                    </p>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}