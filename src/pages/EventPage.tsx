import { useState, useEffect } from 'react';
import {
  Typography,
  Card,
  CardBody,
  CardFooter,
  Button,
  Input,
} from '@material-tailwind/react';
import moment from 'moment';
import { Calendar, MapPin, Users } from 'lucide-react';
import {
  bookEvent,
  fetchUpcomingEvents as fetchUpcomingEventsService,
} from '@/services/eventService';
import ProtectedRoute from '@/components/ProtectedRoute';
import SkeletonLoader from '@/components/EventSkeletonLoader';
import Pagination from '@/components/Pagination';
import { Event } from '@/types/index';
import Swal from 'sweetalert2';

export default function EventPage() {
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<Event[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [bookEventLoading, setBookEventLoading] = useState<{
    [key: number]: boolean;
  }>({});
  const [expandedDescriptions, setExpandedDescriptions] = useState<{
    [key: number]: boolean;
  }>({});

  const handleBookEventLoadingButton = (id: number) => {
    setBookEventLoading((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleToggleDescription = (id: number) => {
    setExpandedDescriptions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Fetch events whenever the current page or search query changes
  useEffect(() => {
    fetchUpcomingEvents(currentPage, searchQuery);
  }, [currentPage, searchQuery]);

  // Reset current page to 1 when the search query changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to the first page
  };

  const handleBookEvent = async (eventId: number) => {
    handleBookEventLoadingButton(eventId);
    try {
      const response = await bookEvent(eventId);
      // alert(response.message);
      Swal.fire({
        title: response.message,
        icon: 'success',
        confirmButtonText: 'Ok',
        confirmButtonColor: '#212121',
      });
      fetchUpcomingEvents(currentPage, searchQuery);
    } catch (error: any) {
      console.error('Error booking event:', error);
      Swal.fire({
        title: 'Booking failed!',
        text: error.response?.data?.error || 'Failed to book the event',
        icon: 'warning',
        confirmButtonText: 'Ok',
        confirmButtonColor: '#212121',
      });
    } finally {
      handleBookEventLoadingButton(eventId);
    }
  };

  const fetchUpcomingEvents = async (page: number, searchQuery: string) => {
    setLoading(true);
    try {
      const response = await fetchUpcomingEventsService(page, searchQuery);
      const eventsData = response.data.events || [];
      setEvents(eventsData);
      setCurrentPage(response.meta.current_page || 1);
      setLastPage(response.meta.last_page || 1);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Typography variant="h3" color="blue-gray" className="mb-6 text-center">
        Events
      </Typography>

      {/* Filters */}
      <div className="mb-2 flex flex-col sm:flex-row gap-4">
        <Input
          label="Search Events"
          size="lg"
          value={searchQuery}
          onChange={handleSearchChange} // Use the new handler
          placeholder="Search by event name..."
        />
      </div>

      {/* Events */}
      {loading ? (
        <SkeletonLoader />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event: Event) => (
            <Card
              key={event.id}
              className="shadow-md flex flex-col justify-between"
            >
              <CardBody>
                <Typography variant="h5" color="blue-gray" className="mb-2">
                  {event.name}
                </Typography>
                <Typography color="blue-gray" className="mb-2">
                  <Calendar className="float-left mr-2" />
                  <span className="grid grid-flow-col">
                    {moment(event.date).format('MMMM DD, YYYY h:mm A')}
                  </span>
                </Typography>
                <Typography color="blue-gray" className="mb-2">
                  <Users className="float-left mr-2" />
                  <span className="grid grid-flow-col">
                    {event.available_slots} Available Slots
                  </span>
                </Typography>
                <Typography color="blue-gray" className="mb-2">
                  <MapPin className="float-left mr-2" />
                  <span className="grid grid-flow-col">{event.location}</span>
                </Typography>
                <div
                  className={`mb-2 ${
                    expandedDescriptions[event.id]
                      ? 'h-32 overflow-y-auto'
                      : 'h-auto'
                  }`}
                >
                  <Typography color="blue-gray">
                    {expandedDescriptions[event.id]
                      ? event.description // Show full description if expanded
                      : event.description.length > 100
                        ? `${event.description.substring(0, 100)}...`
                        : event.description}
                    {event.description.length > 100 && (
                      <button
                        onClick={() => handleToggleDescription(event.id)}
                        className="text-blue-500 hover:underline ml-2"
                      >
                        {expandedDescriptions[event.id]
                          ? 'Show Less'
                          : 'Show More'}
                      </button>
                    )}
                  </Typography>
                </div>
              </CardBody>
              <CardFooter className="mt-auto flex justify-center pt-2">
                <ProtectedRoute>
                  <Button
                    onClick={() => handleBookEvent(event.id)}
                    className="justify-center"
                    variant="gradient"
                    disabled={
                      event.available_slots <= 0 || bookEventLoading[event.id]
                    }
                    loading={bookEventLoading[event.id]}
                  >
                    {event.available_slots > 0 ? 'Book Now' : 'Fully Booked'}
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
        onPageChange={(page: number) => setCurrentPage(page)}
      />
    </>
  );
}
