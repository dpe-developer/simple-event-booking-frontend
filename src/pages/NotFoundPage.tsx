import { Typography } from '@material-tailwind/react';

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Typography variant="h3" color="red">
        404 - Page Not Found
      </Typography>
    </div>
  );
}
