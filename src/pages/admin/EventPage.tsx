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
import { Calendar, MapPin, Search, Users } from 'lucide-react';
import { fetchEvent,fetchEvents as fetchEventsService, deleteEvent } from '@/services/eventService';
import SkeletonLoader from '@/components/EventSkeletonLoader';
import Pagination from '@/components/Pagination';
import { Event } from '@/types/index';
import ViewEventDetailsDialog from '@/components/ViewEventDetailsDialog';
import CreateEventDialog from '@/components/CreateEventDialog';

export default function EventPage() {

  const [loading, setLoading] = useState<boolean>(true);
  const [isViewEventDetailsDialogOpen, setIsViewEventDetailsDialogOpen] = useState<boolean>(false);
  const [isEditEventDialogOpen, setIsCreateEventDialogOpen] = useState<boolean>(false);
  const [createEventDialogAction, setCreateEventDialogAction] = useState('Create');
  const [event, setEvent] = useState();
  const [editEvent, setEditEvent] = useState();
  const [eventBookings, setEventBookings] = useState([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [lastPage, setLastPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedDescriptions, setExpandedDescriptions] = useState<{
    [key: number]: boolean;
  }>({});
  const [loadingEditEvent, setLoadingEditEvent] = useState<{
    [key: number]: boolean;
  }>({});
  const [loadingEventDetails, setLoadingEventDetails] = useState<{
    [key: number]: boolean;
  }>({});
  const [loadingDeleteEvent, setLoadingDeleteEvent] = useState<{
    [key: number]: boolean;
  }>({});
  // const [loadingEventDetails, setLoadingEventDetails] = useState<boolean>(false);
  const handleOpenViewEventDetailsDialog = () => setIsViewEventDetailsDialogOpen(true);

  const handleCloseViewEventDetailsDialog = () => setIsViewEventDetailsDialogOpen(false);

  const handleOpenCreateEventDialog = (action: string) => {
    setCreateEventDialogAction(action);
    setIsCreateEventDialogOpen(true);
  };
  const handleCloseCreateEventDialog = (reloadEvents = false) => {
    if(reloadEvents){
      fetchEvents(currentPage, searchQuery);
    }
    setIsCreateEventDialogOpen(false)
  };

  const handleLoadingEditEventButton = (id: number) => {
    setLoadingEditEvent((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleLoadingViewEventButton = (id: number) => {
    setLoadingEventDetails((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };
  const handleDeleteEventButton = (id: number) => {
    setLoadingDeleteEvent((prev) => ({
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
    fetchEvents(currentPage, searchQuery);
  }, [currentPage, searchQuery]);

  // Reset current page to 1 when the search query changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to the first page
  };

  const handleViewEvent = async (eventId: number) => {
    handleLoadingViewEventButton(eventId);
    try {
      const response = await fetchEvent(eventId);
      setEvent(response.event);
      setEventBookings(response.bookings.bookings);
      setIsViewEventDetailsDialogOpen(true);
      handleOpenViewEventDetailsDialog;
      // setEvent(response);
    } catch (error: any) {
      console.error('Error booking event:', error);
      alert(error.response?.data?.error || 'Failed to book the event');
    } finally {
      handleLoadingViewEventButton(eventId);
    }
  };

  const fetchEvents = async (page: number, searchQuery: string) => {
    setLoading(true);
    try {
      const response = await fetchEventsService(page, searchQuery);
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

  const handleEditEvent = async (eventId: number) => {
    handleLoadingEditEventButton(eventId);
    try {
      const response = await fetchEvent(eventId);
      setEditEvent(response.event);
      handleOpenCreateEventDialog("Edit");
      // setEvent(response);
    } catch (error: any) {
      console.error('Error booking event:', error);
      alert(error.response?.data?.error || 'Failed to book the event');
    } finally {
      handleLoadingEditEventButton(eventId);
    }
  };

  const handleDeleteEvent = async (eventId: number) => {
    handleDeleteEventButton(eventId);
    try {
      if(confirm("Are you sure do you want to delete this event?")) {
        const response = await deleteEvent(eventId);
        fetchEvents(currentPage, searchQuery);
      }
    } catch (error: any) {
      console.error('Error booking event:', error);
      alert(error.response?.data?.error || 'Failed to book the event');
    } finally {
      handleDeleteEventButton(eventId);
    }
  };

  return (
    <>
      <Typography variant="h3" color="blue-gray" className="mb-5 text-center">
        Events
      </Typography>

      <div className="flex justify-center mb-5">
        <Button onClick={() => handleOpenCreateEventDialog("Create")} variant="gradient" color="green">
          Create Event
        </Button>
      </div>

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
          {events.map((event) => (
            <Card key={event.id} className="shadow-md flex flex-col justify-between">
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
                    {event.total_bookings}/{event.capacity}
                    {' (Available slots: ' + event.available_slots + ')'}
                  </span>
                </Typography>
                <Typography color="blue-gray" className="mb-2">
                  <MapPin className="float-left mr-2" />
                  <span className="grid grid-flow-col">{event.location}</span>
                </Typography>
                <div
                  className={`mb-2 ${
                    expandedDescriptions[event.id] ? 'h-32 overflow-y-auto' : 'h-auto'
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
                        {expandedDescriptions[event.id] ? 'Show Less' : 'Show More'}
                      </button>
                    )}
                  </Typography>
                </div>
              </CardBody>
              <CardFooter className="mt-auto flex justify-center items-center gap-4 pt-2">
                  <Button
                    onClick={() => handleViewEvent(event.id)}
                    className="justify-center"
                    variant="gradient"
                    loading={loadingEventDetails[event.id]}
                  >
                    View
                  </Button>
                  <Button
                    onClick={() => handleEditEvent(event.id)}
                    className="justify-center"
                    variant="gradient"
                    color="blue"
                    loading={loadingEditEvent[event.id]}
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDeleteEvent(event.id)}
                    className="justify-center"
                    variant="gradient"
                    color="red"
                    loading={loadingDeleteEvent[event.id]}
                  >
                    Delete
                  </Button>
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

      <ViewEventDetailsDialog
        isOpen={isViewEventDetailsDialogOpen}
        onClose={handleCloseViewEventDetailsDialog}
        event={event}
        bookings={eventBookings}
      />
      
      <CreateEventDialog isOpen={isEditEventDialogOpen} onClose={handleCloseCreateEventDialog} eventAction={createEventDialogAction} event={editEvent} />
    </>
  );
}