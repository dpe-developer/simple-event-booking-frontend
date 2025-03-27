import axios from 'axios';
import axiosInstance from '../utils/axiosInstance';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const fetchBookings = async (page: number, searchQuery: string) => {
  const response = await axiosInstance.get(`${API_BASE_URL}/bookings`, {
    params: {
      page,
      search: searchQuery,
    },
  });
  return response.data;
};

export const cancelBooking = async (bookingId: number) => {
  const response = await axiosInstance.delete(`/bookings/${bookingId}`);
  return response.data; // Return the response from the server
};
