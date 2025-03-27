import { useEffect, useState } from 'react';
import {
  Input,
  Button,
  Dialog,
  Textarea,
  IconButton,
  Typography,
  DialogBody,
  DialogHeader,
  DialogFooter,
} from '@material-tailwind/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useForm, SubmitHandler, useWatch, Form } from 'react-hook-form';
import moment from 'moment';
import { EventInputs } from '@/types';
import {
  createEvent as createEventService,
  updateEvent as updateEventService,
} from '@/services/eventService';

export default function CreateEventDialog({
  eventAction,
  isOpen,
  onClose,
  event,
}: {
  eventAction: string;
  isOpen: boolean;
  onClose: any;
  event: any;
}) {
  const [saveEventLoading, setSaveEventLoading] = useState<boolean>(false);
  const [minimumCapacity, setMinimumCapacity] = useState<number>(1);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<EventInputs>();

  const onSubmit: SubmitHandler<EventInputs> = async (data) => {
    try {
      setSaveEventLoading(true);
      const combinedDateTime = `${data.date} ${data.time}`;
      data.date = combinedDateTime; // Update the date field with the combined value
      if (eventAction === 'Edit' && event.id > 0) {
        const response = await updateEventService(event.id, data);
      } else {
        const response = await createEventService(data);
      }
      onClose(true);
      setValue('name', '');
      setValue('location', '');
      setValue('capacity', null);
      setValue('date', '');
      setValue('time', '');
      setValue('description', '');
    } catch (error) {
      console.log(error);
    } finally {
      setSaveEventLoading(false);
    }
  };

  // Update form values when the `event` prop changes
  useEffect(() => {
    setValue('name', event?.name || '');
    setValue('location', event?.location || '');
    setValue('capacity', event?.capacity || '');
    setValue(
      'date',
      event?.date ? moment(event.date).format('YYYY-MM-DD') : ''
    );
    setValue('time', event?.date ? moment(event.date).format('HH:mm') : '');
    setValue('description', event?.description || '');
    setMinimumCapacity(event?.total_bookings || 1);
  }, [event, setValue]);

  return (
    <Dialog
      size="sm"
      open={isOpen}
      handler={onClose}
      className="p-4"
      dismiss={{
        outsidePress: false,
        escapeKey: false,
      }}
    >
      <form
        onSubmit={handleSubmit(onSubmit)} // function to be called before the request
      >
        <DialogHeader className="relative m-0 block">
          <Typography variant="h4" color="blue-gray">
            {eventAction} Event
          </Typography>
          <IconButton
            size="sm"
            variant="text"
            className="!absolute right-3.5 top-3.5"
            onClick={() => onClose(false)}
          >
            <XMarkIcon className="h-4 w-4 stroke-2" />
          </IconButton>
        </DialogHeader>
        <DialogBody className="space-y-4 pb-6">
          <div>
            <Input
              {...register('name', { required: 'Name is required' })}
              color="gray"
              size="lg"
              label="Name"
              placeholder="eg. Skateboarding Competition"
            />
            {errors.name && (
              <Typography variant="small" color="red">
                {errors.name.message}
              </Typography>
            )}
          </div>
          <div>
            <Input
              {...register('location', { required: 'Location is required' })}
              color="gray"
              size="lg"
              label="Location"
              placeholder="eg. Baler Skatepark"
            />
            {errors.location && (
              <Typography variant="small" color="red">
                {errors.location.message}
              </Typography>
            )}
          </div>
          <div>
            <Input
              {...register('capacity', {
                required: 'Capacity is required',
                valueAsNumber: true,
                min: {
                  value: minimumCapacity,
                  message: `Capacity must be at least ${minimumCapacity}`,
                },
              })}
              color="gray"
              size="lg"
              label="Capacity"
              type="number"
              min={minimumCapacity}
              step={1}
              placeholder="eg. 10"
            />
            {errors.capacity && (
              <Typography variant="small" color="red">
                {errors.capacity.message}
              </Typography>
            )}
          </div>
          <div className="flex gap-4">
            <div className="w-full">
              <Typography
                variant="small"
                color="blue-gray"
                className="mb-2 text-left font-medium"
              >
                Date
              </Typography>
              <Input
                {...register('date', { required: 'Date is required' })}
                color="gray"
                size="lg"
                type="date"
                placeholder="YYYY-MM-DD"
                className="placeholder:opacity-100 focus:!border-t-gray-900"
                containerProps={{
                  className: '!min-w-full',
                }}
                labelProps={{
                  className: 'hidden',
                }}
              />
              {errors.date && (
                <Typography variant="small" color="red">
                  {errors.date.message}
                </Typography>
              )}
            </div>
            <div className="w-full">
              <Typography
                variant="small"
                color="blue-gray"
                className="mb-2 text-left font-medium"
              >
                Time
              </Typography>
              <Input
                {...register('time', { required: 'Time is required' })}
                color="gray"
                size="lg"
                placeholder="HH:mm"
                type="time"
                className="placeholder:opacity-100 focus:!border-t-gray-900"
                containerProps={{
                  className: '!min-w-full',
                }}
                labelProps={{
                  className: 'hidden',
                }}
              />
              {errors.time && (
                <Typography variant="small" color="red">
                  {errors.time.message}
                </Typography>
              )}
            </div>
          </div>
          <div>
            <Textarea
              {...register('description')}
              label="Description"
              rows={5}
            />
            {errors.description && (
              <Typography variant="small" color="red">
                {errors.description.message}
              </Typography>
            )}
          </div>
        </DialogBody>
        <DialogFooter>
          <Button className="ml-auto" type="submit" loading={saveEventLoading}>
            Save
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
}
