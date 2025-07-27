import axios from 'axios';

const API_URL = 'http://localhost:3005/api/users';

export const getUsers = () => axios.get(API_URL);
export const getUser = (id: number) => axios.get(`${API_URL}/${id}`);
export const createUser = (user: { name: string; email: string; password: string }) => axios.post(API_URL, user);
export const updateUser = (id: number, user: { name?: string; email?: string }) => axios.put(`${API_URL}/${id}`, user);
export const deleteUser = (id: number) => axios.delete(`${API_URL}/${id}`);

export const getUserTasks = (id: number) => axios.get(`${API_URL}/${id}/tasks`);
