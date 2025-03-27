import axios from 'axios';
import axiosInstance from '../utils/axiosInstance';
import { EventInputs } from '@/types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const fetchUpcomingEvents = async (page: number, searchQuery: string) => {
  const response = await axios.get(`${API_BASE_URL}/upcoming-events`, {
    params: {
      page,
      search: searchQuery,
    },
  });
  return response.data;
};

export const createEvent = async (data: EventInputs) => {
  const response = await axiosInstance.post(`${API_BASE_URL}/admin/events`, data);
  return response.data;
};

export const fetchEvents = async (page: number, searchQuery: string) => {
  const response = await axiosInstance.get(`${API_BASE_URL}/admin/events`, {
    params: {
      page,
      search: searchQuery,
    },
  });
  return response.data;
};

export const fetchEvent = async (eventId: number) => {
  const response = await axiosInstance.get(`${API_BASE_URL}/admin/events/${eventId}`);
  return response.data;
};

export const updateEvent = async (eventId: number, data: EventInputs) => {
  const response = await axiosInstance.patch(`${API_BASE_URL}/admin/events/${eventId}`, data);
  return response.data;
};

export const deleteEvent = async (eventId: number) => {
  const response = await axiosInstance.delete(`${API_BASE_URL}/admin/events/${eventId}`);
  return response.data;
};

export const bookEvent = async (eventId: number) => {
  const response = await axiosInstance.post(`/events/${eventId}/book`);
  return response.data; // Return the response from the server
};