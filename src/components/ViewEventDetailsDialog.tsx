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
  IconButton,
} from '@material-tailwind/react';
import { Calendar, MapPin, Users } from 'lucide-react';
import { Event } from '@/types';
import moment from 'moment';
import BookingsTable from './BookingsTable';
import { XMarkIcon } from '@heroicons/react/24/solid';

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
      <DialogHeader className="relative m-0 block">
        <Typography variant="h4" color="blue-gray">
          {event?.name || 'Invalid Event'}
        </Typography>
        <IconButton
          size="sm"
          variant="text"
          className="!absolute right-3.5 top-3.5"
          onClick={() => onClose()}
        >
          <XMarkIcon className="h-4 w-4 stroke-2" />
        </IconButton>
      </DialogHeader>
      <DialogBody className="overflow-y-auto h-[460px] sm:h-[750px]" divider={true}>
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
          <span className="grid grid-flow-col">{event?.location || ''}</span>
        </Typography>
        <hr className="my-3" />
        {/* <Typography variant='h5' color="blue-gray">
          Bookings
        </Typography> */}
        <BookingsTable bookings={bookings} />
      </DialogBody>
      <DialogFooter>
        <Button variant="gradient" onClick={onClose} className="mr-1">
          <span>Close</span>
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
