import {
  Navbar,
  Collapse,
  Typography,
  Button,
  IconButton,
  Spinner,
} from '@material-tailwind/react';
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import LoginModal from './LoginDialog';
import { useNavigate } from 'react-router-dom';
import RegisterModal from './RegisterDialog';

export default function StickyNavbar() {
  const navigate = useNavigate();
  const [openNav, setOpenNav] = useState(false);
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);
  const [isRegisterDialogOpen, setIsRegisterDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user, logout } = useAuth();

  // console.log(user);

  useEffect(() => {
    window.addEventListener(
      'resize',
      () => window.innerWidth >= 960 && setOpenNav(false)
    );
  }, []);

  const handleOpenLoginDialog = () => {
    setIsLoginDialogOpen(true);
  };

  const handleCloseLoginDialog = () => {
    setIsLoginDialogOpen(false);
  };

  const handleOpenRegisterDialog = () => {
    setIsRegisterDialogOpen(true);
  };

  const handleCloseRegisterDialog = () => {
    setIsRegisterDialogOpen(false);
  };

  const handleLogout = async () => {
    setLoading(true); // Set loading state to true
    try {
      await logout(); // Perform logout
      navigate('/');
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  const navList =
    user && user?.role === 'admin' ? (
      <ul className="mt-2 mb-4 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
        <Typography
          as="li"
          variant="small"
          color="blue-gray"
          className="p-1 font-normal"
        >
          <a href="/admin/dashboard" className="flex items-center">
            Dashboard
          </a>
        </Typography>
        <Typography
          as="li"
          variant="small"
          color="blue-gray"
          className="p-1 font-normal"
        >
          <a href="/admin/events" className="flex items-center">
            Events
          </a>
        </Typography>
      </ul>
    ) : (
      <ul className="mt-2 mb-4 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
        <Typography
          as="li"
          variant="small"
          color="blue-gray"
          className="p-1 font-normal"
        >
          <a href="/events" className="flex items-center">
            Events
          </a>
        </Typography>
        <Typography
          as="li"
          variant="small"
          color="blue-gray"
          className="p-1 font-normal"
        >
          <a href="/bookings" className="flex items-center">
            Bookings
          </a>
        </Typography>
      </ul>
    );

  return (
    <>
      <Navbar className="sticky top-0 z-10 h-max mx-auto rounded-none px-4 py-2 lg:px-8 lg:py-4">
        <div className="flex items-center justify-between text-blue-gray-900">
          <Typography
            as="a"
            href={user && user.role === 'admin' ? '/admin/dashboard' : '/'}
            className="mr-4 cursor-pointer py-1.5 font-medium"
          >
            Event Booking
          </Typography>
          <div className="flex-1 flex items-center justify-center">
            {user ? (
              <Typography className="py-1.5 font-medium">
                Hi {user.name}!
              </Typography>
            ) : null}
          </div>
          <div className="flex items-center gap-4">
            <div className="mr-4 hidden lg:block">
              {user && user.id ? navList : ''}
            </div>
            <div className="flex items-center gap-x-1">
              {user && user.id ? (
                <Button
                  fullWidth
                  variant="gradient"
                  size="sm"
                  className="hidden lg:inline-block"
                  onClick={handleLogout}
                  loading={loading}
                >
                  <span>Sign out</span>
                </Button>
              ) : (
                <>
                  <Button
                    variant="text"
                    size="sm"
                    className="hidden lg:inline-block"
                    onClick={handleOpenLoginDialog}
                  >
                    <span>Log In</span>
                  </Button>
                  <Button
                    variant="gradient"
                    size="sm"
                    className="hidden lg:inline-block"
                    onClick={handleOpenRegisterDialog}
                  >
                    <span>Sign Up</span>
                  </Button>
                </>
              )}
            </div>
            <IconButton
              variant="text"
              className="ml-auto h-6 w-6 text-inherit hover:bg-transparent focus:bg-transparent active:bg-transparent lg:hidden"
              ripple={false}
              onClick={() => setOpenNav(!openNav)}
            >
              {openNav ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  className="h-6 w-6"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </IconButton>
          </div>
        </div>
        <Collapse open={openNav}>
          {user && user.id && navList}
          <div className="flex items-center gap-x-1">
            {user ? (
              <Button
                fullWidth
                variant="gradient"
                size="sm"
                onClick={handleLogout}
                loading={loading}
                className="flex items-center justify-center gap-2"
              >
                Sign out
              </Button>
            ) : (
              <>
                <Button
                  onClick={handleOpenLoginDialog}
                  fullWidth
                  variant="text"
                  size="sm"
                  className=""
                >
                  <span>Log In</span>
                </Button>
                <Button
                  onClick={handleOpenRegisterDialog}
                  fullWidth
                  variant="gradient"
                  size="sm"
                >
                  <span>Sign Up</span>
                </Button>
              </>
            )}
          </div>
        </Collapse>
      </Navbar>
      <LoginModal isOpen={isLoginDialogOpen} onClose={handleCloseLoginDialog} />
      <RegisterModal
        isOpen={isRegisterDialogOpen}
        onClose={handleCloseRegisterDialog}
      />
    </>
  );
}
