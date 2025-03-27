import { PencilIcon } from '@heroicons/react/24/solid';
import {
  ArrowDownTrayIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import {
  Card,
  CardHeader,
  Typography,
  Button,
  CardBody,
  Chip,
  CardFooter,
  Avatar,
  IconButton,
  Tooltip,
  Input,
} from '@material-tailwind/react';

const TABLE_HEAD = ['#', 'Name', 'Date Booked', 'Account', ''];

export default function BookingsTable({ bookings }: { bookings: any[] }) {
  return (
    <section className="w-full bg-white">
      <div className="p-6">
        <Typography variant="lead" color="blue-gray" className="font-bold">
          Bookings
        </Typography>
        <Typography className="mb-3 w-80 font-normal text-gray-600 md:w-full">
          Total {bookings.length}
        </Typography>
      </div>
      <Card className="h-auto w-full border border-gray-300">
        <CardBody className="p-0">
          <div className="overflow-y-auto max-h-[480px]">
            <table className="w-full min-w-max table-auto text-left">
              <thead className="sticky top-0 bg-blue-gray-50 z-10">
                <tr>
                  {TABLE_HEAD.map((head) => (
                    <th
                      key={head}
                      className="border-bottom border-blue-gray-100 bg-blue-gray-50/50 p-4"
                    >
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal leading-none opacity-70"
                      >
                        {head}
                      </Typography>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {bookings.length > 0 ? (
                  bookings.map((booking, index) => {
                    const isLast = index === bookings.length - 1;
                    const classes = isLast
                      ? 'p-4'
                      : 'p-4 border-b border-blue-gray-50';

                    return (
                      <tr key={booking.id}>
                        <td className={classes}>{index + 1}</td>
                        <td className={classes}>
                          <div className="flex items-center gap-3">
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-bold"
                            >
                              {booking.user.name}
                            </Typography>
                          </div>
                        </td>
                        <td className={classes}>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            {booking.created_at}
                          </Typography>
                        </td>
                        <td className={classes}>
                          <Tooltip content="Edit User">
                            <IconButton variant="text">
                              <PencilIcon className="h-4 w-4" />
                            </IconButton>
                          </Tooltip>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={4} className="p-4 text-center text-red-400">
                      *** EMPTY ***
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>
    </section>
  );
}
