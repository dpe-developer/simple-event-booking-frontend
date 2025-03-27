import axiosInstance from '../utils/axiosInstance';
import Cookies from 'js-cookie';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const login = async (email: string, password: string) => {
  const response = await axiosInstance.post(`${API_BASE_URL}/auth/login`, {
    email,
    password,
  });
  const { token, user } = response.data;

  // Save token in cookies
  Cookies.set('token', token, { expires: 7 });
  // return  response.data;
  console.log(response.data);
  return { token, user };
};

export const register = async (
  name: string,
  email: string,
  password: string,
  passwordConfirmation: string
) => {
  const response = await axiosInstance.post(`${API_BASE_URL}/auth/register`, {
    name,
    email,
    password,
    password_confirmation: passwordConfirmation,
  });
  const { token, user } = response.data;

  // Save token in cookies
  Cookies.set('token', token, { expires: 7 });

  return { token, user };
};

export const fetchUser = async () => {
  const response = await axiosInstance.get(`${API_BASE_URL}/auth/user`);
  return response.data; // Return user data
};

export const logout = async () => {
  // Optionally, call a logout endpoint on the server
  await axiosInstance
    .post(`${API_BASE_URL}/auth/logout`)
    .then(() => {
      Cookies.remove('token'); // Remove token from cookies
    })
    .catch((error) => {
      console.log(error);
    })
    .finally(() => {
      Cookies.remove('token'); // Remove token from cookies
    });
};
