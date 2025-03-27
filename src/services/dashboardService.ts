import axiosInstance from '../utils/axiosInstance';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const fetchDashboardData = async () => {
  const response = await axiosInstance.get(`${API_BASE_URL}/admin/dashboard`);
  return response.data;
};
