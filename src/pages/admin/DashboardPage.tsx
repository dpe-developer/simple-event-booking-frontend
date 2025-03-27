import { Typography, Card, CardBody, CardFooter, Button } from "@material-tailwind/react";
import { fetchDashboardData as fetchDashboardDataService } from '@/services/dashboardService';
import { useEffect, useState } from "react";
import CountUp from 'react-countup';

export default function Dashboard() {

  const [loading, setLoading] = useState(true);
  const [totalEvents, setTotalEvents] = useState<number>(0);
  const [totalBookings, setTotalBookings] = useState<number>(0);
  const [totalUsers, setTotalUsers] = useState<number>(0);

  useEffect(() => {
    fetchDashboardData();
    }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const response = await fetchDashboardDataService();
      setTotalEvents(response.totalEvents);
      setTotalBookings(response.totalBookings);
      setTotalUsers(response.totalUsers);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Typography variant="h3" color="blue-gray" className="mb-6 text-center">
        Dashboard Overview
      </Typography>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1 */}
        <Card>
          <CardBody>
            <Typography variant="h5" color="blue-gray" className="mb-2">
              Total Events
            </Typography>
            <Typography variant="h4">
              <CountUp
                start={0}
                end={totalEvents}
                duration={2.75}
                separator=", "
                decimal="."
              >
                {({ countUpRef, start }) => (
                  <div>
                    <span ref={countUpRef} />
                    <button onClick={start}></button>
                  </div>
                )}
              </CountUp>
            </Typography>
          </CardBody>
          {/* <CardFooter>
            <Button variant="gradient">
              View Details
            </Button>
          </CardFooter> */}
        </Card>

        {/* Card 2 */}
        <Card>
          <CardBody>
            <Typography variant="h5" color="blue-gray" className="mb-2">
              Total Bookings
            </Typography>
            <Typography variant="h4">
              <CountUp
                start={0}
                end={totalBookings}
                duration={2.75}
                separator=", "
                decimal="."
              >
                {({ countUpRef, start }) => (
                  <div>
                    <span ref={countUpRef} />
                    <button onClick={start}></button>
                  </div>
                )}
              </CountUp>
            </Typography>
          </CardBody>
          {/* <CardFooter>
            <Button variant="gradient">
              View Details
            </Button>
          </CardFooter> */}
        </Card>

        {/* Card 3 */}
        <Card>
          <CardBody>
            <Typography variant="h5" color="blue-gray" className="mb-2">
              Registered Users
            </Typography>
            <Typography variant="h4">
              <CountUp
                  start={0}
                  end={totalUsers}
                  duration={2.75}
                  separator=" "
                  decimal=","
                >
                  {({ countUpRef, start }) => (
                    <div>
                      <span ref={countUpRef} />
                      <button onClick={start}></button>
                    </div>
                  )}
                </CountUp>
            </Typography>
          </CardBody>
          {/* <CardFooter>
            <Button variant="gradient">
              View Details
            </Button>
          </CardFooter> */}
        </Card>
      </div>
    </>
  );
}