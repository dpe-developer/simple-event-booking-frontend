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
} from '@material-tailwind/react';
import { useAuth } from '@/contexts/AuthContext';

export default function RegisterModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { register } = useAuth();
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [passwordConfirmation, setPasswordConfirmation] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleRegistration = async () => {
    setLoading(true);
    try {
      await register({ name, email, password, passwordConfirmation });
      onClose();
      setName('');
      setEmail('');
      setPassword('');
      setPasswordConfirmation('');
      setLoading(false);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  // Handle Enter key press
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleRegistration();
    }
  };

  useEffect(() => {
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, email, password]); // Dependencies include `isOpen`, `email`, and `password`

  return (
    <Dialog
      open={isOpen}
      handler={onClose}
      size="xs"
      className="bg-transparent shadow-none"
    >
      <Card className="mx-auto w-full max-w-[24rem]">
        <CardBody className="flex flex-col gap-4">
          <Typography variant="h4" color="blue-gray">
            Sign Up
          </Typography>
          <Typography
            className="mb-3 font-normal"
            variant="paragraph"
            color="gray"
          >
            Enter your email and password to Sign In.
          </Typography>
          {error && (
            <Typography variant="small" color="red" className="text-center">
              {error}
            </Typography>
          )}
          <Typography className="-mb-2" variant="h6">
            Your Name
          </Typography>
          <Input
            label="Name"
            size="lg"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Typography className="-mb-2" variant="h6">
            Your Email
          </Typography>
          <Input
            type='email'
            label="Email"
            size="lg"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Typography className="-mb-2" variant="h6">
            Your Password
          </Typography>
          <Input
            label="Password"
            size="lg"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Typography className="-mb-2" variant="h6">
            Confirm Your Password
          </Typography>
          <Input
            label="Confirm Password"
            size="lg"
            type="password"
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
          />
          {/* <div className="-ml-2.5 -mt-3">
            <Checkbox label="Remember Me" />
          </div> */}
        </CardBody>
        <CardFooter className="pt-0">
          <Button variant="gradient" onClick={handleRegistration} loading={loading} fullWidth>
            Sign Up
          </Button>
          <Typography variant="small" className="mt-4 flex justify-center">
            Already have an account?
            <Typography
              as="a"
              href="#signup"
              variant="small"
              color="blue-gray"
              className="ml-1 font-bold"
            >
              Sign in
            </Typography>
          </Typography>
        </CardFooter>
      </Card>
    </Dialog>
  );
}
