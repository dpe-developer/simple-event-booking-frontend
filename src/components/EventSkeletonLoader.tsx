import { Card, CardBody, Typography } from '@material-tailwind/react';

export default function SkeletonLoader({ count = 9, cols = 3 }: { count?: number, cols?: number }) {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-${cols} gap-6 animate-pulse`}>
      {Array.from({ length: count }).map((_, index) => (
        <Card className="shadow-none" key={index}>
          <CardBody>
            <Typography
              as="div"
              variant="h5"
              className="mb-3 h-4 w-3/4 rounded-full bg-gray-300"
            >
              &nbsp;
            </Typography>
            <Typography
              as="div"
              variant="paragraph"
              className="mb-3 h-2 w-2/3 rounded-full bg-gray-300"
            >
              &nbsp;
            </Typography>
            <Typography
              as="div"
              variant="paragraph"
              className="mb-2 h-2 w-auto rounded-full bg-gray-300"
            >
              &nbsp;
            </Typography>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}