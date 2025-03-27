import { Button, Card, CardBody, CardFooter, Typography } from "@material-tailwind/react";
import SkeletonLoader from "@/components/EventSkeletonLoader";
import { Calendar, MapPin, Users } from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { cancelBooking, fetchBookings as fetchBookingsService } from '@/services/bookingService';
import moment from "moment";
import { useEffect, useState } from "react";
import Pagination from "@/components/Pagination";

export default function Booking() {

  type Booking = {
    /* id: number;
    name: string;
    description: string;
    date: string;
    location: string;
    capacity: number;
    total_bookings: number;
    available_slots: number; */
    id: any;
    user: any;
    event: any;
    created_at: any;
    
  };

  const [loading, setLoading] = useState(true);
  const [bookings, setEvents] = useState<Booking[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [expandedDescriptions, setExpandedDescriptions] = useState<{
    [key: number]: boolean;
  }>({}); // Track expanded state for each event

  // Fetch user bookings whenever the current page or search query changes
  useEffect(() => {
    fetchBookings(currentPage, searchQuery);
  }, [currentPage, searchQuery]);

  const fetchBookings = async (page: number, searchQuery: string) => {
    setLoading(true);
    try {
      const response = await fetchBookingsService(page, searchQuery);
      const bookingsData = response.data.bookings || [];
      setEvents(bookingsData);
      setCurrentPage(response.meta.current_page || 1);
      setLastPage(response.meta.last_page || 1);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId: number) => {
      try {
        const response = await cancelBooking(bookingId);
        alert(response.message); // Show success message
        // Optionally, refetch events to update available slots
        fetchBookings(currentPage, searchQuery);
      } catch (error: any) {
        console.error('Error booking event:', error);
        alert(error.response?.data?.error || 'Failed to book the event');
      }
    };

  const handleToggleDescription = (id: number) => {
    setExpandedDescriptions((prev) => ({
      ...prev,
      [id]: !prev[id], // Toggle the expanded state for the given booking ID
    }));
  };

  return (
    <>
      <Typography variant="h3" color="blue-gray" className="mb-6 text-center">
        Bookings
      </Typography>

      {/* Events */}
      {loading ? (
        <SkeletonLoader cols={2} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.map((booking) => (
            <Card key={booking.id} className="shadow-md flex flex-col justify-between">
              <CardBody>
                <Typography variant="h5" color="blue-gray" className="mb-2">
                  {booking.event.name}
                </Typography>
                <Typography color="blue-gray" className="mb-2">
                  <Calendar className="float-left mr-2" />
                  <span className="grid grid-flow-col">
                    {moment(booking.event.date).format('MMMM DD, YYYY h:mm A')}
                  </span>
                </Typography>
                <Typography color="blue-gray" className="mb-2">
                  <Users className="float-left mr-2" />
                  <span className="grid grid-flow-col">
                    {booking.event.available_slots}
                  </span>
                </Typography>
                <Typography color="blue-gray" className="mb-2">
                  <MapPin className="float-left mr-2" />
                  <span className="grid grid-flow-col">{booking.event.location}</span>
                </Typography>
                <div
                  className={`mb-2 ${
                    expandedDescriptions[booking.id] ? 'h-32 overflow-y-auto' : 'h-auto'
                  }`}
                >
                  <Typography color="blue-gray">
                    {expandedDescriptions[booking.id]
                      ? booking.event.description // Show full description if expanded
                      : booking.event.description.length > 100
                      ? `${booking.event.description.substring(0, 100)}...`
                      : booking.event.description}
                    {booking.event.description.length > 100 && (
                      <button
                        onClick={() => handleToggleDescription(booking.id)}
                        className="text-blue-500 hover:underline ml-2"
                      >
                        {expandedDescriptions[booking.id] ? 'Show Less' : 'Show More'}
                      </button>
                    )}
                  </Typography>
                </div>
              </CardBody>
              <CardFooter className="mt-auto flex justify-center pt-2">
                <ProtectedRoute>
                  <Button
                    onClick={() => handleCancelBooking(booking.id)}
                    className="justify-center"
                    color="red"
                    variant="gradient"
                  >
                    Cancel
                  </Button>
                </ProtectedRoute>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        lastPage={lastPage}
        loading={loading}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </>
  )

}
