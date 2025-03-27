import { useEffect, useState } from 'react';
import {
  Button,
  Dialog,
  Card,
  Input,
  Checkbox,
  Typography,
  CardFooter,
  CardBody,
  DialogHeader,
  DialogFooter,
  DialogBody, 
} from '@material-tailwind/react';
import { Calendar, MapPin, Users } from 'lucide-react';
import { Event } from '@/types';
import moment from 'moment';
import BookingsTable from './BookingsTable';

export default function ViewEventDetailsDialog({
  isOpen,
  onClose,
  event,
  bookings,
}: {
  isOpen: boolean;
  onClose: () => void;
  event: any;
  bookings: any[];
}) {

  return (
    <Dialog
      open={isOpen}
      handler={onClose}
      size="lg"
      dismiss={{
        outsidePress: false,
        escapeKey: false,
      }}
    >
      <DialogHeader>
        {event?.name || 'Invalid Booking'}
      </DialogHeader>
      <DialogBody className='h-[80vh] overflow-y-auto' divider={true}>
        <Typography color="blue-gray" className="mb-2">
          <Calendar className="float-left mr-2" />
          <span className="grid grid-flow-col">
            {moment(event?.date).format('MMMM DD, YYYY h:mm A') || ''}
          </span>
        </Typography>
        <Typography color="blue-gray" className="mb-2">
          <Users className="float-left mr-2" />
          <span className="grid grid-flow-col">
            {event?.total_bookings + '/' || ''}
            {event?.capacity || ''}
            {' (Available slots: ' + event?.available_slots + ')' || ''}
          </span>
        </Typography>
        <Typography color="blue-gray" className="mb-2">
          <MapPin className="float-left mr-2" />
          <span className="grid grid-flow-col">
            {event?.location || ''}
          </span>
        </Typography>
        <hr className='my-3' />
        {/* <Typography variant='h5' color="blue-gray">
          Bookings
        </Typography> */}
        <BookingsTable bookings={bookings} />
      </DialogBody>
      <DialogFooter>
          <Button
            variant="gradient"
            onClick={onClose}
            className="mr-1"
          >
            <span>Close</span>
          </Button>
        </DialogFooter>
    </Dialog>
  );
}
