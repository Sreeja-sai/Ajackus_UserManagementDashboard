// src/Services/api.js
import axios from 'axios';

// Use your own backend
const API_URL = 'https://ajackus-usermanagementdashboard.onrender.com/users';

export const getUsers = () => axios.get(API_URL);
export const addUser = (user) =>
  axios.post(API_URL, {
    first_name: user.firstName,
    last_name: user.lastName,
    email: user.email,
    department: user.department,
  });
export const updateUser = (id, user) =>
  axios.put(`${API_URL}/${id}`, {
    id: user.id,
    first_name: user.firstName,
    last_name: user.lastName,
    department: user.department,
  });
export const deleteUser = (id) => axios.delete(`${API_URL}/${id}`);
